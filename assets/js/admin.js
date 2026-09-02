/**
 * Monson Sunny Portfolio — Admin CMS Engine (v2.5)
 * Scalable Architecture: Section Toggles, Item Reordering, Visibility Toggles,
 * Extensible Socials & Tools, Media Uploads & Cloudflare Sync
 */

import {
  DEFAULT_PORTFOLIO_CONTENT,
  loadPortfolioContent,
  savePortfolioContent,
  uploadMediaFile,
  verifyPassword,
  trackReplacedImage,
  cleanupExpiredImages,
  syncAllAssetsToR2,
  deleteMediaFile
} from './content-model.js'

;(() => {
  'use strict'

  const AUTH_KEY = import.meta.env?.VITE_AUTH_KEY || 'portfolio_admin_auth'
  const AUTH_EXPIRY_KEY = import.meta.env?.VITE_AUTH_EXPIRY_KEY || 'portfolio_admin_expiry'
  const SESSION_TIMEOUT_MINUTES = parseInt(import.meta.env?.VITE_SESSION_TIMEOUT_MINUTES || '15', 10)
  const INACTIVITY_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000
  const WARNING_BEFORE_TIMEOUT_MS = parseInt(import.meta.env?.VITE_WARNING_BEFORE_TIMEOUT_MS || '60000', 10)

  let currentContent = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_CONTENT))
  let currentPassword = localStorage.getItem(AUTH_KEY) || ''

  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]

  // Utility: Deep property getter & setter
  function getDeepProp(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  function setDeepProp(obj, path, val) {
    const parts = path.split('.')
    const last = parts.pop()
    const target = parts.reduce((acc, part) => {
      if (!acc[part]) acc[part] = {}
      return acc[part]
    }, obj)
    target[last] = val
  }

  // Toast notification
  function showToast(msg, duration = 3500) {
    const toast = $('#adminToast')
    if (!toast) return
    toast.textContent = msg
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), duration)
  }

  // Auth & Session Management (Environment-configurable idle timeout)
  let lastActivityTime = Date.now()
  let sessionTimerInterval = null

  function initAuth() {
    const authOverlay = $('#authOverlay')
    const authForm = $('#authForm')
    const authPass = $('#adminPass')
    const authError = $('#authError')
    const btnLogout = $('#btnLogout')
    const sessionWarnModal = $('#sessionWarnModal')
    const sessionCountdown = $('#sessionCountdown')
    const btnExtendSession = $('#btnExtendSession')

    // Check if existing session has expired
    const savedExpiry = parseInt(localStorage.getItem(AUTH_EXPIRY_KEY) || '0', 10)
    if (currentPassword && savedExpiry && Date.now() > savedExpiry) {
      logout('Session expired due to inactivity. Please log in again.')
    } else if (currentPassword) {
      authOverlay.classList.add('hidden')
      startSessionTimer()
    }

    function recordActivity() {
      if (!currentPassword) return
      lastActivityTime = Date.now()
      localStorage.setItem(AUTH_EXPIRY_KEY, String(Date.now() + INACTIVITY_TIMEOUT_MS))
      if (sessionWarnModal && !sessionWarnModal.classList.contains('hidden')) {
        sessionWarnModal.classList.add('hidden')
      }
    }

    function startSessionTimer() {
      recordActivity()
      if (sessionTimerInterval) clearInterval(sessionTimerInterval)

      sessionTimerInterval = setInterval(() => {
        if (!currentPassword) {
          clearInterval(sessionTimerInterval)
          return
        }

        const now = Date.now()
        const remainingMs = lastActivityTime + INACTIVITY_TIMEOUT_MS - now

        if (remainingMs <= 0) {
          logout(`Session timed out after ${SESSION_TIMEOUT_MINUTES} minutes of inactivity.`)
        } else if (remainingMs <= WARNING_BEFORE_TIMEOUT_MS) {
          if (sessionWarnModal) {
            sessionWarnModal.classList.remove('hidden')
            if (sessionCountdown) {
              sessionCountdown.textContent = Math.ceil(remainingMs / 1000)
            }
          }
        } else {
          if (sessionWarnModal && !sessionWarnModal.classList.contains('hidden')) {
            sessionWarnModal.classList.add('hidden')
          }
        }
      }, 1000)
    }

    function logout(reason = '') {
      localStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(AUTH_EXPIRY_KEY)
      currentPassword = ''
      if (sessionTimerInterval) clearInterval(sessionTimerInterval)
      if (sessionWarnModal) sessionWarnModal.classList.add('hidden')
      authOverlay.classList.remove('hidden')
      if (authError && reason) authError.textContent = reason
      showToast('🔒 Workspace locked')
    }

    // User activity listeners (throttled)
    let lastThrottled = 0
    const onUserActivity = () => {
      const now = Date.now()
      if (now - lastThrottled > 5000) {
        lastThrottled = now
        recordActivity()
      }
    }

    ;['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'].forEach((evt) => {
      window.addEventListener(evt, onUserActivity, { passive: true })
    })

    if (btnExtendSession) {
      btnExtendSession.addEventListener('click', () => {
        recordActivity()
        showToast('✓ Session extended')
      })
    }

    authForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const pass = authPass.value.trim()
      authError.textContent = 'Verifying...'

      const isValid = await verifyPassword(pass)
      if (isValid) {
        currentPassword = pass
        localStorage.setItem(AUTH_KEY, pass)
        startSessionTimer()
        authOverlay.classList.add('hidden')
        authError.textContent = ''
        authPass.value = ''
        showToast(`🔓 Workspace unlocked (${SESSION_TIMEOUT_MINUTES}-min idle timeout active)`)
      } else {
        authError.textContent = 'Invalid password. Please try again.'
      }
    })

    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        logout('You have locked the workspace.')
      })
    }
  }

  // Tab Navigation
  function initTabs() {
    const tabBtns = $$('.nav-tab-btn')
    const tabPanes = $$('.tab-pane')

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'))
        tabPanes.forEach((p) => p.classList.remove('active'))

        btn.classList.add('active')
        const targetId = btn.getAttribute('data-tab')
        const targetPane = $(`#${targetId}`)
        if (targetPane) targetPane.classList.add('active')
      })
    })
  }

  // 0. Render Section Visibility Switches
  function renderSectionSwitches() {
    const container = $('#sectionSwitchesContainer')
    if (!container) return
    container.innerHTML = ''

    const sectionLabels = {
      hero: 'Hero & Visual Showcase',
      intro: 'Introduction Statement',
      work: 'Selected Work & Projects Grid',
      philosophy: 'Design Philosophy & Principles',
      services: 'Services & Deliverables',
      about: 'About Me & Career Narrative',
      playground: 'Playground & Experimental Work',
      tools: 'Animated Tools & Skills Marquee',
      journal: 'Journal & Published Articles',
      collab: 'Collaboration Call-to-Action',
      contact: 'Final Contact & Footer'
    }

    if (!currentContent.sections) {
      currentContent.sections = { ...DEFAULT_PORTFOLIO_CONTENT.sections }
    }

    Object.entries(sectionLabels).forEach(([key, label]) => {
      const isChecked = currentContent.sections[key] !== false
      const row = document.createElement('div')
      row.className = 'switch-group'
      row.innerHTML = `
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #fff">${label}</div>
          <div style="font-size: 11px; color: var(--text-muted)">Section ID: #${key}</div>
        </div>
        <label class="switch">
          <input type="checkbox" data-section-key="${key}" ${isChecked ? 'checked' : ''} />
          <span class="slider"></span>
        </label>
      `
      container.appendChild(row)
    })

    $$('input[data-section-key]', container).forEach((chk) => {
      chk.addEventListener('change', () => {
        const k = chk.getAttribute('data-section-key')
        currentContent.sections[k] = chk.checked
        markUnsaved()
        showToast(`Section "${sectionLabels[k]}" visibility updated`)
      })
    })
  }

  // 1. Render Extensible Social Links
  function renderSocialsList() {
    const container = $('#socialsListContainer')
    if (!container) return
    container.innerHTML = ''

    if (!Array.isArray(currentContent.personal.socials)) {
      currentContent.personal.socials = [...DEFAULT_PORTFOLIO_CONTENT.personal.socials]
    }

    currentContent.personal.socials.forEach((soc, idx) => {
      const card = document.createElement('div')
      card.className = 'repeatable-item'
      card.innerHTML = `
        <div class="item-header">
          <span class="item-badge">${soc.platform || 'Link'} #${idx + 1}</span>
          <button type="button" class="btn-remove" data-action="remove-social" data-index="${idx}">Delete Link</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Platform Name</label>
            <input type="text" value="${soc.platform || ''}" data-social-prop="platform" data-index="${idx}" placeholder="e.g. GitHub, X/Twitter, Substack" />
          </div>
          <div class="form-group">
            <label>Display Badge Label</label>
            <input type="text" value="${soc.label || ''}" data-social-prop="label" data-index="${idx}" placeholder="e.g. Gh, 𝕏, Sub" />
          </div>
          <div class="form-group full">
            <label>Profile URL</label>
            <input type="url" value="${soc.url || ''}" data-social-prop="url" data-index="${idx}" placeholder="https://..." />
          </div>
        </div>
      `
      container.appendChild(card)
    })

    $$('input[data-social-prop]', container).forEach((el) => {
      el.addEventListener('input', () => {
        const i = parseInt(el.getAttribute('data-index'), 10)
        const prop = el.getAttribute('data-social-prop')
        currentContent.personal.socials[i][prop] = el.value
        markUnsaved()
      })
    })

    $$('button[data-action="remove-social"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.personal.socials.splice(i, 1)
        renderSocialsList()
        markUnsaved()
      })
    })
  }

  // 2. Render Static Fields
  function populateStaticFields() {
    $$('input[data-bind], textarea[data-bind], select[data-bind]').forEach((input) => {
      const path = input.getAttribute('data-bind')
      const val = getDeepProp(currentContent, path)
      if (val !== undefined && val !== null) {
        input.value = val
      }

      const previewSel = input.getAttribute('data-preview')
      if (previewSel) {
        const previewImg = $(previewSel)
        if (previewImg && val) previewImg.src = val
      }

      input.addEventListener('input', () => {
        const oldVal = getDeepProp(currentContent, path)
        if (previewSel && oldVal && oldVal !== input.value) {
          trackReplacedImage(currentContent, oldVal)
          renderImageArchiveStatus()
        }
        setDeepProp(currentContent, path, input.value)
        if (previewSel) {
          const previewImg = $(previewSel)
          if (previewImg) previewImg.src = input.value
        }
        markUnsaved()
      })
    })
  }

  // Helper: Reorder array items
  function moveItem(arr, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= arr.length) return
    const [moved] = arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, moved)
  }

  // 3. Render Projects List
  function renderProjectsList() {
    const container = $('#projectsListContainer')
    if (!container) return
    container.innerHTML = ''

    if (!Array.isArray(currentContent.projects)) currentContent.projects = []

    currentContent.projects.forEach((proj, idx) => {
      const isVis = proj.visible !== false
      const card = document.createElement('div')
      card.className = `repeatable-item ${isVis ? '' : 'item-hidden'}`
      card.innerHTML = `
        <div class="item-header">
          <div style="display: flex; align-items: center; gap: 8px">
            <span class="item-badge">Project #${idx + 1}</span>
            <span style="font-size: 12px; font-weight: 600; color: #fff">${proj.title || 'Untitled'}</span>
          </div>
          <div class="item-controls">
            <button type="button" class="btn-icon-control" data-action="toggle-proj" data-index="${idx}" title="Toggle Visibility">
              ${isVis ? '👁️ Visible' : '🚫 Hidden'}
            </button>
            <button type="button" class="btn-icon-control" data-action="move-proj-up" data-index="${idx}" ${idx === 0 ? 'disabled' : ''} title="Move Up">▲</button>
            <button type="button" class="btn-icon-control" data-action="move-proj-down" data-index="${idx}" ${idx === currentContent.projects.length - 1 ? 'disabled' : ''} title="Move Down">▼</button>
            <button type="button" class="btn-icon-control" data-action="dup-proj" data-index="${idx}" title="Duplicate">📋 Duplicate</button>
            <button type="button" class="btn-remove" data-action="remove-project" data-index="${idx}">Delete</button>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Project Title</label>
            <input type="text" value="${proj.title || ''}" data-project-prop="title" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Tag / Sequence</label>
            <input type="text" value="${proj.tag || ''}" data-project-prop="tag" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Year</label>
            <input type="text" value="${proj.year || ''}" data-project-prop="year" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Category</label>
            <input type="text" value="${proj.category || ''}" data-project-prop="category" data-index="${idx}" />
          </div>
          <div class="form-group full">
            <label>Description</label>
            <textarea data-project-prop="description" data-index="${idx}">${proj.description || ''}</textarea>
          </div>
          <div class="form-group full">
            <label>Project Cover Image</label>
            <div class="media-field-box">
              <img class="media-preview-thumb" id="prev_proj_${idx}" src="${proj.image || ''}" alt="" />
              <div class="media-field-content">
                <input type="text" value="${proj.image || ''}" data-project-prop="image" data-index="${idx}" />
                <div class="media-actions">
                  <label class="btn-admin-secondary btn-upload-file">
                    Upload Image
                    <input type="file" data-upload-item-type="projects" data-index="${idx}" data-prop="image" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Case Study Link</label>
            <input type="text" value="${proj.link || '#work'}" data-project-prop="link" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Link Label</label>
            <input type="text" value="${proj.linkText || 'View Case Study'}" data-project-prop="linkText" data-index="${idx}" />
          </div>
        </div>
      `
      container.appendChild(card)
    })

    // Input listeners
    $$('input[data-project-prop], textarea[data-project-prop]', container).forEach((el) => {
      el.addEventListener('input', () => {
        const i = parseInt(el.getAttribute('data-index'), 10)
        const prop = el.getAttribute('data-project-prop')
        currentContent.projects[i][prop] = el.value
        if (prop === 'image') {
          const thumb = $(`#prev_proj_${i}`)
          if (thumb) thumb.src = el.value
        }
        markUnsaved()
      })
    })

    // Actions
    $$('button[data-action="toggle-proj"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.projects[i].visible = currentContent.projects[i].visible === false ? true : false
        renderProjectsList()
        markUnsaved()
      })
    })

    $$('button[data-action="move-proj-up"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        moveItem(currentContent.projects, i, i - 1)
        renderProjectsList()
        markUnsaved()
      })
    })

    $$('button[data-action="move-proj-down"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        moveItem(currentContent.projects, i, i + 1)
        renderProjectsList()
        markUnsaved()
      })
    })

    $$('button[data-action="dup-proj"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        const clone = JSON.parse(JSON.stringify(currentContent.projects[i]))
        clone.id = `proj-${Date.now()}`
        clone.title = `${clone.title} (Copy)`
        currentContent.projects.splice(i + 1, 0, clone)
        renderProjectsList()
        markUnsaved()
        showToast('✓ Project duplicated')
      })
    })

    $$('button[data-action="remove-project"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.projects.splice(i, 1)
        renderProjectsList()
        markUnsaved()
      })
    })
  }

  // 4. Render Services List
  function renderServicesList() {
    const container = $('#servicesListContainer')
    if (!container) return
    container.innerHTML = ''

    if (!Array.isArray(currentContent.services)) currentContent.services = []

    currentContent.services.forEach((srv, idx) => {
      const isVis = srv.visible !== false
      const card = document.createElement('div')
      card.className = `repeatable-item ${isVis ? '' : 'item-hidden'}`
      card.innerHTML = `
        <div class="item-header">
          <span class="item-badge">Service #${idx + 1}</span>
          <div class="item-controls">
            <button type="button" class="btn-icon-control" data-action="toggle-srv" data-index="${idx}">
              ${isVis ? '👁️ Visible' : '🚫 Hidden'}
            </button>
            <button type="button" class="btn-icon-control" data-action="move-srv-up" data-index="${idx}" ${idx === 0 ? 'disabled' : ''}>▲</button>
            <button type="button" class="btn-icon-control" data-action="move-srv-down" data-index="${idx}" ${idx === currentContent.services.length - 1 ? 'disabled' : ''}>▼</button>
            <button type="button" class="btn-remove" data-action="remove-service" data-index="${idx}">Delete</button>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Number (#)</label>
            <input type="text" value="${srv.num || ''}" data-service-prop="num" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Service Title</label>
            <input type="text" value="${srv.title || ''}" data-service-prop="title" data-index="${idx}" />
          </div>
          <div class="form-group full">
            <label>Description / Deliverables</label>
            <input type="text" value="${srv.desc || ''}" data-service-prop="desc" data-index="${idx}" />
          </div>
          <div class="form-group full">
            <label>Hover Preview Image</label>
            <div class="media-field-box">
              <img class="media-preview-thumb" id="prev_srv_${idx}" src="${srv.image || ''}" alt="" />
              <div class="media-field-content">
                <input type="text" value="${srv.image || ''}" data-service-prop="image" data-index="${idx}" />
                <div class="media-actions">
                  <label class="btn-admin-secondary btn-upload-file">
                    Upload Image
                    <input type="file" data-upload-item-type="services" data-index="${idx}" data-prop="image" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      container.appendChild(card)
    })

    $$('input[data-service-prop]', container).forEach((el) => {
      el.addEventListener('input', () => {
        const i = parseInt(el.getAttribute('data-index'), 10)
        const prop = el.getAttribute('data-service-prop')
        currentContent.services[i][prop] = el.value
        if (prop === 'image') {
          const thumb = $(`#prev_srv_${i}`)
          if (thumb) thumb.src = el.value
        }
        markUnsaved()
      })
    })

    $$('button[data-action="toggle-srv"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.services[i].visible = currentContent.services[i].visible === false ? true : false
        renderServicesList()
        markUnsaved()
      })
    })

    $$('button[data-action="move-srv-up"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        moveItem(currentContent.services, i, i - 1)
        renderServicesList()
        markUnsaved()
      })
    })

    $$('button[data-action="move-srv-down"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        moveItem(currentContent.services, i, i + 1)
        renderServicesList()
        markUnsaved()
      })
    })

    $$('button[data-action="remove-service"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.services.splice(i, 1)
        renderServicesList()
        markUnsaved()
      })
    })
  }

  // 5. Render Playground List
  function renderPlaygroundList() {
    const container = $('#playgroundListContainer')
    if (!container) return
    container.innerHTML = ''

    if (!Array.isArray(currentContent.playground)) currentContent.playground = []

    currentContent.playground.forEach((item, idx) => {
      const isVis = item.visible !== false
      const card = document.createElement('div')
      card.className = `repeatable-item ${isVis ? '' : 'item-hidden'}`
      card.innerHTML = `
        <div class="item-header">
          <span class="item-badge">Playground #${idx + 1}</span>
          <div class="item-controls">
            <button type="button" class="btn-icon-control" data-action="toggle-pg" data-index="${idx}">
              ${isVis ? '👁️ Visible' : '🚫 Hidden'}
            </button>
            <button type="button" class="btn-icon-control" data-action="move-pg-up" data-index="${idx}" ${idx === 0 ? 'disabled' : ''}>▲</button>
            <button type="button" class="btn-icon-control" data-action="move-pg-down" data-index="${idx}" ${idx === currentContent.playground.length - 1 ? 'disabled' : ''}>▼</button>
            <button type="button" class="btn-remove" data-action="remove-playground" data-index="${idx}">Delete</button>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Item Title</label>
            <input type="text" value="${item.title || ''}" data-pg-prop="title" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Category & Year</label>
            <input type="text" value="${item.category || ''}" data-pg-prop="category" data-index="${idx}" />
          </div>
          <div class="form-group full">
            <label>Experiment Image</label>
            <div class="media-field-box">
              <img class="media-preview-thumb" id="prev_pg_${idx}" src="${item.image || ''}" alt="" />
              <div class="media-field-content">
                <input type="text" value="${item.image || ''}" data-pg-prop="image" data-index="${idx}" />
                <div class="media-actions">
                  <label class="btn-admin-secondary btn-upload-file">
                    Upload Image
                    <input type="file" data-upload-item-type="playground" data-index="${idx}" data-prop="image" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      container.appendChild(card)
    })

    $$('input[data-pg-prop]', container).forEach((el) => {
      el.addEventListener('input', () => {
        const i = parseInt(el.getAttribute('data-index'), 10)
        const prop = el.getAttribute('data-pg-prop')
        currentContent.playground[i][prop] = el.value
        if (prop === 'image') {
          const thumb = $(`#prev_pg_${i}`)
          if (thumb) thumb.src = el.value
        }
        markUnsaved()
      })
    })

    $$('button[data-action="toggle-pg"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.playground[i].visible = currentContent.playground[i].visible === false ? true : false
        renderPlaygroundList()
        markUnsaved()
      })
    })

    $$('button[data-action="move-pg-up"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        moveItem(currentContent.playground, i, i - 1)
        renderPlaygroundList()
        markUnsaved()
      })
    })

    $$('button[data-action="move-pg-down"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        moveItem(currentContent.playground, i, i + 1)
        renderPlaygroundList()
        markUnsaved()
      })
    })

    $$('button[data-action="remove-playground"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.playground.splice(i, 1)
        renderPlaygroundList()
        markUnsaved()
      })
    })
  }

  // 6. Render Tools Chips
  function renderToolsChips() {
    const container = $('#toolsChipsContainer')
    if (!container) return
    container.innerHTML = ''

    if (!Array.isArray(currentContent.tools)) currentContent.tools = [...DEFAULT_PORTFOLIO_CONTENT.tools]

    currentContent.tools.forEach((tool, idx) => {
      const chip = document.createElement('div')
      chip.className = 'chip-tag'
      chip.innerHTML = `
        <span>${tool}</span>
        <button type="button" data-action="remove-tool" data-index="${idx}" aria-label="Remove ${tool}">×</button>
      `
      container.appendChild(chip)
    })

    $$('button[data-action="remove-tool"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.tools.splice(i, 1)
        renderToolsChips()
        markUnsaved()
      })
    })
  }

  // 7. Render Journal List
  function renderJournalList() {
    const container = $('#journalListContainer')
    if (!container) return
    container.innerHTML = ''

    if (!Array.isArray(currentContent.journal)) currentContent.journal = []

    currentContent.journal.forEach((j, idx) => {
      const isVis = j.visible !== false
      const card = document.createElement('div')
      card.className = `repeatable-item ${isVis ? '' : 'item-hidden'}`
      card.innerHTML = `
        <div class="item-header">
          <span class="item-badge">Article #${idx + 1}</span>
          <div class="item-controls">
            <button type="button" class="btn-icon-control" data-action="toggle-j" data-index="${idx}">
              ${isVis ? '👁️ Visible' : '🚫 Hidden'}
            </button>
            <button type="button" class="btn-icon-control" data-action="move-j-up" data-index="${idx}" ${idx === 0 ? 'disabled' : ''}>▲</button>
            <button type="button" class="btn-icon-control" data-action="move-j-down" data-index="${idx}" ${idx === currentContent.journal.length - 1 ? 'disabled' : ''}>▼</button>
            <button type="button" class="btn-remove" data-action="remove-journal" data-index="${idx}">Delete</button>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group full">
            <label>Article Title</label>
            <input type="text" value="${j.title || ''}" data-journal-prop="title" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Publish Date</label>
            <input type="text" value="${j.date || ''}" data-journal-prop="date" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Tag / Category</label>
            <input type="text" value="${j.tag || ''}" data-journal-prop="tag" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Read Time</label>
            <input type="text" value="${j.readTime || ''}" data-journal-prop="readTime" data-index="${idx}" />
          </div>
          <div class="form-group">
            <label>Article Link</label>
            <input type="text" value="${j.link || '#journal'}" data-journal-prop="link" data-index="${idx}" />
          </div>
          <div class="form-group full">
            <label>Excerpt / Summary</label>
            <textarea data-journal-prop="excerpt" data-index="${idx}">${j.excerpt || ''}</textarea>
          </div>
          <div class="form-group full">
            <label>Cover Image</label>
            <div class="media-field-box">
              <img class="media-preview-thumb" id="prev_journal_${idx}" src="${j.image || ''}" alt="" />
              <div class="media-field-content">
                <input type="text" value="${j.image || ''}" data-journal-prop="image" data-index="${idx}" />
                <div class="media-actions">
                  <label class="btn-admin-secondary btn-upload-file">
                    Upload Image
                    <input type="file" data-upload-item-type="journal" data-index="${idx}" data-prop="image" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      container.appendChild(card)
    })

    $$('input[data-journal-prop], textarea[data-journal-prop]', container).forEach((el) => {
      el.addEventListener('input', () => {
        const i = parseInt(el.getAttribute('data-index'), 10)
        const prop = el.getAttribute('data-journal-prop')
        currentContent.journal[i][prop] = el.value
        if (prop === 'image') {
          const thumb = $(`#prev_journal_${i}`)
          if (thumb) thumb.src = el.value
        }
        markUnsaved()
      })
    })

    $$('button[data-action="toggle-j"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.journal[i].visible = currentContent.journal[i].visible === false ? true : false
        renderJournalList()
        markUnsaved()
      })
    })

    $$('button[data-action="move-j-up"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        moveItem(currentContent.journal, i, i - 1)
        renderJournalList()
        markUnsaved()
      })
    })

    $$('button[data-action="move-j-down"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        moveItem(currentContent.journal, i, i + 1)
        renderJournalList()
        markUnsaved()
      })
    })

    $$('button[data-action="remove-journal"]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        currentContent.journal.splice(i, 1)
        renderJournalList()
        markUnsaved()
      })
    })
  }

  // 8. Render About Stats
  function renderAboutStats() {
    const container = $('#aboutStatsContainer')
    if (!container) return
    container.innerHTML = ''

    if (!Array.isArray(currentContent.about.stats)) currentContent.about.stats = []

    currentContent.about.stats.forEach((st, idx) => {
      const wrap = document.createElement('div')
      wrap.className = 'form-group'
      wrap.innerHTML = `
        <label>Stat Metric #${idx + 1}</label>
        <div style="display: flex; gap: 8px">
          <input type="text" style="width: 80px" value="${st.value || ''}" data-stat-prop="value" data-index="${idx}" placeholder="Value" />
          <input type="text" style="flex: 1" value="${st.label || ''}" data-stat-prop="label" data-index="${idx}" placeholder="Label" />
        </div>
      `
      container.appendChild(wrap)
    })

    $$('input[data-stat-prop]', container).forEach((el) => {
      el.addEventListener('input', () => {
        const i = parseInt(el.getAttribute('data-index'), 10)
        const prop = el.getAttribute('data-stat-prop')
        currentContent.about.stats[i][prop] = el.value
        markUnsaved()
      })
    })
  }

  // Media Upload Listener
  function initUploadHandlers() {
    document.addEventListener('change', async (e) => {
      const fileInput = e.target
      if (fileInput.tagName !== 'INPUT' || fileInput.type !== 'file') return

      const file = fileInput.files && fileInput.files[0]
      if (!file) return

      const directTarget = fileInput.getAttribute('data-upload-target')
      const itemType = fileInput.getAttribute('data-upload-item-type')
      const previewSel = fileInput.getAttribute('data-preview')

      showToast(`Uploading ${file.name}...`)

      try {
        const uploadedUrl = await uploadMediaFile(file, currentPassword)

        if (directTarget) {
          const oldUrl = getDeepProp(currentContent, directTarget)
          if (oldUrl && oldUrl !== uploadedUrl) {
            trackReplacedImage(currentContent, oldUrl)
          }
          setDeepProp(currentContent, directTarget, uploadedUrl)
          const boundInput = $(`input[data-bind="${directTarget}"]`)
          if (boundInput) boundInput.value = uploadedUrl
          if (previewSel) {
            const previewImg = $(previewSel)
            if (previewImg) previewImg.src = uploadedUrl
          }
        } else if (itemType) {
          const idx = parseInt(fileInput.getAttribute('data-index'), 10)
          const prop = fileInput.getAttribute('data-prop')
          const oldUrl = currentContent[itemType][idx][prop]
          if (oldUrl && oldUrl !== uploadedUrl) {
            trackReplacedImage(currentContent, oldUrl)
          }
          currentContent[itemType][idx][prop] = uploadedUrl

          if (itemType === 'projects') renderProjectsList()
          else if (itemType === 'services') renderServicesList()
          else if (itemType === 'playground') renderPlaygroundList()
          else if (itemType === 'journal') renderJournalList()
        }

        renderImageArchiveStatus()
        markUnsaved()
        showToast('✓ Image uploaded successfully')
      } catch (err) {
        showToast(`Upload failed: ${err.message}`)
      }
    })
  }

  // 9. Render 10-Day Retention Archive Status
  function renderImageArchiveStatus() {
    const countText = $('#archiveCountText')
    const list = $('#archiveList')
    if (!countText || !list) return
    list.innerHTML = ''

    const archive = currentContent.imageArchive || []
    countText.textContent = `${archive.length} image(s) currently preserved in 10-day retention`

    const now = Date.now()
    archive.forEach((item, idx) => {
      const remainingMs = item.expiresAt - now
      const remainingDays = Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)))
      const row = document.createElement('div')
      row.style.cssText =
        'display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); padding:8px 12px; border-radius:var(--radius-sm); font-size:12px'
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; overflow:hidden">
          <img src="${item.url}" style="width:32px; height:32px; border-radius:4px; object-fit:cover; background:#222; flex-shrink:0" alt="" />
          <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:320px">
            <span style="color:#fff">${item.url.split('/').pop()}</span>
            <div style="color:var(--text-muted); font-size:11px">${remainingDays > 0 ? `Auto-deletes in ${remainingDays} day(s)` : 'Expired — pending cleanup'}</div>
          </div>
        </div>
        <button type="button" class="btn-remove" data-action="delete-archived-img" data-index="${idx}" style="padding:3px 8px; font-size:10px">Delete Now</button>
      `
      list.appendChild(row)
    })

    $$('button[data-action="delete-archived-img"]', list).forEach((btn) => {
      btn.addEventListener('click', async () => {
        const i = parseInt(btn.getAttribute('data-index'), 10)
        const removed = currentContent.imageArchive.splice(i, 1)[0]
        if (removed) {
          await deleteMediaFile(removed.url, currentPassword)
        }
        renderImageArchiveStatus()
        markUnsaved()
        showToast('✓ Image deleted from archive & storage')
      })
    })
  }

  // Save / Publish Status
  function markUnsaved() {
    const status = $('#saveStatus')
    if (status) {
      status.textContent = '● Unsaved changes'
      status.classList.remove('saved')
    }
  }

  function markSaved() {
    const status = $('#saveStatus')
    if (status) {
      status.textContent = '✓ Saved & Published'
      status.classList.add('saved')
    }
  }

  function initActionButtons() {
    const btnPublish = $('#btnPublish')
    const btnAddProject = $('#btnAddProject')
    const btnAddService = $('#btnAddService')
    const btnAddPlayground = $('#btnAddPlayground')
    const btnAddJournal = $('#btnAddJournal')
    const btnAddSocial = $('#btnAddSocial')
    const btnAddTool = $('#btnAddTool')
    const newToolInput = $('#newToolInput')
    const btnExportJson = $('#btnExportJson')
    const importJsonInput = $('#importJsonInput')
    const btnSyncAllR2 = $('#btnSyncAllR2')
    const syncProgressText = $('#syncProgressText')
    const btnCleanExpiredR2 = $('#btnCleanExpiredR2')

    if (btnPublish) {
      btnPublish.addEventListener('click', async () => {
        btnPublish.textContent = 'Publishing...'
        btnPublish.disabled = true

        try {
          const res = await savePortfolioContent(currentContent, currentPassword)
          markSaved()
          renderImageArchiveStatus()
          if (res.remoteWarning) {
            showToast(`Saved locally! (${res.remoteWarning})`, 4500)
          } else {
            showToast('🚀 Live portfolio updated on Cloudflare!')
          }
        } catch (err) {
          showToast(`Error: ${err.message}`)
        } finally {
          btnPublish.textContent = 'Publish Changes 🚀'
          btnPublish.disabled = false
        }
      })
    }

    // Cloudflare R2 Sync All Assets
    if (btnSyncAllR2) {
      btnSyncAllR2.addEventListener('click', async () => {
        btnSyncAllR2.disabled = true
        btnSyncAllR2.textContent = 'Syncing to Cloudflare R2...'
        if (syncProgressText) syncProgressText.style.display = 'block'

        try {
          const result = await syncAllAssetsToR2(currentContent, currentPassword, ({ current, total, url }) => {
            if (syncProgressText) syncProgressText.textContent = `Uploading [${current}/${total}]: ${url.split('/').pop()}...`
          })

          renderProjectsList()
          renderServicesList()
          renderPlaygroundList()
          renderJournalList()
          populateStaticFields()
          markUnsaved()

          if (syncProgressText) {
            syncProgressText.textContent = `✓ Synced ${result.synced} assets to Cloudflare R2!`
          }
          showToast(`✓ Synced ${result.synced} images to Cloudflare R2!`)
        } catch (err) {
          showToast(`Sync failed: ${err.message}`)
        } finally {
          btnSyncAllR2.disabled = false
          btnSyncAllR2.textContent = '☁️ Sync All Assets to Cloudflare R2'
        }
      })
    }

    // Clean Expired Images (>10 days)
    if (btnCleanExpiredR2) {
      btnCleanExpiredR2.addEventListener('click', async () => {
        btnCleanExpiredR2.disabled = true
        btnCleanExpiredR2.textContent = 'Cleaning...'
        try {
          const { cleanedCount } = await cleanupExpiredImages(currentContent, currentPassword)
          renderImageArchiveStatus()
          markUnsaved()
          showToast(cleanedCount > 0 ? `✓ Deleted ${cleanedCount} expired images from R2` : 'No expired images (>10 days) found')
        } catch (err) {
          showToast(`Cleanup error: ${err.message}`)
        } finally {
          btnCleanExpiredR2.disabled = false
          btnCleanExpiredR2.textContent = '🗑️ Clean Expired Now'
        }
      })
    }

    if (btnAddSocial) {
      btnAddSocial.addEventListener('click', () => {
        if (!Array.isArray(currentContent.personal.socials)) currentContent.personal.socials = []
        currentContent.personal.socials.push({
          id: `soc-${Date.now()}`,
          platform: 'New Platform',
          label: 'Link',
          url: 'https://'
        })
        renderSocialsList()
        markUnsaved()
      })
    }

    if (btnAddTool && newToolInput) {
      const addTool = () => {
        const val = newToolInput.value.trim().toUpperCase()
        if (val) {
          if (!Array.isArray(currentContent.tools)) currentContent.tools = []
          if (!currentContent.tools.includes(val)) {
            currentContent.tools.push(val)
            renderToolsChips()
            markUnsaved()
            showToast(`✓ Added "${val}"`)
          }
          newToolInput.value = ''
        }
      }
      btnAddTool.addEventListener('click', addTool)
      newToolInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          addTool()
        }
      })
    }

    if (btnAddProject) {
      btnAddProject.addEventListener('click', () => {
        currentContent.projects.push({
          id: `proj-${Date.now()}`,
          visible: true,
          title: 'New Project',
          tag: 'New — #',
          year: '2026',
          category: 'Product Design · UX/UI',
          description: 'A newly designed product showcase.',
          image: 'assets/images/projects/desknet.jpg',
          link: '#work',
          linkText: 'View Case Study',
          featured: true
        })
        renderProjectsList()
        markUnsaved()
      })
    }

    if (btnAddService) {
      btnAddService.addEventListener('click', () => {
        const num = String(currentContent.services.length + 1).padStart(2, '0')
        currentContent.services.push({
          id: `srv-${Date.now()}`,
          visible: true,
          num,
          title: 'New Service',
          desc: 'Deliverables & Capabilities',
          image: 'assets/images/services/ui-design.jpg'
        })
        renderServicesList()
        markUnsaved()
      })
    }

    if (btnAddPlayground) {
      btnAddPlayground.addEventListener('click', () => {
        currentContent.playground.push({
          id: `pg-${Date.now()}`,
          visible: true,
          title: 'New Exploration',
          category: 'Concept · 2026',
          image: 'assets/images/playground/grid.jpg'
        })
        renderPlaygroundList()
        markUnsaved()
      })
    }

    if (btnAddJournal) {
      btnAddJournal.addEventListener('click', () => {
        currentContent.journal.push({
          id: `j-${Date.now()}`,
          visible: true,
          title: 'New Article Title',
          date: 'Sep 2026',
          tag: 'Thoughts',
          readTime: '4 min',
          excerpt: 'A short article excerpt about design, process and craft.',
          image: 'assets/images/journal/clarity.jpg',
          link: '#journal'
        })
        renderJournalList()
        markUnsaved()
      })
    }

    // Export JSON
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentContent, null, 2))
        const a = document.createElement('a')
        a.href = dataStr
        a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        showToast('✓ JSON backup downloaded')
      })
    }

    // Import JSON
    if (importJsonInput) {
      importJsonInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result)
            currentContent = { ...DEFAULT_PORTFOLIO_CONTENT, ...imported }
            renderSectionSwitches()
            renderSocialsList()
            populateStaticFields()
            renderProjectsList()
            renderServicesList()
            renderAboutStats()
            renderPlaygroundList()
            renderToolsChips()
            renderJournalList()
            renderImageArchiveStatus()
            markUnsaved()
            showToast('✓ Content imported successfully')
          } catch (_err) {
            showToast('Invalid JSON file')
          }
        }
        reader.readAsText(file)
      })
    }
  }

  // Initialize
  async function init() {
    initAuth()
    initTabs()
    initUploadHandlers()
    initActionButtons()

    currentContent = await loadPortfolioContent()

    renderSectionSwitches()
    renderSocialsList()
    populateStaticFields()
    renderProjectsList()
    renderServicesList()
    renderAboutStats()
    renderPlaygroundList()
    renderToolsChips()
    renderJournalList()
    renderImageArchiveStatus()
  }

  init()
})()
