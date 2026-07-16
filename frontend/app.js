const API_URL = "http://127.0.0.1:8000/anuncios";
let todosOsAnuncios = [];

async function fetchAnuncios(url = API_URL) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    todosOsAnuncios = await response.json();
    renderAnuncios(todosOsAnuncios);
  } catch (error) {
    console.error("Falha ao buscar anúncios:", error);
  }
}

function renderAnuncios(anuncios = []) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  grid.innerHTML = "";

  anuncios.forEach((anuncio) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.className = "product-image";
    img.src = anuncio.imagem_url;
    img.alt = anuncio.titulo;

    const info = document.createElement("div");
    info.className = "product-info";

    const title = document.createElement("h3");
    title.className = "product-title";
    title.textContent = anuncio.titulo;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = `R$ ${anuncio.preco.toFixed(2)}`;

    const desc = document.createElement("p");
    desc.className = "product-description";
    desc.textContent = anuncio.descricao;

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn-delete";
    btnDelete.textContent = "Remover Anúncio";
    btnDelete.addEventListener("click", () => excluirAnuncio(anuncio.id));

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(desc);
    info.appendChild(btnDelete);

    card.appendChild(img);
    card.appendChild(info);

    grid.appendChild(card);
  });
}

function filtrarCategoria(categoria) {
  if (categoria === "todos") {
    renderAnuncios(todosOsAnuncios);
  } else {
    const filtrados = todosOsAnuncios.filter(
      (anuncio) => anuncio.categoria.toLowerCase() === categoria.toLowerCase()
    );
    renderAnuncios(filtrados);
  }
}

async function cadastrarAnuncio(event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const categoria = document.getElementById("categoria").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const imagem_url = document.getElementById("imagem_url").value;
  const descricao = document.getElementById("descricao").value;

  const novoAnuncio = { titulo, categoria, preco, imagem_url, descricao };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoAnuncio)
    });

    if (response.ok) {
      document.getElementById("form-anuncio").reset();
      toggleModal(false);
      fetchAnuncios();
    } else {
      alert("Erro ao cadastrar anúncio.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

async function excluirAnuncio(id) {
  if (!confirm("Tem certeza que deseja remover este anúncio?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      fetchAnuncios();
    } else {
      alert("Erro ao excluir o anúncio.");
    }
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}

function toggleModal(show = true) {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  if (show) {
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAnuncios();

  const btnOpen = document.getElementById("btn-open-modal");
  const btnClose = document.getElementById("btn-close-modal");
  const overlay = document.getElementById("modal-overlay");
  const form = document.getElementById("form-anuncio");

  if (btnOpen) btnOpen.addEventListener("click", () => toggleModal(true));
  if (btnClose) btnClose.addEventListener("click", () => toggleModal(false));
  if (form) form.addEventListener("submit", cadastrarAnuncio);

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) toggleModal(false);
    });
  }

  const botoesFiltro = document.querySelectorAll(".btn-filter");
  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoesFiltro.forEach((btn) => btn.classList.remove("active"));
      botao.classList.add("active");
      const categoria = botao.getAttribute("data-category");
      filtrarCategoria(categoria);
    });
  });
});