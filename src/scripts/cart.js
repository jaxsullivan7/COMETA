/**
 * Cesta de COMETA.
 * Estado en localStorage, sin backend. El pedido se envía por WhatsApp si hay
 * número configurado en src/data/site.ts; si no, se copia o se manda por correo.
 */

const STORAGE_KEY = "cometa:cesta:v1";
const MAX_UNIDADES = 20;

const dataEl = document.getElementById("cometa-productos");
const productos = dataEl ? JSON.parse(dataEl.textContent || "[]") : [];
const porId = new Map(productos.map((p) => [p.id, p]));

const whatsapp = document.body.dataset.whatsapp || "";
const email = document.body.dataset.email || "";
const preciosProvisionales = document.body.dataset.precios === "true";

const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("cart-overlay");
const lista = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");
const contadorEls = document.querySelectorAll("[data-cart-count]");
const vaciarBtn = document.querySelector("[data-cart-clear]");
const waBtn = document.querySelector("[data-cart-whatsapp]");
const copiarBtn = document.querySelector("[data-cart-copy]");
const mailBtn = document.querySelector("[data-cart-mail]");
const mensaje = document.getElementById("cart-msg");
const estadoEl = document.getElementById("cart-status");

let carrito = leer();
let ultimoFoco = null;

const euros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const colores = {
  premama: "bg-blush-soft",
  bebes: "bg-cream-deep/80",
  ninos: "bg-sage-soft",
};

const etiquetas = {
  premama: "Premamá",
  bebes: "Bebés",
  ninos: "Niños",
};

const iconoCometa = `
  <svg viewBox="0 0 40 48" fill="none" aria-hidden="true" class="h-9 w-7 text-gold/60">
    <path d="M20 3 32 15 20 27 8 15Z" stroke="currentColor" stroke-width="1.3"/>
    <path d="M20 3v24M8 15h24" stroke="currentColor" stroke-width="1" opacity=".5"/>
    <path d="M20 27c1.8 4 0 7 2.4 10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`;

function leer() {
  try {
    const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(guardado)) return [];
    return guardado
      .filter((item) => item && porId.has(item.id))
      .map((item) => ({
        id: item.id,
        cantidad: Math.min(MAX_UNIDADES, Math.max(1, Number(item.cantidad) || 1)),
      }));
  } catch {
    return [];
  }
}

function guardar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  pintar();
}

function totalUnidades() {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0);
}

function importeTotal() {
  return carrito.reduce(
    (suma, item) => suma + porId.get(item.id).precio * item.cantidad,
    0,
  );
}

function montarMensaje() {
  const lineas = carrito.map((item) => {
    const producto = porId.get(item.id);
    return `• ${item.cantidad} × ${producto.nombre} — ${euros.format(
      producto.precio * item.cantidad,
    )}`;
  });

  return [
    "¡Hola COMETA! Me gustaría hacer este pedido:",
    "",
    ...lineas,
    "",
    `Total: ${euros.format(importeTotal())}`,
    "",
    "¿Me confirmáis disponibilidad, talla y envío? ¡Gracias!",
  ].join("\n");
}

function pintar() {
  const unidades = totalUnidades();
  const vacio = carrito.length === 0;

  contadorEls.forEach((el) => {
    el.textContent = String(unidades);
    el.hidden = unidades === 0;
  });

  if (estadoEl) {
    estadoEl.textContent =
      unidades === 0
        ? "Cesta vacía"
        : `${unidades} ${unidades === 1 ? "pieza" : "piezas"} en la cesta`;
  }

  if (!lista) return;

  if (vacio) {
    lista.innerHTML = `
      <div class="flex h-full flex-col items-center justify-center py-16 text-center">
        <div class="text-gold/50">${iconoCometa}</div>
        <p class="mt-5 font-display text-2xl text-ink">Tu cesta está vacía</p>
        <p class="mt-2 max-w-[16rem] text-sm text-ink-soft">
          Añade alguna pieza y la guardamos aquí mientras sigues mirando.
        </p>
        <a href="/tienda" data-cart-close class="btn btn-outline mt-6 !px-6 !py-2.5 !text-[0.65rem]">
          Ver la colección
        </a>
      </div>`;
  } else {
    lista.innerHTML = carrito
      .map((item) => {
        const producto = porId.get(item.id);
        return `
        <li class="flex gap-4 border-b border-gold/12 py-4">
          <div class="relative grid h-20 w-16 shrink-0 place-items-center overflow-hidden rounded-lg ${
            colores[producto.categoria] || "bg-cream-deep/60"
          }">
            ${iconoCometa}
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="truncate font-display text-lg leading-tight text-ink">${producto.nombre}</p>
                <p class="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  ${etiquetas[producto.categoria] || ""}
                </p>
              </div>
              <button
                type="button"
                data-cart-remove="${producto.id}"
                class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-blush-soft hover:text-ink"
                aria-label="Quitar ${producto.nombre} de la cesta"
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <div class="mt-3 flex items-center justify-between gap-3">
              <div class="inline-flex items-center rounded-full border border-gold/25">
                <button
                  type="button"
                  data-cart-dec="${producto.id}"
                  class="grid h-7 w-7 place-items-center text-ink-soft transition-colors hover:text-ink disabled:opacity-30"
                  aria-label="Quitar una unidad de ${producto.nombre}"
                  ${item.cantidad <= 1 ? "disabled" : ""}
                >−</button>
                <span class="w-6 text-center text-[0.8rem] font-semibold text-ink">${item.cantidad}</span>
                <button
                  type="button"
                  data-cart-inc="${producto.id}"
                  class="grid h-7 w-7 place-items-center text-ink-soft transition-colors hover:text-ink disabled:opacity-30"
                  aria-label="Añadir una unidad de ${producto.nombre}"
                  ${item.cantidad >= MAX_UNIDADES ? "disabled" : ""}
                >+</button>
              </div>
              <span class="text-[0.85rem] font-semibold text-ink">
                ${euros.format(producto.precio * item.cantidad)}
              </span>
            </div>
          </div>
        </li>`;
      })
      .join("");
  }

  if (totalEl) totalEl.textContent = euros.format(importeTotal());
  if (vaciarBtn) vaciarBtn.hidden = vacio;

  const texto = montarMensaje();

  if (waBtn) {
    if (whatsapp && !vacio) {
      waBtn.hidden = false;
      waBtn.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`;
    } else {
      waBtn.hidden = true;
    }
  }

  if (copiarBtn) {
    // Sin número configurado, el botón principal permite copiar el pedido.
    if (!whatsapp && !vacio) {
      copiarBtn.hidden = false;
      copiarBtn.dataset.pedido = texto;
    } else {
      copiarBtn.hidden = true;
    }
  }

  if (mailBtn) {
    mailBtn.href = `mailto:${email}?subject=${encodeURIComponent(
      "Pedido desde la web",
    )}&body=${encodeURIComponent(texto)}`;
    mailBtn.hidden = vacio;
  }
}

function abrir() {
  if (!drawer || !overlay) return;
  ultimoFoco = document.activeElement;
  overlay.hidden = false;
  drawer.inert = false;
  drawer.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    overlay.classList.add("opacity-100");
    drawer.classList.remove("translate-x-full");
  });
  document.body.style.overflow = "hidden";
  document.getElementById("cart-close")?.focus();
}

function cerrar() {
  if (!drawer || !overlay) return;
  overlay.classList.remove("opacity-100");
  drawer.classList.add("translate-x-full");
  drawer.setAttribute("aria-hidden", "true");
  drawer.inert = true;
  document.body.style.overflow = "";
  setTimeout(() => {
    overlay.hidden = true;
  }, 300);
  if (ultimoFoco instanceof HTMLElement) ultimoFoco.focus();
}

function anadir(id) {
  const existente = carrito.find((item) => item.id === id);
  if (existente) {
    existente.cantidad = Math.min(MAX_UNIDADES, existente.cantidad + 1);
  } else if (porId.has(id)) {
    carrito.push({ id, cantidad: 1 });
  }
  guardar();
  abrir();
}

document.addEventListener("click", (event) => {
  const objetivo = event.target.closest(
    "[data-add-to-cart], [data-cart-open], [data-cart-close], [data-cart-remove], [data-cart-inc], [data-cart-dec], [data-cart-clear], [data-cart-copy]",
  );
  if (!objetivo) return;

  if (objetivo.matches("[data-add-to-cart]")) {
    event.preventDefault();
    anadir(objetivo.dataset.addToCart);
    return;
  }

  if (objetivo.matches("[data-cart-open]")) {
    event.preventDefault();
    abrir();
    return;
  }

  if (objetivo.matches("[data-cart-close]")) {
    if (objetivo.tagName !== "A") event.preventDefault();
    cerrar();
    return;
  }

  if (objetivo.matches("[data-cart-remove]")) {
    carrito = carrito.filter((item) => item.id !== objetivo.dataset.cartRemove);
    guardar();
    return;
  }

  if (objetivo.matches("[data-cart-inc]")) {
    const item = carrito.find((i) => i.id === objetivo.dataset.cartInc);
    if (item) item.cantidad = Math.min(MAX_UNIDADES, item.cantidad + 1);
    guardar();
    return;
  }

  if (objetivo.matches("[data-cart-dec]")) {
    const item = carrito.find((i) => i.id === objetivo.dataset.cartDec);
    if (item && item.cantidad > 1) item.cantidad -= 1;
    guardar();
    return;
  }

  if (objetivo.matches("[data-cart-clear]")) {
    if (window.confirm("¿Vaciar la cesta?")) {
      carrito = [];
      guardar();
    }
    return;
  }

  if (objetivo.matches("[data-cart-copy]")) {
    const pedido = objetivo.dataset.pedido || montarMensaje();
    navigator.clipboard
      ?.writeText(pedido)
      .then(() => {
        if (mensaje) mensaje.textContent = "Pedido copiado. Pégalo donde quieras.";
      })
      .catch(() => {
        if (mensaje) mensaje.textContent = "No se pudo copiar. Prueba con el correo.";
      });
  }
});

document.addEventListener("keydown", (event) => {
  if (!drawer || drawer.getAttribute("aria-hidden") === "true") return;

  if (event.key === "Escape") {
    cerrar();
    return;
  }

  if (event.key === "Tab") {
    const enfocables = drawer.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    );
    if (!enfocables.length) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];

    if (event.shiftKey && document.activeElement === primero) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primero.focus();
    }
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    carrito = leer();
    pintar();
  }
});

// Sincroniza el aviso de precios con la configuración del sitio.
if (preciosProvisionales) {
  document.querySelectorAll("[data-aviso-precios]").forEach((el) => {
    el.hidden = false;
  });
}

pintar();
