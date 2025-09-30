document.addEventListener("DOMContentLoaded", () => {
  /* ---------- LANÇAMENTO ---------- */
  const landingWrap = document.getElementById("landingWrap")
  const launchBtn = document.getElementById("launchBtn")
  const circle = document.getElementById("circleExpand")
  const particlesCanvas = document.getElementById("launchParticles")
  const pctx = particlesCanvas.getContext("2d")

  // Ajuste canvas Retina
  function resizeCanvas(canvas, ctx) {
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
  }
  resizeCanvas(particlesCanvas, pctx)

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
    pctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height)
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
  resizeCanvas(warpCanvas, wctx)
  const warpStars = []
  const WARP_COUNT = 160
  for (let i = 0; i < WARP_COUNT; i++) {
    warpStars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * window.innerWidth,
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
    wctx.fillRect(0, 0, warpCanvas.width, warpCanvas.height)
    warpStars.forEach((s) => {
      s.z -= 18
      if (s.z <= 0) {
        s.z = window.innerWidth
        s.x = Math.random() * window.innerWidth
        s.y = Math.random() * window.innerHeight
      }
      const px =
        (s.x - window.innerWidth / 2) / ((s.z / window.innerWidth) * 2) +
        window.innerWidth / 2
      const py =
        (s.y - window.innerHeight / 2) / ((s.z / window.innerWidth) * 2) +
        window.innerHeight / 2
      const size = Math.max(0.5, (1 - s.z / window.innerWidth) * 3)
      wctx.fillStyle = "rgba(255,255,255,0.9)"
      wctx.fillRect(px, py, size, size)
    })
    requestAnimationFrame(animateWarp)
  }
  animateWarp()

  /* BOTÃO LANÇAR */
  function launchEvent() {
    if (launchBtn.disabled) return
    launchBtn.disabled = true
    const rect = launchBtn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
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
        requestAnimationFrame(() => (appWrap.style.opacity = "1"))
        setTimeout(() => circle.classList.remove("active"), 600)
      }, 220)
    }, 950)
  }
  launchBtn.addEventListener("click", launchEvent)
  launchBtn.addEventListener("touchstart", launchEvent)

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

  /* ---- ENTER PARA AVANÇAR ---- */
  const inputs = document.querySelectorAll(".step input, .step textarea")
  inputs.forEach((input, idx) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        // Se não for o último step → avança
        if (currentStep < steps.length - 1) {
          currentStep++
          showStep(currentStep)
        } else {
          // Último step → dispara submit
          form.requestSubmit()
        }
      }
    })
  })


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
   ms -= years * 1000 * 60 * 60 * 24 * 365
   const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30))
   ms -= months * 1000 * 60 * 60 * 24 * 30
   const days = Math.floor(ms / (1000 * 60 * 60 * 24))
   ms -= days * 1000 * 60 * 60 * 24
   const hours = Math.floor(ms / (1000 * 60 * 60))
   ms -= hours * 1000 * 60 * 60
   const minutes = Math.floor(ms / (1000 * 60))
   ms -= minutes * 1000 * 60
   const seconds = Math.floor(ms / 1000)
   return { sign, years, months, days, hours, minutes, seconds }
 }

 function updateTimerDisplay() {
   if (!specialDate || isNaN(specialDate.getTime())) {
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

 // Use "input" em vez de "change" para atualização imediata
 document.getElementById("specialDate").addEventListener("input", (e) => {
   const value = e.target.value
   if (!value) {
     specialDate = null
     updateTimerDisplay()
     return
   }
   const parsedDate = new Date(value)
   if (!isNaN(parsedDate.getTime())) {
     specialDate = parsedDate
     updateTimerDisplay()
     if (timerInterval) clearInterval(timerInterval)
     timerInterval = setInterval(updateTimerDisplay, 1000)
   }
 })


  /* ---------- FINALIZAR ---------- */
  const form = document.getElementById("declarationForm")

  /* ---------- FINALIZAR (MODIFICADO PARA ESTRELAS NO CELULAR) ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const formSide = document.querySelector(".form-side")
    if (formSide) formSide.style.display = "none"

    const previewSide = document.querySelector(".preview-side")
    const originalCard = document.querySelector(".card")

    // cria overlay full-screen
    const full = document.createElement("div")
    full.id = "fullScreenPreview"
    Object.assign(full.style, {
      position: "fixed",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "99999",
      background: "linear-gradient(180deg,#07030c,#1e0f33)",
      overflow: "auto",
      padding: "20px",
    })
    document.body.appendChild(full)

    // Função que inicializa estrelas dentro do card
    function initStarsInCard(cardElement) {
      const starsCanvas = document.createElement("canvas")
      starsCanvas.style.position = "fixed"
      starsCanvas.style.top = "0"
      starsCanvas.style.left = "0"
      starsCanvas.style.width = "100%"
      starsCanvas.style.height = "100%"
      starsCanvas.style.pointerEvents = "none"
      starsCanvas.style.zIndex = "0"
      cardElement.style.position = "relative"
      cardElement.appendChild(starsCanvas)
      const ctx = starsCanvas.getContext("2d")

      function resizeCanvas() {
        starsCanvas.width = cardElement.offsetWidth
        starsCanvas.height = cardElement.offsetHeight
      }
      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      // CONFIGURAÇÃO DAS ESTRELAS
      let stars = []
      const NUM_STARS = 50

      function createStars() {
        stars = []
        for (let i = 0; i < NUM_STARS; i++) {
          stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1 + 0.5,
            s: Math.random() * 0.1 + 0.04,
            alpha: Math.random() * 0.5 + 0.2,
            delta: Math.random() * 0.03 + 0.01,
          })
        }
      }

      // Chame ao criar o canvas
      createStars()

      function resizeStarsCanvas() {
        starsCanvas.width = window.innerWidth
        starsCanvas.height = window.innerHeight
        createStars() // recria as estrelas no tamanho correto
      }
      window.addEventListener("resize", resizeStarsCanvas)
      resizeStarsCanvas()

      function animate() {
        ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height)
        stars.forEach((st) => {
          st.alpha += st.delta
          if (st.alpha > 1 || st.alpha < 0.4) st.delta *= -1

          ctx.beginPath()
          ctx.arc(st.x, st.y, st.r + 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${st.alpha * 0.6})`
          ctx.fill()

          ctx.beginPath()
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,1)`
          ctx.fill()

          st.y -= st.s
          if (st.y < 0) {
            st.y = starsCanvas.height
            st.x = Math.random() * starsCanvas.width
          }
        })
        requestAnimationFrame(animate)
      }
      animate()
    }

    if (originalCard) {
      const cardClone = originalCard.cloneNode(true)
      Object.assign(cardClone.style, {
        position: "relative",
        zIndex: "2",
        width: "min(92vw, 900px)",
        maxHeight: "94vh",
        overflow: "auto",
        padding: "28px",
        boxSizing: "border-box",
        borderRadius: "16px",
      })

      const cRecipient = cardClone.querySelector("#previewRecipient")
      const cSender = cardClone.querySelector("#previewSender")
      const cMessage = cardClone.querySelector("#previewMessage")
      if (cRecipient)
        cRecipient.textContent = recipientInput.value || "Nome da pessoa 💖"
      if (cSender) cSender.textContent = senderInput.value || "Você"
      if (cMessage)
        cMessage.textContent =
          messageInput.value || "Sua mensagem aparecerá aqui..."

      full.appendChild(cardClone)

      // inicializa estrelas dentro do clone do card
      initStarsInCard(cardClone)
    }
  })

  /* ---------- RESIZE ALL CANVAS ---------- */
  function resizeAll() {
    resizeCanvas(particlesCanvas, pctx)
    resizeCanvas(warpCanvas, wctx)
  }
  window.addEventListener("resize", resizeAll)

  /* ---------- ESTRELAS NO PREVIEW ---------- */
  const previewCanvas = document.querySelector(".stars-preview")
  if (previewCanvas) {
    const ctx = previewCanvas.getContext("2d")

    function resizePreviewCanvas() {
      previewCanvas.width = previewCanvas.offsetWidth
      previewCanvas.height = previewCanvas.offsetHeight
    }
    resizePreviewCanvas()
    window.addEventListener("resize", resizePreviewCanvas)

    const stars = []
    const NUM_STARS = 30
    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: Math.random() * previewCanvas.width,
        y: Math.random() * previewCanvas.height,
        r: Math.random() * 1 + 0.5,
        s: Math.random() * 0.1 + 0.04,
        alpha: Math.random() * 0.5 + 0.2,
        delta: Math.random() * 0.03 + 0.01,
      })
    }

    function animatePreviewStars() {
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
      stars.forEach((st) => {
        st.alpha += st.delta
        if (st.alpha > 1 || st.alpha < 0.4) st.delta *= -1

        ctx.beginPath()
        ctx.arc(st.x, st.y, st.r + 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${st.alpha * 0.6})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,1)`
        ctx.fill()

        st.y -= st.s
        if (st.y > previewCanvas.height) {
          st.y = 0
          st.x = Math.random() * previewCanvas.width
        }
      })
      requestAnimationFrame(animatePreviewStars)
    }
    animatePreviewStars()
  }
})
