/**
 * Visual On-Page CMS Engine (Astro + TypeScript)
 * Inline WYSIWYG Editing, On-Hover Image Replacer, Section & Card Controls
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
} from '../lib/content-model'

;(() => {
  'use strict'

  const AUTH_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AUTH_KEY) || 'portfolio_admin_auth'
  const AUTH_EXPIRY_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AUTH_EXPIRY_KEY) || 'portfolio_admin_expiry'
  const SESSION_TIMEOUT_MINUTES = parseInt((typeof import.meta !== 'undefined' && import.meta.env?.VITE_SESSION_TIMEOUT_MINUTES) || '15', 10)
  const INACTIVITY_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000
  const WARNING_BEFORE_TIMEOUT_MS = parseInt((typeof import.meta !== 'undefined' && import.meta.env?.VITE_WARNING_BEFORE_TIMEOUT_MS) || '60000', 10)

  let currentContent = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_CONTENT))
  let hasUnsavedChanges = false
  let currentImageTarget = null
  let sessionCheckInterval = null
  let countdownTimerInterval = null
  let lastActivityTimestamp = Date.now()
  let isWarningShown = false

  /* Helper to get/set nested properties */
  function getByPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  function setByPath(obj, path, value) {
    const parts = path.split('.')
    let curr = obj
    for (let i = 0; i < parts.length - 1; i++) {
      if (!curr[parts[i]]) curr[parts[i]] = {}
      curr = curr[parts[i]]
    }
    curr[parts[parts.length - 1]] = value
  }

  /* Toast notification */
  function showToast(msg, isError = false) {
    const toast = document.getElementById('cmsToast')
    if (!toast) return
    toast.textContent = msg
    toast.style.background = isError ? '#ef4444' : '#c9a96e'
    toast.style.color = isError ? '#fff' : '#0e0e0e'
    toast.style.display = 'block'
    toast.style.opacity = '1'
    setTimeout(() => {
      toast.style.opacity = '0'
      setTimeout(() => (toast.style.display = 'none'), 300)
    }, 3000)
  }

  /* Mark as unsaved */
  function markUnsaved() {
    hasUnsavedChanges = true
    const dot = document.getElementById('cmsStatusDot')
    const text = document.getElementById('cmsStatusText')
    if (dot) dot.classList.add('unsaved')
    if (text) text.textContent = 'Unsaved Changes'
  }

  function markSaved() {
    hasUnsavedChanges = false
    const dot = document.getElementById('cmsStatusDot')
    const text = document.getElementById('cmsStatusText')
    if (dot) dot.classList.remove('unsaved')
    if (text) text.textContent = 'All Changes Published'
  }

  /* Initialize visual editing bindings */
  function initTextBindings() {
    const textElements = document.querySelectorAll('[data-cms-bind]')
    textElements.forEach((el) => {
      el.setAttribute('contenteditable', 'true')
      el.setAttribute('spellcheck', 'false')

      el.addEventListener('input', () => {
        markUnsaved()
      })

      el.addEventListener('blur', () => {
        const path = el.getAttribute('data-cms-bind')
        if (path) {
          setByPath(currentContent, path, el.innerText.trim())
          markUnsaved()
        }
      })
    })
  }

  /* Initialize image replacement badges */
  function initImageOverlays() {
    const images = document.querySelectorAll('[data-cms-image]')
    images.forEach((img) => {
      const parent = img.parentElement
      if (!parent || parent.querySelector('.cms-image-btn')) return

      parent.classList.add('cms-image-wrapper')

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'cms-image-btn'
      btn.innerHTML = '📷 Replace Image'
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        openMediaModal(img)
      })

      parent.appendChild(btn)
    })
  }

  /* Open media replacement modal */
  function openMediaModal(imgElement) {
    currentImageTarget = imgElement
    const modal = document.getElementById('cmsMediaModal')
    const pathInput = document.getElementById('cmsImageUrlInput')
    if (pathInput) pathInput.value = imgElement.getAttribute('src') || ''
    if (modal) modal.classList.add('open')
  }

  function closeMediaModal() {
    const modal = document.getElementById('cmsMediaModal')
    if (modal) modal.classList.remove('open')
    currentImageTarget = null
  }

  /* Initialize section toolbars */
  function initSectionToolbars() {
    const sections = document.querySelectorAll('section[data-cms-section]')
    sections.forEach((sec) => {
      if (sec.querySelector('.cms-section-toolbar')) return

      const sectionId = sec.getAttribute('data-cms-section')
      const toolbar = document.createElement('div')
      toolbar.className = 'cms-section-toolbar'

      let addBtnHtml = ''
      if (sectionId === 'work') addBtnHtml = '<button type="button" class="cms-btn-icon cms-btn-add" data-action="add-project">+ Add Project</button>'
      else if (sectionId === 'services') addBtnHtml = '<button type="button" class="cms-btn-icon cms-btn-add" data-action="add-service">+ Add Service</button>'
      else if (sectionId === 'playground') addBtnHtml = '<button type="button" class="cms-btn-icon cms-btn-add" data-action="add-playground">+ Add Item</button>'
      else if (sectionId === 'journal') addBtnHtml = '<button type="button" class="cms-btn-icon cms-btn-add" data-action="add-journal">+ Add Article</button>'

      toolbar.innerHTML = `
        <span class="cms-section-title">${sectionId}</span>
        <button type="button" class="cms-btn-icon" data-action="move-sec-up" title="Move Up">▲</button>
        <button type="button" class="cms-btn-icon" data-action="move-sec-down" title="Move Down">▼</button>
        <button type="button" class="cms-btn-icon" data-action="toggle-sec" title="Toggle Section">👁️</button>
        ${addBtnHtml}
      `

      toolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]')
        if (!btn) return
        e.stopPropagation()
        const action = btn.getAttribute('data-action')

        if (action === 'move-sec-up') {
          const prev = sec.previousElementSibling
          if (prev && prev.hasAttribute('data-cms-section')) {
            sec.parentNode.insertBefore(sec, prev)
            markUnsaved()
          }
        } else if (action === 'move-sec-down') {
          const next = sec.nextElementSibling
          if (next && next.hasAttribute('data-cms-section')) {
            sec.parentNode.insertBefore(next, sec)
            markUnsaved()
          }
        } else if (action === 'toggle-sec') {
          const isHidden = sec.style.opacity === '0.35'
          sec.style.opacity = isHidden ? '1' : '0.35'
          sec.style.filter = isHidden ? 'none' : 'grayscale(1)'
          if (!currentContent.sections) currentContent.sections = {}
          currentContent.sections[sectionId] = isHidden
          markUnsaved()
        } else if (action === 'add-project') {
          addNewProject(sec)
        } else if (action === 'add-service') {
          addNewService(sec)
        } else if (action === 'add-playground') {
          addNewPlayground(sec)
        } else if (action === 'add-journal') {
          addNewJournal(sec)
        }
      })

      sec.appendChild(toolbar)
    })
  }

  /* Add new items in-place */
  function addNewProject(sectionEl) {
    if (!Array.isArray(currentContent.projects)) currentContent.projects = []
    const newProj = {
      id: `proj-${Date.now()}`,
      visible: true,
      title: 'New Featured Project',
      tag: `Selected — 0${currentContent.projects.length + 1}`,
      year: `${new Date().getFullYear()}`,
      category: 'UI/UX Design · Web Application',
      description: 'Describe the project goals, user problem solved, and design approach here.',
      image: '/assets/images/projects/desknet.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    }
    currentContent.projects.push(newProj)
    markUnsaved()
    showToast('New project card added! Refreshing section...')
    location.reload()
  }

  function addNewService(sectionEl) {
    if (!Array.isArray(currentContent.services)) currentContent.services = []
    const newNum = String(currentContent.services.length + 1).padStart(2, '0')
    const newSrv = {
      id: `srv-${Date.now()}`,
      visible: true,
      num: newNum,
      title: 'New Capability',
      desc: 'High-level summary of deliverables and skills.',
      image: '/assets/images/services/ui-design.jpg'
    }
    currentContent.services.push(newSrv)
    markUnsaved()
    location.reload()
  }

  function addNewPlayground(sectionEl) {
    if (!Array.isArray(currentContent.playground)) currentContent.playground = []
    const newItem = {
      id: `pg-${Date.now()}`,
      visible: true,
      title: 'Creative Experiment',
      category: 'Concept · 2026',
      image: '/assets/images/playground/grid.jpg'
    }
    currentContent.playground.push(newItem)
    markUnsaved()
    location.reload()
  }

  function addNewJournal(sectionEl) {
    if (!Array.isArray(currentContent.journal)) currentContent.journal = []
    const newArt = {
      id: `j-${Date.now()}`,
      visible: true,
      title: 'New Editorial Article',
      date: 'Sep 2026',
      tag: 'Design Philosophy',
      readTime: '4 min read',
      excerpt: 'Brief overview of the ideas and takeaways discussed in this article.',
      image: '/assets/images/journal/clarity.jpg',
      link: '#journal'
    }
    currentContent.journal.push(newArt)
    markUnsaved()
    location.reload()
  }

  /* Repeatable item toolbars (Projects, Services, Playground, Journal) */
  function initItemToolbars() {
    const cards = document.querySelectorAll('[data-cms-item]')
    cards.forEach((card) => {
      if (card.querySelector('.cms-item-toolbar')) return
      card.classList.add('cms-item-card')

      const toolbar = document.createElement('div')
      toolbar.className = 'cms-item-toolbar'
      toolbar.innerHTML = `
        <button type="button" class="cms-item-btn" data-action="item-up" title="Move Up">▲</button>
        <button type="button" class="cms-item-btn" data-action="item-down" title="Move Down">▼</button>
        <button type="button" class="cms-item-btn" data-action="item-dup" title="Duplicate">📋</button>
        <button type="button" class="cms-item-btn delete" data-action="item-del" title="Delete">🗑️</button>
      `

      toolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]')
        if (!btn) return
        e.stopPropagation()
        const action = btn.getAttribute('data-action')
        const itemType = card.getAttribute('data-cms-item')
        const itemId = card.getAttribute('data-id')

        if (action === 'item-up') {
          const prev = card.previousElementSibling
          if (prev && prev.hasAttribute('data-cms-item')) {
            card.parentNode.insertBefore(card, prev)
            reorderDataItems(itemType)
            markUnsaved()
          }
        } else if (action === 'item-down') {
          const next = card.nextElementSibling
          if (next && next.hasAttribute('data-cms-item')) {
            card.parentNode.insertBefore(next, card)
            reorderDataItems(itemType)
            markUnsaved()
          }
        } else if (action === 'item-dup') {
          duplicateDataItem(itemType, itemId)
        } else if (action === 'item-del') {
          if (confirm('Delete this item from portfolio?')) {
            card.remove()
            removeDataItem(itemType, itemId)
            markUnsaved()
          }
        }
      })

      card.appendChild(toolbar)
    })
  }

  function reorderDataItems(itemType) {
    const parentGrid = document.querySelector(`[data-cms-grid="${itemType}"]`) || document
    const domIds = [...parentGrid.querySelectorAll(`[data-cms-item="${itemType}"]`)].map((c) => c.getAttribute('data-id'))
    if (Array.isArray(currentContent[itemType])) {
      currentContent[itemType].sort((a, b) => domIds.indexOf(a.id) - domIds.indexOf(b.id))
    }
  }

  function duplicateDataItem(itemType, itemId) {
    if (!Array.isArray(currentContent[itemType])) return
    const orig = currentContent[itemType].find((i) => i.id === itemId)
    if (!orig) return
    const clone = JSON.parse(JSON.stringify(orig))
    clone.id = `${itemType}-${Date.now()}`
    clone.title = `${clone.title} (Copy)`
    const idx = currentContent[itemType].indexOf(orig)
    currentContent[itemType].splice(idx + 1, 0, clone)
    markUnsaved()
    showToast('Item duplicated! Updating view...')
    location.reload()
  }

  function removeDataItem(itemType, itemId) {
    if (!Array.isArray(currentContent[itemType])) return
    currentContent[itemType] = currentContent[itemType].filter((i) => i.id !== itemId)
    markUnsaved()
  }

  /* Setup Command Bar controls */
  function initCommandBar() {
    const btnTogglePreview = document.getElementById('cmsBtnPreview')
    if (btnTogglePreview) {
      btnTogglePreview.addEventListener('click', () => {
        const isPreview = document.body.classList.toggle('cms-preview-mode')
        btnTogglePreview.classList.toggle('active', isPreview)
        btnTogglePreview.innerHTML = isPreview ? '✏️ Edit Mode' : '👁️ Preview Mode'

        const editableElements = document.querySelectorAll('[data-cms-bind]')
        editableElements.forEach((el) => {
          el.setAttribute('contenteditable', isPreview ? 'false' : 'true')
        })
      })
    }

    const btnPublish = document.getElementById('cmsBtnPublish')
    if (btnPublish) {
      btnPublish.addEventListener('click', async () => {
        btnPublish.disabled = true
        btnPublish.innerHTML = '⏳ Publishing...'

        const pass = localStorage.getItem(AUTH_KEY) || ''
        const result = await savePortfolioContent(currentContent, pass)

        btnPublish.disabled = false
        btnPublish.innerHTML = '🚀 Publish Changes'

        if (result.success) {
          markSaved()
          showToast(result.cachedLocally ? 'Saved locally (Cloudflare sync unavailable)' : '✓ Published to Cloudflare KV!')
        } else {
          showToast('Failed to publish: ' + (result.remoteWarning || 'Unknown error'), true)
        }
      })
    }

    const btnR2Sync = document.getElementById('cmsBtnR2Sync')
    if (btnR2Sync) {
      btnR2Sync.addEventListener('click', () => {
        const modal = document.getElementById('cmsR2Modal')
        if (modal) modal.classList.add('open')
        updateArchiveCounter()
      })
    }

    const btnLogout = document.getElementById('cmsBtnLock')
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        lockEditor()
      })
    }
  }

  function updateArchiveCounter() {
    const countText = document.getElementById('cmsArchiveCountText')
    if (countText && Array.isArray(currentContent.imageArchive)) {
      countText.textContent = `${currentContent.imageArchive.length} images currently in 10-day retention`
    }
  }

  /* Authentication & Inactivity Auto-Logout */
  function lockEditor() {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(AUTH_EXPIRY_KEY)
    document.body.classList.remove('cms-active')
    const authModal = document.getElementById('cmsAuthModal')
    if (authModal) authModal.classList.add('open')
  }

  function recordActivity() {
    lastActivityTimestamp = Date.now()
    const expiry = Date.now() + INACTIVITY_TIMEOUT_MS
    localStorage.setItem(AUTH_EXPIRY_KEY, String(expiry))

    if (isWarningShown) {
      isWarningShown = false
      const warnModal = document.getElementById('cmsSessionWarnModal')
      if (warnModal) warnModal.classList.remove('open')
      if (countdownTimerInterval) {
        clearInterval(countdownTimerInterval)
        countdownTimerInterval = null
      }
    }
  }

  function startSessionTimer() {
    if (sessionCheckInterval) clearInterval(sessionCheckInterval)

    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click']
    let lastThrottledRecord = 0
    events.forEach((evt) => {
      window.addEventListener(
        evt,
        () => {
          const now = Date.now()
          if (now - lastThrottledRecord > 5000) {
            lastThrottledRecord = now
            recordActivity()
          }
        },
        { passive: true }
      )
    })

    sessionCheckInterval = setInterval(() => {
      const now = Date.now()
      const expiryStr = localStorage.getItem(AUTH_EXPIRY_KEY)
      const expiry = expiryStr ? parseInt(expiryStr, 10) : now + INACTIVITY_TIMEOUT_MS
      const timeLeft = expiry - now

      // Update timer badge
      const timerDisplay = document.getElementById('cmsSessionTimer')
      if (timerDisplay) {
        const mins = Math.max(0, Math.floor(timeLeft / 60000))
        timerDisplay.textContent = `⏱️ ${mins}m left`
      }

      if (timeLeft <= 0) {
        clearInterval(sessionCheckInterval)
        lockEditor()
        showToast('Session expired due to inactivity. Editor locked.', true)
      } else if (timeLeft <= WARNING_BEFORE_TIMEOUT_MS && !isWarningShown) {
        showSessionWarning(timeLeft)
      }
    }, 2000)
  }

  function showSessionWarning(timeLeftMs) {
    isWarningShown = true
    const warnModal = document.getElementById('cmsSessionWarnModal')
    const countdownEl = document.getElementById('cmsSessionCountdown')
    if (warnModal) warnModal.classList.add('open')

    let remainingSeconds = Math.ceil(timeLeftMs / 1000)
    if (countdownEl) countdownEl.textContent = String(remainingSeconds)

    if (countdownTimerInterval) clearInterval(countdownTimerInterval)
    countdownTimerInterval = setInterval(() => {
      remainingSeconds--
      if (countdownEl) countdownEl.textContent = String(Math.max(0, remainingSeconds))
      if (remainingSeconds <= 0) {
        clearInterval(countdownTimerInterval)
        lockEditor()
      }
    }, 1000)

    const btnExtend = document.getElementById('cmsBtnExtendSession')
    if (btnExtend) {
      btnExtend.onclick = () => {
        recordActivity()
      }
    }
  }

  /* File upload handling */
  function initMediaModalHandlers() {
    const fileInput = document.getElementById('cmsImageFileInput')
    const dropzone = document.getElementById('cmsDropzone')
    const btnSubmitUrl = document.getElementById('cmsBtnApplyImageUrl')
    const urlInput = document.getElementById('cmsImageUrlInput')
    const modalClose = document.getElementById('cmsCloseMediaModal')

    if (modalClose) modalClose.addEventListener('click', closeMediaModal)

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click())

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault()
        dropzone.classList.add('dragover')
      })

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover')
      })

      dropzone.addEventListener('drop', async (e) => {
        e.preventDefault()
        dropzone.classList.remove('dragover')
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          await handleNewImageFile(e.dataTransfer.files[0])
        }
      })

      fileInput.addEventListener('change', async () => {
        if (fileInput.files && fileInput.files[0]) {
          await handleNewImageFile(fileInput.files[0])
        }
      })
    }

    if (btnSubmitUrl && urlInput) {
      btnSubmitUrl.addEventListener('click', () => {
        const val = urlInput.value.trim()
        if (val && currentImageTarget) {
          applyNewImageUrl(val)
        }
      })
    }
  }

  async function handleNewImageFile(file) {
    if (!currentImageTarget) return
    showToast('Uploading image to Cloudflare R2...')

    const pass = localStorage.getItem(AUTH_KEY) || ''
    const newUrl = await uploadMediaFile(file, pass)

    if (newUrl) {
      applyNewImageUrl(newUrl)
    } else {
      showToast('Image upload failed', true)
    }
  }

  function applyNewImageUrl(newUrl) {
    if (!currentImageTarget) return
    const oldUrl = currentImageTarget.getAttribute('src') || ''

    // Track replaced image for 10-day retention
    trackReplacedImage(currentContent, oldUrl)

    // Update DOM
    currentImageTarget.setAttribute('src', newUrl)

    // Update memory model
    const path = currentImageTarget.getAttribute('data-cms-image')
    if (path) {
      setByPath(currentContent, path, newUrl)
    }

    markUnsaved()
    closeMediaModal()
    showToast('Image updated & old version preserved for 10 days!')
  }

  /* Cloudflare R2 Sync & Clean Expired Handlers */
  function initCloudflareModalHandlers() {
    const btnSync = document.getElementById('cmsBtnStartR2Sync')
    const btnClean = document.getElementById('cmsBtnCleanExpired')
    const modalClose = document.getElementById('cmsCloseR2Modal')

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        const modal = document.getElementById('cmsR2Modal')
        if (modal) modal.classList.remove('open')
      })
    }

    if (btnSync) {
      btnSync.addEventListener('click', async () => {
        btnSync.disabled = true
        btnSync.innerHTML = '☁️ Syncing assets to R2...'
        const pass = localStorage.getItem(AUTH_KEY) || ''
        const progressEl = document.getElementById('cmsSyncProgress')
        if (progressEl) progressEl.style.display = 'block'

        const result = await syncAllAssetsToR2(currentContent, pass, (info) => {
          if (progressEl) progressEl.textContent = `Syncing image ${info.current} of ${info.total}...`
        })

        btnSync.disabled = false
        btnSync.innerHTML = '☁️ Sync All Assets to Cloudflare R2'
        if (progressEl) progressEl.textContent = `Sync complete! Synced ${result.synced} images to Cloudflare R2.`
        markUnsaved()
      })
    }

    if (btnClean) {
      btnClean.addEventListener('click', async () => {
        btnClean.disabled = true
        btnClean.innerHTML = '🗑️ Cleaning...'
        const pass = localStorage.getItem(AUTH_KEY) || ''
        const res = await cleanupExpiredImages(currentContent, pass)
        btnClean.disabled = false
        btnClean.innerHTML = '🗑️ Clean Expired Images Now'
        updateArchiveCounter()
        showToast(`Cleaned ${res.cleanedCount} expired images from retention archive`)
        markUnsaved()
      })
    }
  }

  /* Main Startup */
  async function boot() {
    const authModal = document.getElementById('cmsAuthModal')
    const authForm = document.getElementById('cmsAuthForm')
    const passInput = document.getElementById('cmsAuthPass')
    const authError = document.getElementById('cmsAuthError')

    const existingAuth = localStorage.getItem(AUTH_KEY)
    if (existingAuth) {
      document.body.classList.add('cms-active')
      if (authModal) authModal.classList.remove('open')
      startSessionTimer()
    } else {
      if (authModal) authModal.classList.add('open')
    }

    if (authForm && passInput) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const pass = passInput.value.trim()
        const isValid = await verifyPassword(pass)
        if (isValid) {
          localStorage.setItem(AUTH_KEY, pass)
          recordActivity()
          document.body.classList.add('cms-active')
          if (authModal) authModal.classList.remove('open')
          startSessionTimer()
          showToast('Editor unlocked!')
        } else {
          if (authError) authError.textContent = 'Incorrect admin password.'
        }
      })
    }

    // Load content
    const loaded = await loadPortfolioContent()
    if (loaded) {
      currentContent = loaded
    }

    initTextBindings()
    initImageOverlays()
    initSectionToolbars()
    initItemToolbars()
    initCommandBar()
    initMediaModalHandlers()
    initCloudflareModalHandlers()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
