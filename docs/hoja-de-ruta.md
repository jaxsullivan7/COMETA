# Hoja de ruta y gestión del proyecto

## Flujo de trabajo

Cada bloque de trabajo se refleja en Jira (proyecto `COM`) y en GitHub
(`jaxsullivan7/COMETA`). La idea es que el tablero cuente la historia del
proyecto sin tener que reconstruirla después.

- **Épicas** por área: Diseño, Catálogo, Carrito, Checkout, Legal, Infra.
- **Historias** por entrega funcional, con criterios de aceptación.
- **Tareas** técnicas dentro de cada historia.
- Los commits incluyen la clave del issue: `COM-12: maquetar la portada`.
- Al cerrar una sesión de trabajo se actualiza el issue con un comentario breve:
  qué se hizo, qué queda y cualquier decisión tomada.

## Fases

| Fase | Contenido | Estado |
| --- | --- | --- |
| 0 | Entorno, Node portable, repositorio y despliegue de prueba | En curso |
| 1 | Sistema de diseño y componentes base | Hecho |
| 2 | Portada, tienda por categorías, historia y contacto | Hecho |
| 3 | Contenido real: fotos, tallas, precios y textos | Pendiente |
| 4 | Carrito y checkout por WhatsApp | Pendiente |
| 5 | Newsletter y formulario conectados | Pendiente |
| 6 | Legal definitivo, dominio y analítica | Pendiente |

## Criterios de aceptación de la fase 2

- Navegación completa entre portada, tienda, categorías, historia y contacto.
- Diseño responsive verificado a 360, 768 y 1440 px.
- Sin errores de consola ni enlaces rotos.
- `npm run build` genera el sitio sin advertencias críticas.
- Metadatos y Open Graph presentes en todas las páginas.

## Convenciones

- Ramas: `feat/…`, `fix/…`, `docs/…`.
- Un pull request por historia de Jira, con captura si hay cambio visual.
- Versionado del sitio por hitos, no por número de commits.
