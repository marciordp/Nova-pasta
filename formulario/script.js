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
  inputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (currentStep < steps.length - 1) {
          currentStep++
          showStep(currentStep)
        } else {
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

  recipientInput.addEventListener("input", (e) => {
    previewRecipient.textContent = e.target.value || "Nome da pessoa 💖"
  })
  senderInput.addEventListener("input", (e) => {
    previewSender.textContent = e.target.value || "Você"
  })
  messageInput.addEventListener("input", (e) => {
    previewMessage.textContent =
      e.target.value || "Sua mensagem aparecerá aqui..."
  })

  /* ---------- SLIDES / LIVRO ---------- */
  function carregarLivro() {
    fetch("livro/index.html")
      .then((response) => response.text())
      .then((html) => {
        const container = document.getElementById("livro-container")
        container.innerHTML = html

        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "livro/style.css"
        document.head.appendChild(link)

        const script = document.createElement("script")
        script.src = "livro/script.js"
        document.body.appendChild(script)
      })
      .catch((err) => console.error("Erro ao carregar o livro:", err))
  }
  carregarLivro()

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

  /* ---------- FINALIZAR UNIFICADO ---------- */
  const formEl = document.getElementById("declarationForm")
  formEl.addEventListener("submit", function (e) {
    e.preventDefault()
    try {
      const preview = document.querySelector(".preview-side")
      const html = preview ? preview.innerHTML : "<h2>Sem preview</h2>"
      localStorage.setItem("axiom_final_html", html)

      const fd = new FormData(formEl)
      const obj = {}
      for (const [k, v] of fd.entries()) obj[k] = v
      localStorage.setItem("axiom_final_data", JSON.stringify(obj))

      // Redireciona para o resultado-final (sem espaço no nome da pasta)
      window.location.href = "../resultado-final/index.html"
    } catch (err) {
      console.error("Erro ao salvar preview:", err)
    }
  })

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

  if (window.innerWidth <= 768) {
    document.body.classList.add("preview-mode")
  }

  // Garante proporção correta no preview em celulares
  window.addEventListener("resize", () => {
    const iframe = document.getElementById("bookPreview")
    if (iframe) {
      if (window.innerWidth < 768) {
        iframe.style.width = "100%"
        iframe.style.height = "auto"
      } else {
        iframe.style.width = "290px"
        iframe.style.height = "200px"
      }
    }
  })
});
