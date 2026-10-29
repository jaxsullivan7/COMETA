/**
 * Siembra el backlog inicial de COMETA en Jira.
 *
 * Uso:
 *   $env:JIRA_BASE_URL="https://jaxsullivan7.atlassian.net"
 *   $env:JIRA_EMAIL="..."
 *   $env:JIRA_TOKEN="..."
 *   node scripts/jira-seed.mjs
 *
 * Es idempotente: si una historia ya existe (misma suma), no la duplica.
 */

const BASE = process.env.JIRA_BASE_URL;
const EMAIL = process.env.JIRA_EMAIL;
const TOKEN = process.env.JIRA_TOKEN;
const PROJECT = process.env.JIRA_PROJECT || "COM";

if (!BASE || !EMAIL || !TOKEN) {
  console.error("Faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_TOKEN.");
  process.exit(1);
}

const auth = Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");

async function api(path, options = {}) {
  const res = await fetch(`${BASE}/rest/api/3${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  return data;
}

function doc(paragraphs) {
  return {
    type: "doc",
    version: 1,
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  };
}

const epicas = [
  {
    key: "diseno",
    summary: "Diseño y experiencia",
    text: "Sistema visual, portada, navegación y páginas de marca. Todo el trabajo derivado de la cartelera original de COMETA.",
  },
  {
    key: "catalogo",
    summary: "Catálogo y contenidos",
    text: "Fotos, textos, tallas y precios reales de la primera colección, además de la guía de tallas.",
  },
  {
    key: "compra",
    summary: "Compra y pedidos",
    text: "Carrito, checkout por WhatsApp y captación de correos para la apertura.",
  },
  {
    key: "infra",
    summary: "Infraestructura y despliegue",
    text: "Repositorio, build, hosting, dominio y analítica del sitio.",
  },
  {
    key: "legal",
    summary: "Legal y confianza",
    text: "Aviso legal, privacidad, cookies y condiciones de venta conforme a la normativa española.",
  },
];

const historias = [
  {
    epica: "infra",
    summary: "Configurar Astro, Tailwind y entorno local",
    status: "Done",
    labels: ["fase-1", "infra"],
    text: "Proyecto Astro 7 con Tailwind 4, TypeScript, fuentes autoalojadas y Node portable en .tools. Scripts de dev, build y check funcionando.",
    criterios: [
      "npm run build genera las 11 rutas sin errores.",
      "npm run check termina sin diagnósticos.",
      "El proyecto arranca en local sin dependencias globales.",
    ],
  },
  {
    epica: "diseno",
    summary: "Definir el sistema de diseño a partir de la cartelera",
    status: "Done",
    labels: ["fase-1", "diseno"],
    text: "Paleta crema, dorado, rosa empolvado y salvia; tipografías Cormorant Garamond, Great Vibes y Nunito Sans; componentes base y documentación en docs/diseno.md.",
    criterios: [
      "Tokens de color y tipografía centralizados.",
      "Botones, tarjetas, etiquetas y enlaces con estados hover y focus.",
      "Contraste AA en texto principal.",
    ],
  },
  {
    epica: "diseno",
    summary: "Maquetar la portada",
    status: "Done",
    labels: ["fase-2", "portada"],
    text: "Hero con ilustración premamá, tres categorías, productos destacados, historia de marca, valores y newsletter.",
    criterios: [
      "Diseño responsive verificado en móvil, tablet y escritorio.",
      "Animaciones de entrada respetan prefers-reduced-motion.",
      "Sin enlaces rotos ni errores de consola.",
    ],
  },
  {
    epica: "diseno",
    summary: "Tienda con filtros por categoría",
    status: "Done",
    labels: ["fase-2", "tienda"],
    text: "Rutas /tienda, /tienda/premama, /tienda/bebes y /tienda/ninos generadas de forma estática con tarjetas de producto provisionales.",
    criterios: [
      "Cada categoría muestra solo sus productos.",
      "Filtros accesibles con aria-current.",
      "Estado vacío y aviso de fotos pendientes.",
    ],
  },
  {
    epica: "diseno",
    summary: "Páginas de historia, contacto y legales",
    status: "Done",
    labels: ["fase-2", "contenido"],
    text: "Historia de la marca, formulario de contacto con FAQ y borradores de aviso legal, privacidad y cookies.",
    criterios: [
      "Navegación coherente con el resto del sitio.",
      "Formulario valida campos y ofrece alternativa por correo.",
      "Textos legales marcados como borrador.",
    ],
  },
  {
    epica: "catalogo",
    summary: "Recopilar fotos, tallas y precios reales",
    status: "To Do",
    labels: ["fase-3", "contenido"],
    text: "Sustituir los placeholders por material real de la primera colección.",
    criterios: [
      "Fotos en proporción 4:5 con fondo neutro.",
      "Cada producto tiene nombre, descripción, composición, tallas y precio.",
      "La guía de tallas está publicada.",
    ],
  },
  {
    epica: "compra",
    summary: "Implementar carrito con persistencia local",
    status: "To Do",
    labels: ["fase-4", "carrito"],
    text: "Carrito funcional en cliente con almacenamiento local, sin pasarela de pago todavía.",
    criterios: [
      "Añadir, quitar y cambiar cantidades.",
      "El contenido persiste al recargar.",
      "Total y resumen claros antes de finalizar.",
    ],
  },
  {
    epica: "compra",
    summary: "Diseñar el checkout por WhatsApp",
    status: "To Do",
    labels: ["fase-4", "checkout"],
    text: "Generar un mensaje de pedido con referencias, tallas y total para enviarlo por WhatsApp a la tienda.",
    criterios: [
      "Mensaje legible y completo.",
      "Funciona en móvil y escritorio.",
      "Texto editable antes de enviar.",
    ],
  },
  {
    epica: "infra",
    summary: "Publicar en Vercel y conectar el dominio",
    status: "To Do",
    labels: ["fase-6", "despliegue"],
    text: "Despliegue continuo desde GitHub y configuración del dominio definitivo cuando esté disponible.",
    criterios: [
      "Cada push a main genera una vista previa.",
      "Producción sirve el dominio con HTTPS.",
      "Robots.txt y sitemap apuntan al dominio final.",
    ],
  },
  {
    epica: "compra",
    summary: "Conectar la newsletter a un proveedor",
    status: "To Do",
    labels: ["fase-5", "email"],
    text: "Sustituir la confirmación local por un alta real con doble opt-in.",
    criterios: [
      "Alta verificada por correo.",
      "Aviso de privacidad enlazado.",
      "Baja disponible en cada envío.",
    ],
  },
];

async function main() {
  const existing = await api(
    `/search/jql?jql=${encodeURIComponent(`project = ${PROJECT} ORDER BY created ASC`)}&maxResults=100&fields=summary,status`,
  );

  const porSumario = new Map(
    (existing.issues || []).map((issue) => [issue.fields.summary, issue]),
  );

  console.log(`Issues existentes: ${porSumario.size}`);

  const clavesEpicas = new Map();
  for (const epica of epicas) {
    if (porSumario.has(epica.summary)) {
      clavesEpicas.set(epica.key, porSumario.get(epica.summary).key);
      console.log(`= ${epica.summary}: ${clavesEpicas.get(epica.key)}`);
      continue;
    }

    const issue = await api("/issue", {
      method: "POST",
      body: JSON.stringify({
        fields: {
          project: { key: PROJECT },
          issuetype: { name: "Epic" },
          summary: epica.summary,
          description: doc([epica.text]),
          labels: ["cometa", "web"],
        },
      }),
    });

    clavesEpicas.set(epica.key, issue.key);
    console.log(`+ ${epica.summary}: ${issue.key}`);
  }

  for (const historia of historias) {
    if (porSumario.has(historia.summary)) {
      console.log(`= ${historia.summary}: ${porSumario.get(historia.summary).key}`);
      continue;
    }

    const descripcion = doc([
      historia.text,
      "Criterios de aceptación:",
      ...historia.criterios.map((c) => `— ${c}`),
    ]);

    const issue = await api("/issue", {
      method: "POST",
      body: JSON.stringify({
        fields: {
          project: { key: PROJECT },
          issuetype: { name: "Story" },
          parent: { key: clavesEpicas.get(historia.epica) },
          summary: historia.summary,
          description: descripcion,
          labels: ["cometa", ...historia.labels],
        },
      }),
    });

    console.log(`+ ${historia.summary}: ${issue.key}`);

    if (historia.status === "Done") {
      const { transitions } = await api(`/issue/${issue.key}/transitions`);
      const done = transitions.find((t) => t.name === "Done");
      if (done) {
        await api(`/issue/${issue.key}/transitions`, {
          method: "POST",
          body: JSON.stringify({ transition: { id: done.id } }),
        });
        console.log(`  → ${issue.key} marcada como Done`);
      }
    }
  }

  console.log("\nBacklog listo.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
