# Sistema de diseño · COMETA

Extraído de la cartelera original: acuarela, dorado cálido, rosa empolvado y
salvia sobre crema. La sensación buscada es **artesanal, luminosa y serena**,
nunca infantil en exceso ni recargada.

## Paleta

| Token | Hex | Uso |
| --- | --- | --- |
| `cream` | `#FCF8F1` | Fondo principal |
| `cream-soft` | `#FEFBF6` | Tarjetas y superficies elevadas |
| `cream-deep` | `#F4EBDD` | Secciones alternas |
| `gold` | `#C39A5C` | Marca, botones, detalles |
| `gold-soft` | `#E2C99F` | Halos y degradados |
| `gold-deep` | `#9A723D` | Texto sobre crema, enlaces |
| `blush` | `#E9A6AF` | Acento emocional, categoría premamá |
| `blush-soft` | `#F8E4E7` | Fondos suaves, hover |
| `sage` | `#8D9C7B` | Acento natural, categoría niños |
| `sage-soft` | `#E5E9DD` | Fondos suaves |
| `ink` | `#42301F` | Titulares y texto principal |
| `ink-soft` | `#6B5440` | Cuerpo de texto |
| `ink-muted` | `#9A8571` | Metadatos y etiquetas |

Contraste: `ink` sobre `cream` supera AA en texto normal. Los textos pequeños en
`gold-deep` solo se usan con tamaño ≥ 12 px y peso 600.

## Tipografía

- **Cormorant Garamond** — titulares, precios y citas. Pesos 400, 500, 600 e
  itálicas.
- **Great Vibes** — acentos caligráficos (`Cometa`, `historia`, `crece`). Nunca
  para párrafos.
- **Nunito Sans** — cuerpo, navegación y botones. Pesos 400, 600 y 700.

Escala aproximada: h1 56–70 px, h2 40–48 px, h3 24–28 px, cuerpo 15–16 px y
etiquetas 10–12 px con tracking amplio (0,18–0,28 em).

## Componentes

- `Header` — barra de anuncio, navegación de tres columnas en escritorio y menú
  a pantalla completa en móvil.
- `Footer` — marca, tienda, ayuda y legal.
- `ProductCard` — placeholder de producto con cometa lineal y etiqueta
  «Foto próximamente».
- `TiendaView` — cabecera de categoría, filtros y rejilla.
- `Kite` / `Star` — ilustraciones SVG de línea para decoración.
- Botones: `.btn-primary` (dorado), `.btn-outline` (contorno) y `.link-soft`
  (enlace con subrayado animado).
- Animación `.reveal` al hacer scroll, desactivada con
  `prefers-reduced-motion`.

## Imágenes

- La cartelera (`public/brand/cartelera.jpg`) es la referencia de marca.
- Los recortes (`cat-*.png`, `hero-premama.png`) conservan el fondo crema
  original y se integran con `mix-blend-multiply` sobre fondos tintados.
- Cuando lleguen fotos reales: proporción 4:5, luz natural, fondo neutro y una
  sola modelo por imagen. Se optimizarán con `astro:assets`.

## Reglas de estilo

1. Mucho aire: secciones de 80–112 px de padding vertical.
2. Un solo acento caligráfico por titular.
3. Bordes redondeados amplios (20–32 px) y sombras muy suaves.
4. Líneas doradas de 1 px como separadores, nunca cajas duras.
5. Nada de emojis en la interfaz; los iconos son SVG de línea.

## Móvil

- Punto de partida de 390 × 844 y rejilla de 2 columnas desde 360 px.
- Barra inferior fija de 68 px con iconos de 20 px y etiquetas de 8,8 px.
- Cabecera de 56 px con menú, logotipo y cesta.
- Carrusel de categorías al 78 % del ancho para dejar ver la siguiente.
- Botones táctiles de 44 px mínimo; los campos de texto nunca bajan de 16 px.
- `env(safe-area-inset-bottom)` en la barra y en el pie de la cesta.
- Las secciones reducen su padding vertical a 56–80 px antes de `lg`.

