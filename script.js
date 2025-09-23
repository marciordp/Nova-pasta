document.addEventListener("DOMContentLoaded", () => {
  /* ---------- LANÇAMENTO ---------- */
  const landingWrap = document.getElementById("landingWrap")
  const launchBtn = document.getElementById("launchBtn")
  const circle = document.getElementById("circleExpand")
  const particlesCanvas = document.getElementById("launchParticles")
  const pctx = particlesCanvas.getContext("2d")
  let pw = (particlesCanvas.width = window.innerWidth)
  let ph = (particlesCanvas.height = window.innerHeight)

  // resize unificado
  function resizeAll() {
    pw = particlesCanvas.width = window.innerWidth
    ph = particlesCanvas.height = window.innerHeight
    ww = warpCanvas.width = window.innerWidth
    wh = warpCanvas.height = window.innerHeight
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }
  window.addEventListener("resize", resizeAll)

  /* PARTICLES */
  const particles = []
  function createParticles(x, y) {
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 8 + 2
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 4 + 2,
        alpha: 1,
      })
    }
  }
  function animateParticles() {
    pctx.clearRect(0, 0, pw, ph)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.99
      p.vy *= 0.99
      p.alpha -= 0.03
      pctx.fillStyle = `rgba(255,94,120,${Math.max(0, p.alpha)})`
      pctx.beginPath()
      pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      pctx.fill()
      if (p.alpha <= 0) particles.splice(i, 1)
    }
    requestAnimationFrame(animateParticles)
  }
  animateParticles()

  /* WARP STARS */
  const warpCanvas = document.createElement("canvas")
  warpCanvas.style.position = "fixed"
  warpCanvas.style.top = "0"
  warpCanvas.style.left = "0"
  warpCanvas.style.width = "100%"
  warpCanvas.style.height = "100%"
  warpCanvas.style.zIndex = "9997"
  warpCanvas.style.pointerEvents = "none"
  document.body.appendChild(warpCanvas)
  const wctx = warpCanvas.getContext("2d")
  let ww = (warpCanvas.width = window.innerWidth)
  let wh = (warpCanvas.height = window.innerHeight)
  const warpStars = []
  const WARP_COUNT = 160
  for (let i = 0; i < WARP_COUNT; i++) {
    warpStars.push({
      x: Math.random() * ww,
      y: Math.random() * wh,
      z: Math.random() * ww,
      r: Math.random() * 1.2 + 0.5,
    })
  }
  let warpActive = false
  function animateWarp() {
    if (!warpActive) {
      requestAnimationFrame(animateWarp)
      return
    }
    wctx.fillStyle = "rgba(11,6,18,0.2)"
    wctx.fillRect(0, 0, ww, wh)
    warpStars.forEach((s) => {
      s.z -= 18
      if (s.z <= 0) {
        s.z = ww
        s.x = Math.random() * ww
        s.y = Math.random() * wh
      }
      const px = (s.x - ww / 2) / ((s.z / ww) * 2) + ww / 2
      const py = (s.y - wh / 2) / ((s.z / ww) * 2) + wh / 2
      const size = Math.max(0.5, (1 - s.z / ww) * 3)
      wctx.fillStyle = "rgba(255,255,255,0.9)"
      wctx.fillRect(px, py, size, size)
    })
    requestAnimationFrame(animateWarp)
  }
  animateWarp()

  launchBtn.addEventListener("click", () => {
    if (launchBtn.disabled) return
    launchBtn.disabled = true
    const rect = launchBtn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2,
      cy = rect.top + rect.height / 2
    createParticles(cx, cy)
    launchBtn.textContent = "Declare seu amor"
    launchBtn.classList.add("launching")
    warpActive = true
    circle.style.left = `${cx}px`
    circle.style.top = `${cy}px`
    circle.offsetHeight
    circle.classList.add("active")
    setTimeout(() => {
      landingWrap.style.opacity = "0"
      setTimeout(() => {
        landingWrap.style.display = "none"
        const appWrap = document.getElementById("appWrap")
        appWrap.style.display = "flex"
        appWrap.style.alignItems = "center"
        appWrap.style.justifyContent = "center"
        warpCanvas.style.display = "none"
        requestAnimationFrame(() => {
          appWrap.style.opacity = "1"
        })
        setTimeout(() => {
          circle.classList.remove("active")
        }, 600)
      }, 220)
    }, 950)
  })

  /* ---------- BACKGROUND STARS ---------- */
  const canvas = document.getElementById("starCanvas")
  const ctx = canvas.getContext("2d")
  let w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight)
  const stars = [],
    shootingStars = []
  const STAR_COUNT = 70
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.5,
      alpha: Math.random() * 0.5 + 0.3,
      dAlpha: Math.random() * 0.015,
    })
  }
  function drawStars() {
    ctx.clearRect(0, 0, w, h)
    stars.forEach((s) => {
      s.alpha += s.dAlpha
      if (s.alpha > 1) {
        s.alpha = 1
        s.dAlpha *= -1
      }
      if (s.alpha < 0) {
        s.alpha = 0
        s.dAlpha *= -1
      }
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
      ctx.fill()
    })
    if (Math.random() < 0.003) {
      shootingStars.push({
        x: Math.random() * w,
        y: 0,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 10 + 6,
      })
    }
    shootingStars.forEach((s, i) => {
      s.x += s.speed
      s.y += s.speed
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x - s.len, s.y - s.len)
      ctx.strokeStyle = "rgba(255,255,255,0.75)"
      ctx.lineWidth = 1.2
      ctx.stroke()
      if (s.x > w + 50 || s.y > h + 50) shootingStars.splice(i, 1)
    })
    requestAnimationFrame(drawStars)
  }
  drawStars()

  /* ---------- STEPS ---------- */
  const steps = Array.from(document.querySelectorAll(".step"))
  const stepDots = Array.from(document.querySelectorAll(".step-dot"))
  let currentStep = 0
  function showStep(i) {
    steps.forEach((s, idx) => s.classList.toggle("active", idx === i))
    stepDots.forEach((d, idx) => {
      d.classList.remove("active", "past")
      if (idx <= i) d.classList.add("past")
      if (idx === i) d.classList.add("active")
    })
  }
  showStep(currentStep)
  document.querySelectorAll(".next-btn").forEach((b) =>
    b.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++
        showStep(currentStep)
      }
    })
  )
  document.querySelectorAll(".prev-btn").forEach((b) =>
    b.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--
        showStep(currentStep)
      }
    })
  )

  /* ---------- PREVIEW TEXTS ---------- */
  const previewRecipient = document.getElementById("previewRecipient")
  const previewSender = document.getElementById("previewSender")
  const previewMessage = document.getElementById("previewMessage")
  const recipientInput = document.getElementById("recipientName")
  const senderInput = document.getElementById("senderName")
  const messageInput = document.getElementById("message")
  recipientInput.addEventListener(
    "input",
    (e) =>
      (previewRecipient.textContent = e.target.value || "Nome da pessoa 💖")
  )
  senderInput.addEventListener(
    "input",
    (e) => (previewSender.textContent = e.target.value || "Você")
  )
  messageInput.addEventListener(
    "input",
    (e) =>
      (previewMessage.textContent =
        e.target.value || "Sua mensagem aparecerá aqui...")
  )

  /* ---------- SLIDES ---------- */
  const slidesWrapper = document.getElementById("slidesWrapper")
  let slideUrls = [],
    slideIndex = 0,
    slideInterval = null
  function revokeOldUrls(list) {
    if (!list || !list.length) return
    list.forEach((u) => {
      try {
        URL.revokeObjectURL(u)
      } catch {}
    })
  }
  document.getElementById("photos").addEventListener("change", (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    revokeOldUrls(slideUrls)
    slideUrls = files.map((f) => URL.createObjectURL(f))
    renderSlides()
    startSlides()
  })
  function renderSlides() {
    slidesWrapper.innerHTML = ""
    if (slideUrls.length === 0) {
      const empty = document.createElement("div")
      empty.className = "slide"
      empty.innerHTML = '<div style="color:#bdbdbd">Sem fotos</div>'
      slidesWrapper.appendChild(empty)
      slidesWrapper.style.transform = "translateX(0%)"
      return
    }
    slideUrls.forEach((url) => {
      const s = document.createElement("div")
      s.className = "slide"
      const img = document.createElement("img")
      img.src = url
      img.alt = "foto"
      s.appendChild(img)
      slidesWrapper.appendChild(s)
    })
    slidesWrapper.style.transform = "translateX(0%)"
  }
  function startSlides() {
    if (slideInterval) clearInterval(slideInterval)
    if (slideUrls.length > 1) {
      slideIndex = 0
      slideInterval = setInterval(() => {
        slideIndex = (slideIndex + 1) % slideUrls.length
        slidesWrapper.style.transform = `translateX(${-slideIndex * 100}%)`
      }, 2500)
    } else slidesWrapper.style.transform = "translateX(0%)"
  }
  renderSlides()

  /* ---------- TIMER ---------- */
  const timerText = document.getElementById("timerText")
  let specialDate = null,
    timerInterval = null
  function computeDiffComponents(diffMs) {
    const sign = diffMs >= 0 ? 1 : -1
    let ms = Math.abs(diffMs)
    const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365))
    ms -= years * (1000 * 60 * 60 * 24 * 365)
    const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30))
    ms -= months * (1000 * 60 * 60 * 24 * 30)
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    ms -= days * (1000 * 60 * 60 * 24)
    const hours = Math.floor(ms / (1000 * 60 * 60))
    ms -= hours * (1000 * 60 * 60)
    const minutes = Math.floor(ms / (1000 * 60))
    ms -= minutes * (1000 * 60)
    const seconds = Math.floor(ms / 1000)
    return { sign, years, months, days, hours, minutes, seconds }
  }
  function updateTimerDisplay() {
    if (!specialDate) {
      timerText.textContent = "00 anos 00 meses 00 dias 00:00:00"
      return
    }
    const now = new Date()
    const diff = specialDate - now
    const c = computeDiffComponents(diff)
    const text = `${c.years} anos ${c.months} meses ${c.days} dias ${String(
      c.hours
    ).padStart(2, "0")}:${String(c.minutes).padStart(2, "0")}:${String(
      c.seconds
    ).padStart(2, "0")}`
    timerText.textContent =
      c.sign >= 0 ? `Faltam: ${text}` : `Se passaram: ${text}`
  }
  document.getElementById("specialDate").addEventListener("change", (e) => {
    specialDate = e.target.value ? new Date(e.target.value) : null
    updateTimerDisplay()
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(updateTimerDisplay, 1000)
  })

  /* ---------- FINALIZAR ---------- */
  const form = document.getElementById("declarationForm")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const formSide = document.querySelector(".form-side")
    const previewSide = document.querySelector(".preview-side")
    const card = document.querySelector(".card")
    if (formSide) formSide.style.display = "none"
    if (previewSide) previewSide.classList.add("finalized")
    if (card) card.classList.add("finalized")
    previewRecipient.textContent = recipientInput.value || "Nome da pessoa 💖"
    previewSender.textContent = senderInput.value || "Você"
    previewMessage.textContent =
      messageInput.value || "Sua mensagem aparecerá aqui..."
    renderSlides()
    startSlides()
    updateTimerDisplay()
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(updateTimerDisplay, 1000)
  })
})
