// === JS COMPLETO ===

// PASSO A PASSO
const steps = document.querySelectorAll(".form-step")
const nextBtns = document.querySelectorAll(".next-btn")
const prevBtns = document.querySelectorAll(".prev-btn")
const finishBtn = document.querySelector(".finish-btn")
let currentStep = 0
function showStep(step) {
  steps.forEach((s, i) => {
    s.classList.toggle("active", i === step)
    const prev = s.querySelector(".prev-btn")
    if (prev) prev.style.display = step === 0 ? "none" : "inline-block"
  })
}
showStep(currentStep)
nextBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++
      showStep(currentStep)
      updatePreview()
    }
  })
)
prevBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--
      showStep(currentStep)
      updatePreview()
    }
  })
)

// PREVIEW
const pTo = document.getElementById("pTo")
const pFrom = document.getElementById("pFrom")
const pMessage = document.getElementById("pMessage")
const toNameInput = document.getElementById("toName")
const fromNameInput = document.getElementById("fromName")
const messageInput = document.getElementById("message")
function updatePreview() {
  pTo.textContent = "Para: " + (toNameInput.value || "(nome)")
  pFrom.textContent = "De: " + (fromNameInput.value || "(seu nome)")
  pMessage.textContent = messageInput.value || "(Sua declaração aparecerá aqui)"
}
toNameInput.addEventListener("input", updatePreview)
fromNameInput.addEventListener("input", updatePreview)
messageInput.addEventListener("input", updatePreview)

// SLIDES
const slidesContainer = document.getElementById("slidesContainer")
let slideUrls = [],
  slideIndex = 0,
  slideshowInterval
document.getElementById("photos").addEventListener("change", (e) => {
  slideUrls = Array.from(e.target.files).map((f) => URL.createObjectURL(f))
  renderSlides()
})
function renderSlides() {
  slidesContainer.innerHTML = ""
  slideUrls.forEach((url) => {
    const img = document.createElement("img")
    img.src = url
    slidesContainer.appendChild(img)
  })
  if (slideshowInterval) clearInterval(slideshowInterval)
  if (slideUrls.length > 1) {
    slideIndex = 0
    slideshowInterval = setInterval(() => {
      slideIndex = (slideIndex + 1) % slideUrls.length
      slidesContainer.style.transform = `translateX(${
        -slideIndex * (100 / slideUrls.length)
      }%)`
    }, 1500)
  }
}

// TIMER
const timerEl = document.getElementById("timer")
const startDateInput = document.getElementById("startDate")
function updateTimer() {
  const startDate = new Date(startDateInput.value)
  if (isNaN(startDate)) return
  const now = new Date()
  let diff = startDate - now
  if (diff < 0) diff = 0
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) % 12
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  const seconds = Math.floor(diff / 1000) % 60
  timerEl.textContent = `${years}a ${months}m ${days}d ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}

// EMOTES
let emotes = []
const emoteInput = document.getElementById("emoteInput")
const emoteOptions = document.querySelector(".emote-options")
const emoteAmount = document.getElementById("emoteAmount")
const updateEmotesBtn = document.getElementById("updateEmotesBtn")
emoteInput.addEventListener(
  "click",
  () => (emoteOptions.style.display = "flex")
)
emoteOptions.querySelectorAll("span").forEach((span) => {
  span.addEventListener("click", () => {
    emoteInput.value = span.textContent
    emoteOptions.style.display = "none"
    updateEmotes()
  })
})
updateEmotesBtn.addEventListener("click", updateEmotes)
function updateEmotes() {
  emotes.forEach((e) => e.remove())
  emotes = []
  const amount = parseInt(emoteAmount.value)
  const selected = emoteInput.value
  for (let i = 0; i < amount; i++) {
    const span = document.createElement("span")
    span.textContent = selected
    span.style.position = "absolute"
    span.style.top = Math.random() * 80 + "%"
    span.style.left = Math.random() * 90 + "%"
    span.style.fontSize = 12 + Math.random() * 16 + "px"
    span.style.opacity = 0.7
    span.style.pointerEvents = "none"
    document.querySelector(".card").appendChild(span)
    emotes.push(span)
    animateEmote(span)
  }
}
function animateEmote(el) {
  let y = 0
  function move() {
    y -= 0.3 + Math.random() * 0.5
    el.style.transform = `translateY(${y}px)`
    if (y < -window.innerHeight) y = window.innerHeight
    requestAnimationFrame(move)
  }
  move()
}

// YOUTUBE
let ytPlayer,
  isPlaying = false
let tag = document.createElement("script")
tag.src = "https://www.youtube.com/iframe_api"
document.body.appendChild(tag)
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player("youtubePlayer", {
    height: "0",
    width: "0",
    videoId: "",
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: "",
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
    },
    events: { onReady: () => {} },
  })
}

// MÚSICA
const musicPopup = document.getElementById("musicPopup")
const musicTitle = document.getElementById("musicTitle")
const musicThumb = document.getElementById("musicThumb")
const playPauseBtn = document.getElementById("playPauseBtn")
const youtubeUrlInput = document.getElementById("youtubeUrl")
youtubeUrlInput.addEventListener("input", () => {
  const url = youtubeUrlInput.value
  if (!url) return
  const videoId = url.split("v=")[1]?.split("&")[0]
  if (!videoId) return
  musicThumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  musicTitle.textContent = "Sua música"
  musicPopup.style.display = "flex"
  if (ytPlayer) {
    ytPlayer.loadVideoById(videoId)
    ytPlayer.playVideo()
    isPlaying = true
    playPauseBtn.textContent = "Pause"
  }
})
playPauseBtn.addEventListener("click", () => {
  if (!ytPlayer) return
  if (isPlaying) {
    ytPlayer.pauseVideo()
    isPlaying = false
    playPauseBtn.textContent = "Play"
  } else {
    ytPlayer.playVideo()
    isPlaying = true
    playPauseBtn.textContent = "Pause"
  }
})

// FINALIZAR
finishBtn.addEventListener("click", () => {
  updatePreview()
  document.querySelector(".form-section").style.display = "none"
  document.querySelector(".emote-controls").style.display = "none"
  const preview = document.querySelector(".preview-section")
  preview.classList.add("fullscreen-preview")

  // Reinicia slideshow
  if (slideshowInterval) clearInterval(slideshowInterval)
  if (slideUrls.length > 1) {
    slideIndex = 0
    slideshowInterval = setInterval(() => {
      slideIndex = (slideIndex + 1) % slideUrls.length
      slidesContainer.style.transform = `translateX(${
        -slideIndex * (100 / slideUrls.length)
      }%)`
    }, 1500)
  }

  // Reinicia timer
  updateTimer()
  setInterval(updateTimer, 1000)

  // Música
  const url = youtubeUrlInput.value
  if (url && ytPlayer) {
    const videoId = url.split("v=")[1]?.split("&")[0]
    if (videoId) {
      ytPlayer.loadVideoById(videoId)
      ytPlayer.playVideo()
      isPlaying = true
      musicPopup.style.display = "flex"
      playPauseBtn.textContent = "Pause"
      musicThumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      musicTitle.textContent = "Sua música"
    }
  }
})
