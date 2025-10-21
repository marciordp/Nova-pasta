document.addEventListener("DOMContentLoaded", () => {
  // Detecta automaticamente se está no preview (iframe)
  let isPreview = false
  try {
    isPreview = window.self !== window.top
  } catch (e) {
    isPreview = true
  }

  if (isPreview) {
    document.body.classList.add("preview-mode")
    document.body.classList.remove("final-mode")
  } else {
    document.body.classList.add("final-mode")
    document.body.classList.remove("preview-mode")
  }

  // Resto do seu código do livro (sem mexer)
  const container = document.getElementById("livro-container-inner")
  const paginas = container.querySelectorAll(".livro-pagina")
  const btnPrev = container.querySelector("#livro-prev")
  const btnNext = container.querySelector("#livro-next")

  let paginaAtual = 0

  function mostrarPagina(index) {
    paginas.forEach((p, i) => {
      p.classList.toggle("active", i === index)
    })
  }

  btnPrev.addEventListener("click", () => {
    paginaAtual = (paginaAtual - 1 + paginas.length) % paginas.length
    mostrarPagina(paginaAtual)
  })

  btnNext.addEventListener("click", () => {
    paginaAtual = (paginaAtual + 1) % paginas.length
    mostrarPagina(paginaAtual)
  })

  mostrarPagina(paginaAtual)
})
