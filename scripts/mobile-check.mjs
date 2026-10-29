import puppeteer from "puppeteer-core";
const base = process.argv[2] || "http://127.0.0.1:4322";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

for (const path of ["/", "/tienda", "/tienda/bebes", "/nosotras", "/contacto", "/legal/privacidad"]) {
  await page.goto(base + path, { waitUntil: "networkidle0" });
  const data = await page.evaluate(() => {
    const vw = innerWidth;
    const overflow = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width > 0 && (r.right > vw + 1) && cs.position !== "fixed" && !el.closest(".no-scrollbar")) {
        overflow.push({ tag: el.tagName, cls: String(el.className).slice(0, 60), right: Math.round(r.right) });
      }
    });
    return { vw, scrollW: document.documentElement.scrollWidth, overflow: overflow.slice(0, 5) };
  });
  console.log(path, JSON.stringify(data));
}

// Menú móvil
await page.goto(base + "/", { waitUntil: "networkidle0" });
await page.click("#menu-toggle");
await new Promise((r) => setTimeout(r, 400));
console.log(
  "menu:",
  await page.evaluate(() => ({
    hidden: document.getElementById("mobile-menu").hidden,
    expanded: document.getElementById("menu-toggle").getAttribute("aria-expanded"),
    overflow: document.body.style.overflow,
  })),
);
await page.screenshot({ path: "C:\\Users\\jeanm\\AppData\\Local\\Temp\\opencode\\mobile-shots\\12-menu.png" });
await page.click("#menu-close");
await new Promise((r) => setTimeout(r, 400));

// Badge de la barra inferior
await page.evaluate(() => {
  localStorage.setItem("cometa:cesta:v1", JSON.stringify([{ id: "pelele-nube", cantidad: 2 }]));
  location.reload();
});
await page.waitForNetworkIdle();
const badges = await page.evaluate(() =>
  [...document.querySelectorAll("[data-cart-count]")].map((el) => ({
    text: el.textContent,
    hidden: el.hidden,
    nav: Boolean(el.closest("nav")),
  })),
);
console.log("badges:", JSON.stringify(badges));
await page.screenshot({ path: "C:\\Users\\jeanm\\AppData\\Local\\Temp\\opencode\\mobile-shots\\13-badge.png" });

await browser.close();
