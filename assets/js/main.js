;(() => {
  'use strict'

  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]

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
