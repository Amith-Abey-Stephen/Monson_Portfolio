import { loadPortfolioContent } from './content-model.js'

;(() => {
  'use strict'

  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]

  /* --- Content Hydration (Cloudflare KV & Live CMS) --- */
  const hydrateContent = (data) => {
    if (!data) return
    try {
      // 0. Section Toggles (Show / Hide entire sections)
      if (data.sections) {
        const sectionMap = {
          hero: $('.hero'),
          intro: $('#intro'),
          work: $('#work'),
          philosophy: $('#philosophy'),
          services: $('#services'),
          about: $('#about'),
          playground: $('#playground'),
          tools: $('.marquee'),
          journal: $('#journal'),
          collab: $('.collab'),
          contact: $('#contact'),
        }

        Object.entries(sectionMap).forEach(([key, el]) => {
          if (el) {
            const isVisible = data.sections[key] !== false
            el.style.display = isVisible ? '' : 'none'

            // Also update main nav and mobile nav items for this anchor
            const anchors = $$(`a[href="#${key}"], a[href="#top"]`)
            anchors.forEach((a) => {
              if (key === 'hero' && a.getAttribute('href') === '#top') return
              if (a.closest('.nav-center') || a.closest('.mobile-menu') || a.closest('.footer-nav')) {
                a.style.display = isVisible ? '' : 'none'
              }
            })
          }
        })
      }

      // 1. Personal & Brand
      if (data.personal) {
        if (data.personal.brandName) {
          const brand = $('.nav-left')
          if (brand) brand.textContent = data.personal.brandName
          const fBrand = $('.footer-brand')
          if (fBrand) fBrand.textContent = data.personal.brandName
        }
        if (data.personal.email) {
          $$('a[href^="mailto:"]').forEach((a) => {
            a.href = `mailto:${data.personal.email}`
            if (a.classList.contains('email-cta')) {
              a.innerHTML = `${data.personal.email} <span aria-hidden="true">↗</span>`
            }
          })
        }
        if (data.personal.statusText) {
          const badgeText = $('.float-badge span:nth-child(2)')
          if (badgeText) badgeText.textContent = data.personal.statusText
        }
        if (data.personal.statusBadge2) {
          const b2Title = $('.float-badge2 div > div:first-child')
          if (b2Title) b2Title.textContent = data.personal.statusBadge2
        }
        if (data.personal.statusBadge2Sub) {
          const b2Sub = $('.float-badge2 div > div:last-child')
          if (b2Sub) b2Sub.textContent = data.personal.statusBadge2Sub
        }

        // Dynamic Social Links
        if (Array.isArray(data.personal.socials) && data.personal.socials.length > 0) {
          const socContainer = $('.social')
          if (socContainer) {
            socContainer.innerHTML = data.personal.socials
              .filter((s) => s.url)
              .map(
                (s) =>
                  `<a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.platform || s.label}">${s.label || s.platform}</a>`
              )
              .join('')
          }
        }
      }

      // 2. Hero
      if (data.hero) {
        const eyebrow = $('.hero .eyebrow')
        if (eyebrow && data.hero.eyebrow) eyebrow.textContent = data.hero.eyebrow

        const heroH1 = $('#hero-heading')
        if (heroH1 && (data.hero.h1Line1 || data.hero.h1Line2 || data.hero.h1Line3)) {
          heroH1.innerHTML = `
            <span class="line"><span>${data.hero.h1Line1 || 'I design <i>digital</i>'}</span></span>
            <span class="line"><span>${data.hero.h1Line2 || 'experiences that <i>feel</i>'}</span></span>
            <span class="line"><span>${data.hero.h1Line3 || 'as good as they look.'}</span></span>
          `
        }

        const heroDesc = $('.hero-desc')
        if (heroDesc && data.hero.description) heroDesc.textContent = data.hero.description

        const heroCta = $('.hero-ctas .btn-primary')
        if (heroCta && data.hero.ctaText) {
          heroCta.innerHTML = `${data.hero.ctaText} <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 13L13 1H3.5M13 1V10.5" stroke="currentColor" stroke-width="1.4"/></svg>`
          if (data.hero.ctaLink) heroCta.href = data.hero.ctaLink
        }

        const heroImg = $('.hero-img-main img')
        if (heroImg && data.hero.workspaceImage) heroImg.src = data.hero.workspaceImage

        const wsBadge = $('.hero-img-main div[style*="backdrop-filter"]')
        if (wsBadge && data.hero.workspaceTitle) wsBadge.textContent = `◐ ${data.hero.workspaceTitle}`

        const portraitImg = $('.portrait-card img')
        if (portraitImg && data.hero.portraitImage) portraitImg.src = data.hero.portraitImage

        const avatarImg = $('.float-badge .avatar img')
        if (avatarImg && data.hero.avatarImage) avatarImg.src = data.hero.avatarImage

        const sysTitle = $('.stat-card .k')
        if (sysTitle && data.hero.systemBadgeTitle) sysTitle.textContent = data.hero.systemBadgeTitle
        const sysVal = $('.stat-card .v')
        if (sysVal && data.hero.systemBadgeValue) sysVal.textContent = data.hero.systemBadgeValue
        const sysSub = $('.stat-card div:last-child')
        if (sysSub && data.hero.systemBadgeSub) sysSub.textContent = data.hero.systemBadgeSub
      }

      // 3. Intro
      if (data.intro) {
        const iLabel = $('.intro .label')
        if (iLabel && data.intro.label) iLabel.textContent = data.intro.label
        const iHeading = $('#intro-heading')
        if (iHeading && data.intro.heading) iHeading.innerHTML = data.intro.heading.replace(/(\n)/g, '<br/>')
        const iDesc = $('.intro p')
        if (iDesc && data.intro.description) iDesc.textContent = data.intro.description
        const iBtn = $('.intro .btn-ghost')
        if (iBtn && data.intro.buttonText) {
          iBtn.innerHTML = `${data.intro.buttonText} <span class="arr" aria-hidden="true">↗</span>`
          if (data.intro.buttonLink) iBtn.href = data.intro.buttonLink
        }
      }

      // 4. Projects (Filtered by visible)
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        const grid = $('.work-grid')
        if (grid) {
          const visibleProjects = data.projects.filter((p) => p.visible !== false)
          grid.innerHTML = visibleProjects
            .map(
              (p, idx) => `
            <article class="project ${idx % 2 === 1 ? 'reverse' : ''}">
              <div class="p-media" data-cursor="VIEW CASE STUDY ↗" tabindex="0" role="button" aria-label="View ${p.title} case study">
                <img loading="lazy" decoding="async" width="1200" height="960" src="${p.image}" alt="${p.title} — preview" />
                <span class="p-tag">${p.tag || p.title}</span>
                <span class="p-year">${p.year || ''}</span>
              </div>
              <div class="p-meta">
                <div class="p-cat">${p.category || ''}</div>
                <h3>${p.title}</h3>
                <p>${p.description || ''}</p>
                <a class="p-link" href="${p.link || '#work'}" aria-label="View ${p.title} case study">
                  ${p.linkText || 'View Case Study'}
                  <span class="arr" aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          `
            )
            .join('')
        }
      }

      // 5. Services (Filtered by visible)
      if (Array.isArray(data.services) && data.services.length > 0) {
        const sList = $('.service-list')
        if (sList) {
          const visibleServices = data.services.filter((s) => s.visible !== false)
          sList.innerHTML = visibleServices
            .map(
              (s, idx) => `
            <div class="service-row" data-cursor="EXPLORE ↗" role="listitem" tabindex="0">
              <span class="s-num">${s.num || String(idx + 1).padStart(2, '0')}</span>
              <div>
                <h3>${s.title}</h3>
                <div class="s-desc">${s.desc || ''}</div>
              </div>
              <div style="display: flex; gap: 10px; align-items: center">
                <div class="service-preview">
                  <img loading="lazy" decoding="async" width="300" height="200" src="${s.image}" alt="${s.title} preview" />
                </div>
                <span class="s-arrow" aria-hidden="true">↗</span>
              </div>
            </div>
          `
            )
            .join('')
        }
      }

      // 6. About & Career Timeline
      if (data.about) {
        const aHeading = $('#about-heading')
        if (aHeading && data.about.heading) aHeading.innerHTML = data.about.heading.replace(/(\n)/g, '<br/>')
        const aBio = $('.about-content > p')
        if (aBio && data.about.bio) aBio.textContent = data.about.bio
        const aImgMain = $('.about-media > img')
        if (aImgMain && data.about.imageMain) aImgMain.src = data.about.imageMain
        const aImgSm = $('.about-badge .av img')
        if (aImgSm && data.about.imageSmall) aImgSm.src = data.about.imageSmall
        const aExp = $('.about-badge div > div:last-child')
        if (aExp && data.about.experienceYears) aExp.textContent = `UI/UX Designer · ${data.about.experienceYears}`

        const metaDivs = $$('.about-meta > div')
        if (metaDivs.length >= 2) {
          if (data.about.basedIn) metaDivs[0].innerHTML = `<strong>Based in</strong> ${data.about.basedIn}`
          if (data.about.availability)
            metaDivs[1].innerHTML = `<strong>Availability</strong> ${data.about.availability}`
        }

        if (Array.isArray(data.about.stats) && data.about.stats.length > 0) {
          const statsContainer = $('.about-stats')
          if (statsContainer) {
            statsContainer.innerHTML = data.about.stats
              .map((st) => `<div><b>${st.value}</b><span>${st.label}</span></div>`)
              .join('')
          }
        }
      }

      // 7. Playground (Filtered by visible)
      if (Array.isArray(data.playground) && data.playground.length > 0) {
        const pgTrack = $('#pgTrack')
        if (pgTrack) {
          const visiblePlayground = data.playground.filter((item) => item.visible !== false)
          pgTrack.innerHTML = visiblePlayground
            .map(
              (item) => `
            <div class="pg-card" data-cursor="EXPLORE ↗" tabindex="0" role="button" aria-label="Open ${item.title}">
              <img loading="lazy" decoding="async" width="600" height="500" src="${item.image}" alt="Playground — ${item.title}" />
              <div class="pg-overlay">
                <div>
                  <b>${item.title}</b>
                  <br />
                  <span>${item.category || ''}</span>
                </div>
                <span class="pg-pill" aria-hidden="true">↗</span>
              </div>
            </div>
          `
            )
            .join('')
        }
      }

      // 8. Dynamic Tools Marquee
      if (Array.isArray(data.tools) && data.tools.length > 0) {
        const marqueeTrack = $('#marquee')
        if (marqueeTrack) {
          const toolItems = data.tools.map((t) => `<span>${t}</span><i></i>`).join('')
          marqueeTrack.innerHTML = toolItems + toolItems
        }
      }

      // 9. Journal (Filtered by visible)
      if (Array.isArray(data.journal) && data.journal.length > 0) {
        const jList = $('.journal-list')
        if (jList) {
          const visibleJournal = data.journal.filter((j) => j.visible !== false)
          jList.innerHTML = visibleJournal
            .map(
              (j) => `
            <a class="j-row" href="${j.link || '#journal'}" data-cursor="READ ↗" aria-label="Read: ${j.title}">
              <div>
                <div class="j-meta">
                  <span>${j.date || ''}</span>
                  <i aria-hidden="true"></i>
                  <span>${j.tag || 'Design'}</span>
                  <i aria-hidden="true"></i>
                  <span>${j.readTime || '5 min'}</span>
                </div>
                <h3>${j.title}</h3>
                <div class="j-excerpt">${j.excerpt || ''}</div>
              </div>
              <div style="display: flex; gap: 12px; align-items: center">
                <div class="j-thumb">
                  <img loading="lazy" decoding="async" width="300" height="200" src="${j.image}" alt="${j.title} cover" />
                </div>
                <span class="j-arrow" aria-hidden="true">↗</span>
              </div>
            </a>
          `
            )
            .join('')
        }
      }

      // Collab & Contact
      if (data.collab) {
        const colHead = $('#collab-heading')
        if (colHead && data.collab.heading) colHead.innerHTML = data.collab.heading.replace(/(\n)/g, '<br/>')
        const colDesc = $('.collab p')
        if (colDesc && data.collab.description) colDesc.textContent = data.collab.description
        const colBtn = $('.collab .btn-primary')
        if (colBtn && data.collab.ctaText) {
          colBtn.innerHTML = `${data.collab.ctaText} <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 13L13 1M13 1H3.5M13 1V10.5" stroke="currentColor" stroke-width="1.4"/></svg>`
          if (data.collab.ctaLink) colBtn.href = data.collab.ctaLink
        }
      }

      if (data.contact) {
        const conHead = $('#contact-heading')
        if (conHead && data.contact.heading) conHead.innerHTML = data.contact.heading.replace(/(\n)/g, '<br/>')
        const conSub = $('.final-sub')
        if (conSub && data.contact.subtext) conSub.textContent = data.contact.subtext
      }

      if (data.footer) {
        const fSummary = $('.footer-small')
        if (fSummary && data.footer.summary) fSummary.textContent = data.footer.summary
        const fCopy = $('.footer-bottom span:first-child')
        if (fCopy && data.footer.copyright) fCopy.textContent = data.footer.copyright
        const fTag = $('.footer-bottom span:last-child')
        if (fTag && data.footer.tagline) fTag.textContent = data.footer.tagline
      }
    } catch (e) {
      console.warn('[hydration error]', e)
    }
  }

  // Load content asynchronously and hydrate
  loadPortfolioContent().then((content) => {
    hydrateContent(content)
  })

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window

  /* --- Nav scroll --- */
  const nav = $('#nav')
  if (nav) {
    const onScrollNav = () => {
      if (window.scrollY > 20) nav.classList.add('scrolled')
      else nav.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScrollNav, { passive: true })
    onScrollNav()
  }

  /* --- Mobile menu (a11y) --- */
  const ham = $('#hamburger')
  const mob = $('#mobileMenu')
  if (ham && mob) {
    const focusableSel = 'a[href], button:not([disabled])'
    let lastFocus = null

    const trapFocus = (e) => {
      if (!mob.classList.contains('open')) return
      if (e.key !== 'Tab') return
      const nodes = $$(focusableSel, mob).filter((el) => el.offsetParent !== null)
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const setExpanded = (open) => {
      ham.setAttribute('aria-expanded', String(open))
      ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      mob.setAttribute('aria-hidden', String(!open))
      mob.inert = !open ? true : false
      // allow CSS transition: keep hidden attr for a11y but show when open
      if (open) mob.removeAttribute('hidden')
    }

    // init state
    ham.setAttribute('aria-expanded', 'false')
    ham.setAttribute('aria-controls', 'mobileMenu')
    mob.setAttribute('aria-hidden', 'true')
    mob.setAttribute('role', 'dialog')
    mob.setAttribute('aria-modal', 'true')
    mob.setAttribute('aria-label', 'Navigation menu')
    try {
      mob.inert = true
    } catch (_e) {
      void _e /* inert not supported */
    }
    mob.setAttribute('hidden', '')

    ham.addEventListener('click', () => {
      const willOpen = !mob.classList.contains('open')
      if (willOpen) lastFocus = document.activeElement
      ham.classList.toggle('open', willOpen)
      mob.classList.toggle('open', willOpen)
      document.body.style.overflow = willOpen ? 'hidden' : ''
      setExpanded(willOpen)
      if (willOpen) {
        const firstLink = $(focusableSel, mob)
        if (firstLink) firstLink.focus()
        document.addEventListener('keydown', trapFocus)
      } else {
        document.removeEventListener('keydown', trapFocus)
        if (lastFocus) lastFocus.focus()
        setTimeout(() => {
          if (!mob.classList.contains('open')) mob.setAttribute('hidden', '')
        }, 600)
      }
    })

    // close on link click
    $$('a', mob).forEach((a) =>
      a.addEventListener('click', () => {
        ham.classList.remove('open')
        mob.classList.remove('open')
        document.body.style.overflow = ''
        setExpanded(false)
        document.removeEventListener('keydown', trapFocus)
        setTimeout(() => mob.setAttribute('hidden', ''), 600)
      })
    )

    // close on ESC & click outside / resize
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mob.classList.contains('open')) ham.click()
    })
    window.addEventListener(
      'resize',
      () => {
        if (window.innerWidth > 720 && mob.classList.contains('open')) ham.click()
      },
      { passive: true }
    )
  }

  /* --- Reveal on scroll (with fallback) --- */
  const revealEls = $$('.reveal, .divider')
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            e.target.querySelectorAll('.divider').forEach((d) => d.classList.add('in'))
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    )
    revealEls.forEach((el) => obs.observe(el))
  } else {
    revealEls.forEach((el) => el.classList.add('in'))
  }

  /* --- Custom cursor (desktop only, respects reduced motion) --- */
  const cursor = $('#cursor')
  const cursorLabel = $('#cursorLabel')
  if (cursor && cursorLabel && !isTouch && !prefersReducedMotion) {
    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0
    let rafId = null
    let visible = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        cursor.classList.add('visible')
        visible = true
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const loop = () => {
      cx += (mx - cx) * 0.14
      cy += (my - cy) * 0.14
      cursor.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`
      rafId = requestAnimationFrame(loop)
    }
    loop()

    // hide when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible')
      visible = false
    })
    document.addEventListener('mouseenter', () => {
      cursor.classList.add('visible')
      visible = true
    })

    // pause when tab hidden for perf
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = null
      } else if (!rafId) loop()
    })

    $$('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const t = el.getAttribute('data-cursor') || 'VIEW'
        cursorLabel.textContent = t
        const big = el.classList.contains('p-media') || el.classList.contains('pg-card')
        cursor.classList.add(big ? 'hover' : 'hover-sm')
      })
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover', 'hover-sm'))
      // a11y: ensure keyboard users don't get stuck cursor state
      el.addEventListener('focus', () => cursor.classList.remove('hover', 'hover-sm'))
    })

    // subtle image inertia
    $$('.p-media').forEach((media) => {
      const img = $('img', media)
      if (!img) return
      media.addEventListener(
        'mousemove',
        (e) => {
          const r = media.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width - 0.5
          const y = (e.clientY - r.top) / r.height - 0.5
          img.style.transform = `scale(1.04) translate(${x * 10}px, ${y * 10}px)`
        },
        { passive: true }
      )
      media.addEventListener('mouseleave', () => {
        img.style.transform = ''
      })
    })
  } else if (cursor) {
    cursor.style.display = 'none'
  }

  /* --- Magnetic buttons (respect reduced motion) --- */
  if (!prefersReducedMotion && !isTouch) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener(
        'mousemove',
        (e) => {
          const r = btn.getBoundingClientRect()
          const x = (e.clientX - (r.left + r.width / 2)) * 0.22
          const y = (e.clientY - (r.top + r.height / 2)) * 0.32
          btn.style.transform = `translate(${x}px,${y}px)`
        },
        { passive: true }
      )
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = ''
      })
    })
  }

  /* --- Parallax (rAF throttled, disabled for reduced motion) --- */
  if (!prefersReducedMotion) {
    let ticking = false
    const parallaxEls = $$('.parallax')
    if (parallaxEls.length) {
      const updateParallax = () => {
        const sy = window.scrollY
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.dataset.speed || '0.06')
          const rect = el.getBoundingClientRect()
          const offset = (rect.top + window.scrollY) * speed
          const delta = (sy - offset) * -0.02
          // keep original rotate
          el.style.transform = `translateY(${delta}px) rotate(-0.6deg)`
        })
        ticking = false
      }
      window.addEventListener(
        'scroll',
        () => {
          if (ticking) return
          ticking = true
          requestAnimationFrame(updateParallax)
        },
        { passive: true }
      )
    }
  }

  /* --- Case study toast (delegated, no layout thrash) --- */
  $$('.p-link').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
      const card = a.closest('.project')?.querySelector('.p-media')
      if (card) {
        card.style.transition = 'transform .65s cubic-bezier(.16,1,.3,1), opacity .45s'
        card.style.transform = 'scale(1.02)'
        setTimeout(() => {
          card.style.transform = ''
        }, 700)
      }
      const ov = document.createElement('div')
      ov.setAttribute('aria-hidden', 'true')
      ov.style.cssText =
        'position:fixed;inset:0;background:#0E0E0E;opacity:0;pointer-events:none;z-index:100;transition:opacity .55s'
      document.body.appendChild(ov)
      requestAnimationFrame(() => {
        ov.style.opacity = '0.08'
      })
      setTimeout(() => {
        ov.style.opacity = '0'
        setTimeout(() => ov.remove(), 600)
      }, 700)

      let t = $('#toast')
      if (!t) {
        t = document.createElement('div')
        t.id = 'toast'
        t.setAttribute('role', 'status')
        t.setAttribute('aria-live', 'polite')
        t.setAttribute('aria-atomic', 'true')
        t.style.cssText =
          'position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(12px);background:#111;color:#fff;padding:10px 16px;border-radius:999px;font-size:13px;letter-spacing:.02em;opacity:0;transition:all .35s;z-index:99;pointer-events:none'
        document.body.appendChild(t)
      }
      t.textContent = 'Case study — coming soon'
      // force reflow then show
      void t.offsetWidth
      t.style.opacity = '1'
      t.style.transform = 'translateX(-50%) translateY(0)'
      clearTimeout(t._hideTimer)
      t._hideTimer = setTimeout(() => {
        t.style.opacity = '0'
        t.style.transform = 'translateX(-50%) translateY(12px)'
      }, 2200)
    })
  })

  /* --- Playground drag to scroll + keyboard + wheel --- */
  const track = $('#pgTrack')
  if (track) {
    let isDown = false,
      startX = 0,
      scrollLeft = 0,
      hasDragged = false

    track.setAttribute('tabindex', '0')
    track.setAttribute('role', 'region')
    track.setAttribute('aria-label', 'Playground gallery — drag or arrow keys to scroll')

    // keyboard
    track.addEventListener('keydown', (e) => {
      const step = 340
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        track.scrollBy({ left: step, behavior: 'smooth' })
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        track.scrollBy({ left: -step, behavior: 'smooth' })
      }
    })

    track.addEventListener('mousedown', (e) => {
      isDown = true
      hasDragged = false
      track.style.cursor = 'grabbing'
      track.style.userSelect = 'none'
      startX = e.pageX - track.offsetLeft
      scrollLeft = track.scrollLeft
    })
    window.addEventListener('mouseup', () => {
      isDown = false
      track.style.cursor = ''
      track.style.userSelect = ''
      if (hasDragged) {
        // prevent click after drag
        const handler = (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          track.removeEventListener('click', handler, true)
        }
        track.addEventListener('click', handler, true)
        setTimeout(() => track.removeEventListener('click', handler, true), 0)
      }
    })
    track.addEventListener('mouseleave', () => {
      isDown = false
      track.style.cursor = ''
      track.style.userSelect = ''
    })
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - track.offsetLeft
      const walk = (x - startX) * 1.4
      if (Math.abs(walk) > 3) hasDragged = true
      track.scrollLeft = scrollLeft - walk
    })

    // touch handled natively by overflow-x, but improve momentum
    let touchStartX = 0,
      touchScrollLeft = 0
    track.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.touches[0].pageX - track.offsetLeft
        touchScrollLeft = track.scrollLeft
      },
      { passive: true }
    )
    track.addEventListener(
      'touchmove',
      (e) => {
        const x = e.touches[0].pageX - track.offsetLeft
        track.scrollLeft = touchScrollLeft - (x - touchStartX)
      },
      { passive: true }
    )

    // wheel horizontal
    track.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && Math.abs(e.deltaY) > 0) {
          // convert vertical wheel to horizontal
          track.scrollLeft += e.deltaY
          e.preventDefault()
        }
      },
      { passive: false }
    )
  }

  /* --- Image error fallback (local + remote) --- */
  document.addEventListener(
    'error',
    (e) => {
      const t = e.target
      if (t.tagName !== 'IMG') return
      if (t.dataset.fallback) return
      t.dataset.fallback = '1'
      const src = t.getAttribute('src') || ''
      const map = {
        'assets/images/projects/desknet.jpg':
          'https://images.unsplash.com/photo-1499951360447-b19be2c0e1a8?w=1200&q=80&auto=format&fit=crop',
        'assets/images/projects/macsetup.jpg':
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop',
        'assets/images/projects/keyvora.jpg':
          'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=1200&q=80&auto=format&fit=crop',
        'assets/images/projects/rigraid.jpg':
          'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80&auto=format&fit=crop',
      }
      if (map[src]) t.src = map[src]
      else {
        // generic fallback stays as broken, but prevent infinite loop
        t.style.background = '#E8E5DF'
        t.alt = t.alt || 'Image unavailable'
      }
    },
    true
  )

  /* --- Performance: warm up important connections --- */
  // Already preconnected fonts; nothing else

  /* --- Dev check (only when verbose) --- */
  window.addEventListener('load', () => {
    const checks = {
      nav: !!$('#nav'),
      hero: !!$('.hero'),
      intro: !!$('#intro'),
      work: $$('.project').length === 4,
      philosophy: !!$('#philosophy'),
      services: $$('.service-row').length === 5,
      about: !!$('#about'),
      playground: $$('.pg-card').length === 6,
      marquee: !!$('.marquee-track'),
      journal: $$('.j-row').length === 3,
      collab: !!$('.collab'),
      final: !!$('#contact'),
      footer: !!$('.footer'),
    }
    const imgs = [...document.images]
    const imgOk = imgs.filter((i) => i.complete && i.naturalWidth > 0).length
    // expose for QA, but don't spam console in production
    window.__MONSON_CHECK = { checks, imgOk, total: imgs.length }
    if (localStorage.getItem('ms-verbose') === '1') {
      // eslint-disable-next-line no-console
      console.log(
        '%c MONSON SUNNY — CHECK ',
        'background:#0E0E0E;color:#fff;padding:6px 10px;border-radius:6px',
        checks
      )
      // eslint-disable-next-line no-console
      console.log(`Images: ${imgOk}/${imgs.length} loaded`)
      // eslint-disable-next-line no-console
      console.table(checks)
    }
    // CLS guard: if images failed, log warning once
    if (imgOk < imgs.length) {
      console.warn(`[perf] ${imgs.length - imgOk} image(s) failed to load`)
    }
  })

  /* --- No-JS fallback cleanup --- */
  document.documentElement.classList.remove('no-js')
  document.documentElement.classList.add('js')
})()
