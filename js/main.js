let libros = [];


const contenedorLibros = document.getElementById("listaDeLibros");
const filtroCategoria = document.getElementById("filtroCategoria");

function renderLibros(lista) {
  contenedorLibros.innerHTML = "";

  lista.forEach((libro) => {
    const card = document.createElement("div");
    card.className = "cardLibro";
    card.innerHTML = `<h3>${libro.nombre}</h3>
                      <h4><strong>Categoría:</strong> ${libro.categoria}</h4>
                      <p><strong>Precio:</strong> $${libro.precio}</p>
                      <button class="botonAgregar" data-id="${libro.id}">Agregar al carrito</button>`;
    contenedorLibros.appendChild(card);
  });
}

function cargarCategorias() {
  const categorias = libros.map((libro) => libro.categoria);
  const categoriasUnicas = [...new Set(categorias)];

  filtroCategoria.innerHTML = `<option value="todas">Todas</option>`;

  categoriasUnicas.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    filtroCategoria.appendChild(option);
  });
}

const URL = "./db/libros.json"

function obtenerLibros() {
  fetch(URL)
    .then(response => response.json())
    .then(data => {libros = data;
      cargarCategorias();                
      renderLibros(libros);   
    })
    .catch(err => console.log("Hubo un error:", err))
    .finally(() => console.log("Finalizó la petición"))
}
         

contenedorLibros.addEventListener("click", (event) => {
  if (event.target.classList.contains("botonAgregar")) {
    const idLibro = parseInt(event.target.dataset.id);
    const libroSeleccionado = libros.find((libro) => libro.id === idLibro);

    if (libroSeleccionado) {
      agregarAlCarrito(libroSeleccionado);
    }
  }
});

filtroCategoria.addEventListener("change", () => {
  const categoriaElegida = filtroCategoria.value;

  if (categoriaElegida === "todas") {
    renderLibros(libros);
  } else {
    const librosFiltrados = libros.filter((libro) => libro.categoria === categoriaElegida);
    renderLibros(librosFiltrados);
  }
});

obtenerLibros();