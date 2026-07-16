const API_URL = "http://127.0.0.1:8000/anuncios";

async function fetchAnuncios(url = API_URL) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const anuncios = await response.json();
    renderAnuncios(anuncios);
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
    img.className = "product-image";
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

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(desc);

    card.appendChild(img);
    card.appendChild(info);

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAnuncios();
});