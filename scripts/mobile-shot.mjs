/**
 * Capturas de control en tamaño móvil (390 × 844, DPR 2).
 * Uso: node scripts/mobile-shot.mjs [baseUrl]
 * Requiere Chrome instalado y el servidor de preview levantado.
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const base = process.argv[2] || "http://127.0.0.1:4322";
const outDir = process.env.SHOT_DIR || "C:\\Users\\jeanm\\AppData\\Local\\Temp\\opencode\\mobile-shots";
const chrome =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--hide-scrollbars", "--force-device-scale-factor=2"],
});

const page = await browser.newPage();
await page.setViewport({
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "reduce" },
]);

async function go(path) {
  await page.goto(base + path, { waitUntil: "networkidle0" });
  await page.evaluate(() =>
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("is-visible")),
  );
}

async function shot(name, { full = false } = {}) {
  await page.screenshot({ path: join(outDir, name + ".png"), fullPage: full });
  console.log("·", name);
}

await go("/");
await shot("01-home-top");
await page.evaluate(() => window.scrollTo(0, 760));
await shot("02-home-categorias");
await page.evaluate(() => window.scrollTo(0, 1420));
await shot("03-home-productos");
await page.evaluate(() => window.scrollTo(0, 2600));
await shot("04-home-historia");
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await shot("05-home-footer");

await page.evaluate(() =>
  window.scrollTo(0, document.body.scrollHeight),
);

await go("/tienda");
await shot("06-tienda-top");
await page.evaluate(() => window.scrollTo(0, 520));
await shot("07-tienda-grid");

await go("/contacto");
await shot("08-contacto");

await go("/nosotras");
await shot("09-nosotras");

await go("/");
await page.evaluate(() => {
  localStorage.setItem(
    "cometa:cesta:v1",
    JSON.stringify([
      { id: "pelele-nube", cantidad: 2 },
      { id: "vestido-margarita", cantidad: 1 },
    ]),
  );
  localStorage.setItem(
    "cometa:datos:v1",
    JSON.stringify({
      nombre: "Ana García",
      telefono: "612 345 678",
      email: "ana@correo.com",
      notas: "Talla 12-18 meses",
    }),
  );
  location.reload();
});
await page.waitForNetworkIdle();
await page.evaluate(() =>
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("is-visible")),
);
await page.evaluate(() => document.querySelector("[data-cart-open]").click());
await new Promise((r) => setTimeout(r, 600));
await shot("10-cesta");

await page.evaluate(() => document.getElementById("cart-continue").click());
await new Promise((r) => setTimeout(r, 400));
await shot("11-datos-pedido");

await browser.close();
console.log("Listo:", outDir);
