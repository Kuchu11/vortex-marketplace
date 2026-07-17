const API_URL = "http://127.0.0.1:8000/anuncios";
let todosOsAnuncios = [];
let categoriaAtiva = "todos";
let textoBusca = "";

async function fetchAnuncios(url = API_URL) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    todosOsAnuncios = await response.json();
    filtrarEAplicar();
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

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn-delete";
    btnDelete.innerHTML = "&times;";
    btnDelete.title = "Remover Anúncio";
    btnDelete.addEventListener("click", () => excluirAnuncio(anuncio.id));

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

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const btnInterest = document.createElement("button");
    btnInterest.className = "btn-interest";
    btnInterest.textContent = "Tenho Interesse";
    btnInterest.addEventListener("click", () => abrirModalContato(anuncio));

    actions.appendChild(btnInterest);

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(desc);
    info.appendChild(actions);

    card.appendChild(btnDelete);
    card.appendChild(img);
    card.appendChild(info);

    grid.appendChild(card);
  });
}

function filtrarEAplicar() {
  let filtrados = todosOsAnuncios;

  if (categoriaAtiva !== "todos") {
    filtrados = filtrados.filter(
      (anuncio) => anuncio.categoria.toLowerCase() === categoriaAtiva.toLowerCase()
    );
  }

  if (textoBusca.trim() !== "") {
    const termo = textoBusca.toLowerCase();
    filtrados = filtrados.filter(
      (anuncio) =>
        anuncio.titulo.toLowerCase().includes(termo) ||
        anuncio.descricao.toLowerCase().includes(termo)
    );
  }

  renderAnuncios(filtrados);
}

function formatarMoeda(valorStr) {
  let valorLimpo = valorStr.replace(/\D/g, "");
  if (valorLimpo === "") return "";
  let valorCentavos = parseFloat(valorLimpo) / 100;
  return valorCentavos.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function obterValorDecimal(valorFormatado) {
  let valorLimpo = valorFormatado.replace(/\D/g, "");
  if (valorLimpo === "") return 0;
  return parseFloat(valorLimpo) / 100;
}

async function cadastrarAnuncio(event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const categoria = document.getElementById("categoria").value;
  const precoFormatado = document.getElementById("preco").value;
  const preco = obterValorDecimal(precoFormatado);
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
      const helpBox = document.getElementById("help-box");
      if (helpBox) helpBox.classList.remove("active");
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

function abrirModalContato(anuncio) {
  const overlay = document.getElementById("contact-overlay");
  const titleElem = document.getElementById("contact-item-title");
  const priceElem = document.getElementById("contact-item-price");
  const whatsappBtn = document.getElementById("contact-whatsapp");
  const emailBtn = document.getElementById("contact-email");

  if (!overlay) return;

  titleElem.textContent = anuncio.titulo;
  priceElem.textContent = `R$ ${anuncio.preco.toFixed(2)}`;

  const celularSimulado = "5585999999999"; 
  const mensagem = encodeURIComponent(`Olá, vi seu anúncio do item "${anuncio.titulo}" no Vortex Marketplace e tenho interesse!`);
  whatsappBtn.href = `https://wa.me/${celularSimulado}?text=${mensagem}`;

  const emailSimulado = "vendedor@unifor.br";
  emailBtn.href = `mailto:${emailSimulado}?subject=Vortex%20Marketplace%20-%20Interesse%20no%20item%20${encodeURIComponent(anuncio.titulo)}`;

  overlay.classList.add("active");
}

function fecharModalContato() {
  const overlay = document.getElementById("contact-overlay");
  if (overlay) {
    overlay.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAnuncios();

  const btnOpen = document.getElementById("btn-open-modal");
  const btnClose = document.getElementById("btn-close-modal");
  const overlay = document.getElementById("modal-overlay");
  const form = document.getElementById("form-anuncio");
  const precoInput = document.getElementById("preco");
  const searchInput = document.getElementById("search-input");

  const btnCloseContact = document.getElementById("btn-close-contact");
  const contactOverlay = document.getElementById("contact-overlay");

  const btnHelp = document.getElementById("btn-help-trigger");
  const helpBox = document.getElementById("help-box");
  const btnCopy = document.getElementById("btn-copy-example");

  if (btnOpen) btnOpen.addEventListener("click", () => toggleModal(true));
  if (btnClose) btnClose.addEventListener("click", () => toggleModal(false));
  if (form) form.addEventListener("submit", cadastrarAnuncio);

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) toggleModal(false);
    });
  }

  if (btnCloseContact) btnCloseContact.addEventListener("click", fecharModalContato);
  if (contactOverlay) {
    contactOverlay.addEventListener("click", (e) => {
      if (e.target === contactOverlay) fecharModalContato();
    });
  }

  if (precoInput) {
    precoInput.addEventListener("input", (e) => {
      e.target.value = formatarMoeda(e.target.value);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      textoBusca = e.target.value;
      filtrarEAplicar();
    });
  }

  if (btnHelp && helpBox) {
    btnHelp.addEventListener("click", () => {
      helpBox.classList.toggle("active");
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      const exampleText = document.getElementById("example-link").textContent;
      navigator.clipboard.writeText(exampleText).then(() => {
        const originalText = btnCopy.textContent;
        btnCopy.textContent = "Copiado!";
        setTimeout(() => {
          btnCopy.textContent = originalText;
        }, 1500);
      });
    });
  }

  const botoesFiltro = document.querySelectorAll(".btn-filter");
  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoesFiltro.forEach((btn) => btn.classList.remove("active"));
      botao.classList.add("active");
      categoriaAtiva = botao.getAttribute("data-category");
      filtrarEAplicar();
    });
  });
});