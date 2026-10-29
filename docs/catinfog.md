# Integración con Catinfog

**Estado:** pendiente del CSV de exportación del catálogo.

Catinfog es el TPV de la tienda: gestiona productos, tallas, stock, ventas y
clientes. La web de COMETA es independiente, así que hay que decidir cómo se
hablan.

## Lo que ofrece Catinfog

- TPV, almacén y tienda online (OpenCart) sincronizados en tiempo real.
- Exportación e importación de **productos, clientes, ventas y devoluciones**
  mediante CSV.
- No hay una **API pública documentada** ni webhooks. Conviene preguntar a
  soporte si pueden facilitar acceso técnico.

## Estrategia elegida

1. **Ahora:** importar el catálogo por CSV. Mantenemos el diseño y el carrito
   actuales, y la web pasa a mostrar productos, precios y tallas reales.
2. **En paralelo:** preguntar a Catinfog por API, webhooks o acceso a OpenCart.
   Si lo facilitan, se migra a sincronización automática sin rehacer la web.

Mientras no haya API, el stock será una foto del momento: se actualiza al
repetir la exportación. Los pedidos siguen saliendo por WhatsApp o correo y se
registran a mano en el TPV.

## Cómo exportar el catálogo

En el panel de Catinfog:

1. **Configuración → Importar y exportar datos → Productos**.
2. Pulsa **Exportar productos** y espera el aviso verde.
3. Pulsa **Descargar archivo**.

El CSV viene separado por comas y **una línea por talla**: el mismo producto
aparece repetido si tiene varias tallas.

## Columnas que nos interesan

| Columna Catinfog | Uso en la web |
| --- | --- |
| `model` | Referencia única del producto (agrupa las tallas) |
| `name` | Nombre visible |
| `description` | Descripción (admite HTML) |
| `price` | Precio con IVA |
| `offer price` | Precio rebajado, si existe |
| `category` | Categoría (`///` para subcategorías, `:::` para varias) |
| `total stock` | Stock total del producto |
| `option name` | Tipo de variante (Talla, Color…) |
| `option - value` | Valor de la variante (XS, 2 años…) |
| `option stock` | Stock de esa variante |
| `status` | 1 activo, 0 oculto |
| `image` | Nombres de archivo de las fotos (`:::` si hay varias) |
| `seo url` | URL amigable, si se quiere reutilizar |

## Qué hará el importador

Un script `scripts/import-catinfog.mjs` que:

1. Lea el CSV exportado (detectando coma o punto y coma).
2. Agrupe las filas por `model` para reconstruir el producto y sus tallas.
3. Normalice precios, categorías y estado.
4. Genere `src/data/catalogo.json` con productos, variantes y stock.
5. Aviso de productos sin imagen o sin precio antes de publicar.

La web leerá ese JSON en lugar de los datos de ejemplo. Las fotos se subirán a
`public/productos/` con el nombre de archivo que indique el CSV.

## Flujo de actualización

```powershell
# 1. Vanessa exporta el CSV desde Catinfog
# 2. Se coloca en la carpeta del proyecto
npm run sync:catinfog "C:\ruta\productos.csv"
npm run build
npm run preview
# 3. Revisar y publicar
git add . && git commit -m "chore: actualizar catalogo desde Catinfog" && git push
```

## Pendiente de Catinfog

- ¿Existe API o webhooks para productos y stock?
- ¿Se pueden importar pedidos por CSV, además de exportarlos?
- ¿La tienda OpenCart permite acceso a su API de administración?

## Criterios de aceptación

- [ ] El catálogo real sustituye a los 8 productos de ejemplo.
- [ ] Cada producto conserva sus tallas y su stock.
- [ ] Los productos con `status = 0` no se publican.
- [ ] Las fotos cargan desde `public/productos/`.
- [ ] El importador avisa de filas incompletas o repetidas.
