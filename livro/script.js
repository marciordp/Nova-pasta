document.addEventListener("DOMContentLoaded", () => {
  // Detecta modo (preview ou final)
  const urlParams = new URLSearchParams(window.location.search);
  const modo = urlParams.get("modo");
  const flipBook = document.getElementById("flip_book");
  const coverCheckbox = document.getElementById("cover_checkbox");

  if (!flipBook) return;

  // Define modo
  if (modo === "preview") {
    document.body.classList.add("preview-mode");
    document.body.classList.remove("final-mode");
  } else {
    document.body.classList.add("final-mode");
    document.body.classList.remove("preview-mode");
  }

  // Garante visibilidade
  flipBook.classList.add("livro-visivel");

  // Abertura da capa = centralização + leve zoom
  if (coverCheckbox) {
    coverCheckbox.addEventListener("change", () => {
      if (modo === "preview") {
        if (coverCheckbox.checked) {
          document.body.classList.add("book-aberto");
        } else {
          document.body.classList.remove("book-aberto");
        }
      }
    });
  }

  // Força redesenho 3D leve nas páginas
  const inputs = document.querySelectorAll("input[type='checkbox']");
  inputs.forEach((input) => {
    input.addEventListener("change", () => flipBook.getBoundingClientRect());
  });
});
