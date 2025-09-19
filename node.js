// ===== WIZARD FORM =====
const formSteps = document.querySelectorAll(".form-step")
let currentStep = 0
function showStep(index) {
  formSteps.forEach((step, i) => step.classList.toggle("active", i === index))
}
showStep(currentStep)
document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < formSteps.length - 1) {
      currentStep++
      showStep(currentStep)
    }
  })
})

// ===== PREVIEW =====
const toEl = document.getElementById("toName")
const fromEl = document.getElementById("fromName")
const messageEl = document.getElementById("message")
const dateEl = document.getElementById("startDate")
const previewTo = document.getElementById("pTo")
const previewFrom = document.getElementById("pFrom")
const previewMessage = document.getElementById("pMessage")
const timerEl = document.getElementById("timer")

function updatePreview() {
  previewTo.textContent = toEl.value || "(nome)"
  previewFrom.textContent = fromEl.value || "(seu nome)"
  previewMessage.textContent =
    messageEl.value || "(Sua declaração aparecerá aqui)"
}
;[toEl, fromEl, messageEl, dateEl].forEach((el) =>
  el.addEventListener("input", updatePreview)
)
updatePreview()

// ===== SLIDESHOW =====
const photosEl = document.getElementById("photos")
const slidesContainer = document.getElementById("slidesContainer")
let slideUrls = [],
  slideIndex = 0,
  slideshowInterval = null

photosEl.addEventListener("change", () => {
  const files = Array.from(photosEl.files).slice(0, 5)
  slideUrls = files.map((f) => URL.createObjectURL(f))
  slidesContainer.innerHTML = ""
  slideUrls.forEach((src) => {
    const img = document.createElement("img")
    img.src = src
    slidesContainer.appendChild(img)
  })
  slideIndex = 0
  if (slideshowInterval) clearInterval(slideshowInterval)
  if (slideUrls.length > 1)
    slideshowInterval = setInterval(() => {
      slideIndex = (slideIndex + 1) % slideUrls.length
      slidesContainer.style.transform = `translateX(${
        -slideIndex * (100 / slideUrls.length)
      }%)`
    }, 1500)
})

// ===== TIMER =====
let startDate = null,
  timerInterval = null
dateEl.addEventListener("input", () => {
  if (!dateEl.value) {
    timerEl.textContent = "0a 0m 0d 00:00:00"
    return
  }
  startDate = new Date(dateEl.value + "T00:00:00")
  if (timerInterval) clearInterval(timerInterval)
  updateTimer()
  timerInterval = setInterval(updateTimer, 1000)
})
function updateTimer() {
  if (!startDate) {
    timerEl.textContent = "0a 0m 0d 00:00:00"
    return
  }
  let now = new Date()
  if (now < startDate) now = startDate
  let years = now.getFullYear() - startDate.getFullYear()
  let months = now.getMonth() - startDate.getMonth()
  let days = now.getDate() - startDate.getDate()
  let hours = now.getHours() - startDate.getHours()
  let minutes = now.getMinutes() - startDate.getMinutes()
  let seconds = now.getSeconds() - startDate.getSeconds()
  if (seconds < 0) {
    seconds += 60
    minutes--
  }
  if (minutes < 0) {
    minutes += 60
    hours--
  }
  if (hours < 0) {
    hours += 24
    days--
  }
  if (days < 0) {
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
    months--
  }
  if (months < 0) {
    months += 12
    years--
  }
  timerEl.textContent = `${years}a ${months}m ${days}d ${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

// ===== EMOTES =====
const emoteInputField = document.getElementById("emoteInput")
const emoteOptions = document.querySelector(".emote-options")
const emoteAmount = document.getElementById("emoteAmount")
const updateEmotesBtn = document.getElementById("updateEmotesBtn")
const heartBackground = document.querySelector(".heart-background")

let currentEmote = "❤️",
  emoteCount = Number(emoteAmount.value),
  emoteInterval = null

function createEmote() {
  const span = document.createElement("span")
  span.textContent = currentEmote
  span.style.position = "absolute"
  span.style.left = Math.random() * 100 + "vw"
  span.style.top = Math.random() * 100 + "vh"
  span.style.fontSize = 10 + Math.random() * 20 + "px"
  span.style.opacity = Math.random() * 0.7 + 0.3
  heartBackground.appendChild(span)
  const duration = 5 + Math.random() * 5
  span.animate(
    [
      { transform: "translateY(0) rotate(0deg)", opacity: span.style.opacity },
      { transform: "translateY(-120vh) rotate(360deg)", opacity: 0 },
    ],
    { duration: duration * 1000, easing: "linear" }
  )
  setTimeout(() => span.remove(), duration * 1000)
}

function startEmotes() {
  if (emoteInterval) clearInterval(emoteInterval)
  emoteInterval = setInterval(() => {
    for (let i = 0; i < emoteCount; i++) createEmote()
  }, 500)
}
updateEmotesBtn.addEventListener("click", () => {
  currentEmote = emoteInputField.value || "❤️"
  emoteCount = Number(emoteAmount.value) || 5
  startEmotes()
})
startEmotes()

emoteInputField.addEventListener("click", () => {
  emoteOptions.style.display =
    emoteOptions.style.display === "flex" ? "none" : "flex"
})
emoteOptions.querySelectorAll("span").forEach((span) => {
  span.addEventListener("click", () => {
    emoteInputField.value = span.textContent
    currentEmote = span.textContent
    emoteOptions.style.display = "none"
    startEmotes()
  })
})
document.addEventListener("click", (e) => {
  if (!e.target.closest(".emote-picker")) emoteOptions.style.display = "none"
})

// ===== MÚSICA =====
const ytEl = document.getElementById("youtubeUrl")
const musicPopup = document.getElementById("musicPopup")
const musicTitle = document.getElementById("musicTitle")
const playPauseBtn = document.getElementById("playPauseBtn")

let audio = new Audio()
let isPlaying = false

ytEl.addEventListener("input", () => {
  const url = ytEl.value
  if (!url) return
  musicTitle.textContent = "Sua música"
  musicPopup.style.display = "block"
})

playPauseBtn.addEventListener("click", () => {
  if (!audio.src) return
  if (isPlaying) {
    audio.pause()
    playPauseBtn.textContent = "Play"
    isPlaying = false
  } else {
    audio.play()
    playPauseBtn.textContent = "Pause"
    isPlaying = true
  }
})
