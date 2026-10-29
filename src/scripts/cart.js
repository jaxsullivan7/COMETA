/**
 * Cesta de COMETA.
 * Estado en localStorage, sin backend. El pedido se envía por WhatsApp si hay
 * número configurado en src/data/site.ts; si no, se copia o se manda por correo.
 */

const STORAGE_KEY = "cometa:cesta:v1";
const DATOS_KEY = "cometa:datos:v1";
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
const titulo = document.getElementById("cart-title");
const estadoEl = document.getElementById("cart-status");
const vistaCesta = document.getElementById("cart-view");
const vistaDatos = document.getElementById("checkout-view");
const accionesCesta = document.getElementById("cart-actions");
const accionesDatos = document.getElementById("checkout-actions");
const continuarBtn = document.getElementById("cart-continue");
const vaciarBtn = document.querySelector("[data-cart-clear]");
const formulario = document.getElementById("checkout-form");
const enviarBtn = document.getElementById("checkout-submit");
const mailBtn = document.querySelector("[data-cart-mail]");
const pista = document.getElementById("checkout-hint");
const mensaje = document.getElementById("cart-msg");

let carrito = leer();
let datos = leerDatos();
let vista = "cesta";
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

function leerDatos() {
  try {
    const guardado = JSON.parse(localStorage.getItem(DATOS_KEY) || "{}");
    return {
      nombre: typeof guardado.nombre === "string" ? guardado.nombre : "",
      telefono: typeof guardado.telefono === "string" ? guardado.telefono : "",
      email: typeof guardado.email === "string" ? guardado.email : "",
      notas: typeof guardado.notas === "string" ? guardado.notas : "",
    };
  } catch {
    return { nombre: "", telefono: "", email: "", notas: "" };
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

function datosFormulario() {
  if (!formulario) return datos;
  const formData = new FormData(formulario);
  return {
    nombre: String(formData.get("nombre") || "").trim(),
    telefono: String(formData.get("telefono") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    notas: String(formData.get("notas") || "").trim(),
  };
}

function montarMensaje() {
  const lineas = carrito.map((item) => {
    const producto = porId.get(item.id);
    return `• ${item.cantidad} × ${producto.nombre} — ${euros.format(
      producto.precio * item.cantidad,
    )}`;
  });

  const firma = [
    `Soy ${datos.nombre || "[nombre]"}`,
    datos.telefono ? `Teléfono: ${datos.telefono}` : "",
    datos.email ? `Correo: ${datos.email}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return [
    "¡Hola COMETA! Me gustaría hacer este pedido:",
    "",
    ...lineas,
    "",
    `Total: ${euros.format(importeTotal())}`,
    "",
    firma,
    datos.notas ? "" : null,
    datos.notas ? `Notas: ${datos.notas}` : null,
    "",
    "¿Me confirmáis talla, envío y forma de pago? ¡Gracias!",
  ]
    .filter((linea) => linea !== null)
    .join("\n");
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

  if (totalEl) totalEl.textContent = euros.format(importeTotal());

  const resumen = document.getElementById("checkout-summary");
  if (resumen) {
    resumen.innerHTML = `
      <ul class="space-y-1.5 text-[0.78rem] text-ink-soft">
        ${carrito
          .map((item) => {
            const producto = porId.get(item.id);
            return `<li class="flex justify-between gap-3">
              <span class="truncate">${item.cantidad} × ${producto.nombre}</span>
              <span class="shrink-0 font-semibold text-ink">${euros.format(
                producto.precio * item.cantidad,
              )}</span>
            </li>`;
          })
          .join("")}
      </ul>`;
  }

  if (lista) {
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
  }

  if (vaciarBtn) vaciarBtn.hidden = vacio;
  if (continuarBtn) continuarBtn.hidden = vacio;
  if (vacio && vista === "datos") mostrarVista("cesta");

  if (enviarBtn) {
    enviarBtn.textContent = whatsapp
      ? "Enviar pedido por WhatsApp"
      : "Copiar pedido";
  }

  if (pista) pista.hidden = Boolean(whatsapp) || vacio;

  actualizarCorreo();
}

function actualizarCorreo() {
  if (!mailBtn) return;
  const texto = montarMensaje();
  mailBtn.href = `mailto:${email}?subject=${encodeURIComponent(
    "Pedido desde la web",
  )}&body=${encodeURIComponent(texto)}`;
}

function mostrarVista(nueva) {
  vista = nueva;
  const enDatos = nueva === "datos";
  if (mensaje) mensaje.textContent = "";

  if (vistaCesta) vistaCesta.hidden = enDatos;
  if (vistaDatos) vistaDatos.hidden = !enDatos;
  if (accionesCesta) accionesCesta.hidden = enDatos || carrito.length === 0;
  if (accionesDatos) accionesDatos.hidden = !enDatos;
  if (titulo) titulo.textContent = enDatos ? "Datos del pedido" : "La cesta";

  if (enDatos) {
    document.getElementById("ck-nombre")?.focus();
  } else if (carrito.length > 0) {
    continuarBtn?.focus();
  }
}

function setError(campo, texto) {
  const el = document.querySelector(`[data-error="${campo}"]`);
  const input = formulario?.querySelector(`[name="${campo}"]`);
  if (el) {
    el.textContent = texto;
    el.hidden = !texto;
  }
  if (input) {
    input.setAttribute("aria-invalid", texto ? "true" : "false");
  }
  return !texto;
}

function validar() {
  const actuales = datosFormulario();
  const telefono = actuales.telefono.replace(/[^\d+]/g, "");

  let ok = true;
  ok = setError("nombre", actuales.nombre.length < 2 ? "Escribe tu nombre." : "") && ok;
  ok =
    setError(
      "telefono",
      /^\+?\d{9,15}$/.test(telefono) ? "" : "Revisa el teléfono (9 dígitos como mínimo).",
    ) && ok;
  ok =
    setError(
      "email",
      !actuales.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(actuales.email)
        ? ""
        : "Revisa el correo.",
    ) && ok;

  const privacidad = formulario?.querySelector('[name="privacidad"]');
  ok =
    setError(
      "privacidad",
      privacidad?.checked ? "" : "Necesitamos tu consentimiento.",
    ) && ok;

  if (ok) {
    datos = actuales;
    localStorage.setItem(DATOS_KEY, JSON.stringify(datos));
  }

  return ok;
}

function copiarPedido() {
  const texto = montarMensaje();
  const aviso = "Pedido copiado. Pégalo en el correo o en WhatsApp.";

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        if (mensaje) mensaje.textContent = aviso;
      })
      .catch(copiarClasico);
  } else {
    copiarClasico();
  }

  function copiarClasico() {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      if (mensaje) mensaje.textContent = aviso;
    } catch {
      if (mensaje) mensaje.textContent = "No se pudo copiar. Usa el correo.";
    }
    area.remove();
  }
}

function abrir() {
  if (!drawer || !overlay) return;
  ultimoFoco = document.activeElement;
  mostrarVista("cesta");
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
    "[data-add-to-cart], [data-cart-open], [data-cart-close], [data-cart-remove], [data-cart-inc], [data-cart-dec], [data-cart-clear], [data-checkout-back], [data-cart-mail]",
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

  if (objetivo.matches("[data-checkout-back]")) {
    event.preventDefault();
    mostrarVista("cesta");
    return;
  }

  if (objetivo.matches("[data-cart-mail]")) {
    if (!validar()) {
      event.preventDefault();
      if (mensaje) mensaje.textContent = "Revisa los datos marcados.";
      return;
    }
    datos = datosFormulario();
    localStorage.setItem(DATOS_KEY, JSON.stringify(datos));
    actualizarCorreo();
  }
});

formulario?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validar()) {
    if (mensaje) mensaje.textContent = "Revisa los datos marcados.";
    return;
  }

  const texto = montarMensaje();

  if (whatsapp) {
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`;
    const ventana = window.open(url, "_blank", "noopener,noreferrer");
    if (!ventana) window.location.href = url;
    if (mensaje) mensaje.textContent = "Abriendo WhatsApp con tu pedido…";
  } else {
    copiarPedido();
  }

  actualizarCorreo();
});

continuarBtn?.addEventListener("click", () => {
  if (carrito.length === 0) return;
  mostrarVista("datos");
});

formulario?.addEventListener("input", (event) => {
  const campo = event.target?.name;
  if (campo) {
    const error = document.querySelector(`[data-error="${campo}"]`);
    if (error) error.hidden = true;
    event.target.removeAttribute("aria-invalid");
  }
  datos = datosFormulario();
  localStorage.setItem(DATOS_KEY, JSON.stringify(datos));
  actualizarCorreo();
});

document.addEventListener("keydown", (event) => {
  if (!drawer || drawer.getAttribute("aria-hidden") === "true") return;

  if (event.key === "Escape") {
    cerrar();
    return;
  }

  if (event.key === "Tab") {
    const enfocables = drawer.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
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

if (preciosProvisionales) {
  document.querySelectorAll("[data-aviso-precios]").forEach((el) => {
    el.hidden = false;
  });
}

// Restaura los datos del pedido anterior, si los hay.
if (formulario) {
  formulario.querySelector('[name="nombre"]').value = datos.nombre;
  formulario.querySelector('[name="telefono"]').value = datos.telefono;
  formulario.querySelector('[name="email"]').value = datos.email;
  formulario.querySelector('[name="notas"]').value = datos.notas;
}

mostrarVista("cesta");
pintar();
