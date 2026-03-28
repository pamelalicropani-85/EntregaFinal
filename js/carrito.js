let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}



function agregarAlCarrito(libro) {
  const libroEnstock = carrito.find((item) => item.id === libro.id);

  if (libroEnstock) {
    libroEnstock.cantidad += 1;
  } else {
    carrito.push({ ...libro, cantidad: 1 });
  }

  guardarCarrito();
  renderCarrito();

  Toastify({
    text: "Agregado al carrito",
    duration: 1500,
    destination: "#",
    close: false,
    gravity: "top", 
    position: "right", 
    stopOnFocus: false,
    style: {
      background: "linear-gradient(to right, #57e45cff, #96c93d)",
    },
    onClick: function(){} 
  }).showToast();
}

function eliminarDelCarrito(idLibro) {
  carrito = carrito.filter((libro) => libro.id !== idLibro);
  guardarCarrito();
  renderCarrito();

  Toastify({
    text: "Eliminado del carrito",
    duration: 1500,
    destination: "#",
    close: false,
    gravity: "top", 
    position: "right", 
    stopOnFocus: false,
    style: {
      background: "linear-gradient(to right, #e2db58ff, #db6244ff)",
    },
    onClick: function(){} 
  }).showToast();
 
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
}

function calcularTotal(lista) {
  return lista.reduce((acumulador, libro) => {
    return acumulador + libro.precio * libro.cantidad;
  }, 0);
}

function renderCarrito() {
  const contenedor = document.getElementById("carrito");
  const total = document.getElementById("total");

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<li>El carrito está vacío.</li>";
    total.textContent = "Total: $0";
    return;
  }

  carrito.forEach(libro => {
    contenedor.innerHTML += `<li class="itemCarrito"><span>${libro.nombre} valor $${libro.precio} cantidad ${libro.cantidad}</span><button class="botonEliminar" data-id="${libro.id}">Eliminar</button></li>`;
  });

  total.textContent = `Total: $${calcularTotal(carrito)}`;
}


function mostrarComprobante(datosComprador, productosComprados) {
  const comprobante = document.getElementById("comprobante");
  const fecha = new Date().toLocaleDateString();

  let detalleProductos = "";

  productosComprados.forEach((libro) => {
    detalleProductos += `<li>${libro.nombre} valor $${libro.precio} cantidad ${libro.cantidad}</li>`;
  });

  const totalCompra = calcularTotal(productosComprados);

  comprobante.innerHTML = 
  `<h3>Comprobante de compra</h3>
   <p><strong>Fecha:</strong> ${fecha}</p>
   <p><strong>Comprador:</strong> ${datosComprador.nombre}</p>
   <p><strong>Email:</strong> ${datosComprador.email}</p>
   <p><strong>Dirección:</strong> ${datosComprador.direccion}</p>
   <p><strong>Productos:</strong></p>
   <ul>${detalleProductos}</ul>
   <p><strong>Total abonado:</strong> $${totalCompra}</p>`;

  comprobante.classList.remove("oculto");
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("botonEliminar")) {
    const idLibro = parseInt(event.target.dataset.id);
    eliminarDelCarrito(idLibro);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();

  const botonVaciar = document.getElementById("vaciarCarrito");
  const botonComprar = document.getElementById("mostrarFormularioCompra");
  const formularioCompra = document.getElementById("formularioCompra");
  const comprobante = document.getElementById("comprobante");

  botonVaciar.addEventListener("click", () => {
    if (carrito.length === 0) {
      mostrarToast("El carrito ya está vacío");
      return;
    }

    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Vas a eliminar todos los libros.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        vaciarCarrito();
        formularioCompra.classList.add("oculto");
        comprobante.classList.add("oculto");

        Swal.fire({
          title: "Carrito vacío",
          text: "Se vació el carrito correctamente.",
          icon: "success"
        });
      }
    });
  });

  botonComprar.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "Carrito vacío",
        text: "Agregá al menos un libro para continuar.",
        icon: "info"
      });
      return;
    }

    formularioCompra.classList.remove("oculto");
    comprobante.classList.add("oculto");
  });

  formularioCompra.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombreComprador").value;
    const email = document.getElementById("emailComprador").value;
    const direccion = document.getElementById("direccionComprador").value;

    if (!nombre || !email || !direccion) {
      Swal.fire({
        title: "Datos incompletos",
        text: "Completá todos los campos del comprador.",
        icon: "error"
      });
      return;
    }

    const datosComprador = {
      nombre,
      email,
      direccion
    };

    const productosComprados = [...carrito];

    mostrarComprobante(datosComprador, productosComprados);

    Swal.fire({
      title: "Compra realizada con éxito",
      text: "Tu comprobante fue generado correctamente.",
      icon: "success"
    });

    vaciarCarrito();
    formularioCompra.reset();
    formularioCompra.classList.add("oculto");
  });
});