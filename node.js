document.addEventListener("DOMContentLoaded", () => {
  /* ----- BOTÃO LANÇAMENTO ----- */
  const landingWrap = document.getElementById("landingWrap")
  const launchBtn = document.getElementById("launchBtn")
  const particlesCanvas = document.getElementById("launchParticles")
  const pctx = particlesCanvas.getContext("2d")
  let pw = (particlesCanvas.width = window.innerWidth)
  let ph = (particlesCanvas.height = window.innerHeight)
  window.addEventListener("resize", () => {
    pw = particlesCanvas.width = window.innerWidth
    ph = particlesCanvas.height = window.innerHeight
  })

  const particles = []

  function createParticles(x, y) {
    for (let i = 0; i < 40; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        r: Math.random() * 3 + 1,
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
      p.alpha -= 0.03
      pctx.fillStyle = `rgba(255,94,120,${p.alpha})`
      pctx.beginPath()
      pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      pctx.fill()
      if (p.alpha <= 0) particles.splice(i, 1)
    }
    requestAnimationFrame(animateParticles)
  }
  animateParticles()

  launchBtn.addEventListener("click", () => {
    const rect = launchBtn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    createParticles(cx, cy)
    launchBtn.textContent = "Declare seu amor"
    launchBtn.classList.add("launching")

    setTimeout(() => {
      landingWrap.style.display = "none"
      document.getElementById("appWrap").style.display = "flex"
    }, 2000)
  })

  /* ----- BACKGROUND ESTRELAS ----- */
  const canvas = document.getElementById("starCanvas")
  const ctx = canvas.getContext("2d")
  let w = (canvas.width = window.innerWidth)
  let h = (canvas.height = window.innerHeight)
  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  })

  const stars = []
  const STAR_COUNT = 120
  const shootingStars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.5,
      alpha: Math.random(),
      dAlpha: Math.random() * 0.02,
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
    requestAnimationFrame(drawStars)
  }
  drawStars()

  /* ----- SEU CÓDIGO ORIGINAL DO SITE (form, preview, slides, timer) ----- */
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

  const slidesWrapper = document.getElementById("slidesWrapper")
  let slideUrls = []
  let slideIndex = 0
  let slideInterval = null
  document.getElementById("photos").addEventListener("change", (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
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
    slidesWrapper.style.transform = `translateX(0%)`
  }

  function startSlides() {
    if (slideInterval) clearInterval(slideInterval)
    if (slideUrls.length > 1) {
      slideIndex = 0
      slideInterval = setInterval(() => {
        slideIndex = (slideIndex + 1) % slideUrls.length
        slidesWrapper.style.transform = `translateX(${-slideIndex * 100}%)`
      }, 2000)
    } else slidesWrapper.style.transform = `translateX(0%)`
  }
  renderSlides()

  const timerText = document.getElementById("timerText")
  let specialDate = null
  let timerInterval = null

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

  const form = document.getElementById("declarationForm")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    document.querySelector(".form-side").style.display = "none"
    document.querySelector(".preview-side").style.flex = "1 1 100%"
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
