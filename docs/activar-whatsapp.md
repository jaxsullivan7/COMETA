# Activar el pedido por WhatsApp

Todo el flujo está implementado y probado. Solo falta el número real de Vanessa.
En cuanto lo tengamos, la activación es un cambio de una línea.

## 1. Poner el número

Edita `src/data/site.ts` y escribe el número dentro de `normalizarWhatsapp`:

```ts
export const enlaces = {
  // ...
  whatsapp: normalizarWhatsapp("+34 600 123 456"),
};
```

Se puede pegar tal cual desde la agenda de WhatsApp. El proyecto limpia
espacios, guiones, paréntesis y el prefijo `00`:

| Pegado | Se convierte en |
| --- | --- |
| `+34 600 123 456` | `34600123456` |
| `0034 600 123 456` | `34600123456` |
| `600 123 456` | `600123456` (sin prefijo de país, revisar) |

Importante: debe llevar **prefijo de país** (`34` para España). Sin él, wa.me no
sabe a qué país enviar el mensaje.

## 2. Comprobar en local

```powershell
npm run build
npm run preview -- --host 0.0.0.0 --port 4322
```

En la cesta:

1. Añade una pieza y pulsa **Continuar con el pedido**.
2. Rellena nombre y teléfono, acepta la privacidad.
3. El botón principal debe decir **Enviar pedido por WhatsApp**.
4. Al pulsarlo se abre WhatsApp con el mensaje ya escrito.

El mensaje incluye las piezas, el total, el nombre, el teléfono, el correo, las
notas y la petición de confirmar talla, envío y forma de pago.

## 3. Publicar

```powershell
git add .
git commit -m "feat(COM-18): activar pedido por WhatsApp"
git push
```

Vercel reconstruye solo. Cuando termine, prueba el pedido completo desde el
móvil, no solo en el ordenador.

## Qué cambia automáticamente

- Aparece el botón **Enviar pedido por WhatsApp** en el paso de datos.
- Desaparece **Copiar pedido**, que es el sustituto mientras no hay número.
- **Enviar por correo** sigue disponible como alternativa.
- El número queda visible en el HTML de la web (es inevitable: el navegador
  necesita construir el enlace `wa.me`).

## Si algo falla

- **No se abre WhatsApp**: revisa que el número tenga prefijo de país y que la
  cuenta exista. Prueba el enlace `https://wa.me/NUMERO` en el móvil.
- **El botón sigue en “Copiar pedido”**: el número está vacío o el despliegue no
  ha terminado; comprueba `data-whatsapp` en el código fuente de la página.
- **El mensaje llega incompleto**: revisa que los campos del formulario se hayan
  validado antes de enviar.
