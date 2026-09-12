# Runbook — Formulario Universales

Contexto rápido para quien tenga que revisar o arreglar esto en caliente (ej. durante el evento).

## Arquitectura

```
QR (impreso) → https://5-productos-estrella-universales.vercel.app/
                          │
                          │ (Vercel redeploya solo con cada push a GitHub)
                          │
              github.com/eduardopardo0813-ux/5-Productos-Estrella-UNIVERSALES
                          │
                index.html (formulario + imagen resultado)
                          │
                          │ POST (fetch, con cola de reintento en localStorage)
                          ▼
        Google Apps Script Web App (doPost) — vive en el Sheet maestro
                          │
                          ▼
        Sheet maestro (privado, solo el dueño tiene acceso de edición)
                          │
                          │ cada 10 min, vía trigger de tiempo (Sincronizar.gs)
                          ▼
        Sheet cliente (compartida con la bodega en modo "Lector")
```

## Dónde está cada cosa

- **Repo / código del sitio**: `github.com/eduardopardo0813-ux/5-Productos-Estrella-UNIVERSALES`
- **Sitio en vivo**: `https://5-productos-estrella-universales.vercel.app/`
- **Backend de datos**: Apps Script bound al Sheet maestro (`Code.gs` = recibe el formulario, `Sincronizar.gs` = copia hacia el Sheet del cliente)
- **Sheet maestro**: el original donde escribe el formulario (ID: `1woaKQBzOh8738sp8PWjpFhIoT8HtPsN9BHAwsDOcPtI` es el del Sheet **cliente**, no el maestro)
- **QR impreso**: apunta a la URL de Vercel de arriba. Si esa URL cambia, el QR impreso queda inválido.

## Si el sitio no carga (lo más urgente)

1. Revisar `github.com/.../commits/main` — ¿el último commit se ve sospechoso?
2. En Vercel (dashboard del proyecto) revisar la pestaña "Deployments": si el último deploy dice "Failed", ese es el problema.
3. Arreglo rápido: `git revert <commit-malo>` y push — Vercel redeploya solo en ~1 minuto. O simplemente corregir el archivo y volver a pushear.
4. Quien haga esto necesita acceso de **escritura al repo de GitHub** (agregado como Collaborator, o un token con permiso sobre ese repo). No necesita acceso a Vercel.

## Si no están llegando datos al Sheet

1. Confirmar que el formulario sigue mostrando la imagen igual (debería, por diseño) — si el usuario ve su imagen, no hay urgencia, los datos están en cola en su celular y van a reintentar solos.
2. Revisar en Apps Script (del Sheet maestro) → **Ejecuciones** si hay errores recientes en `doPost`.
3. Si se editó el código y se hizo "Nueva implementación" en vez de "Nueva versión" sobre la implementación existente, la URL cambió y ya no coincide con la que tiene `index.html` — hay que volver a poner la URL correcta en `SHEETS_ENDPOINT` (dentro de `index.html`) y pushear.
4. Arreglar esto requiere acceso de **Editor al Sheet maestro** (esto también da acceso a los datos de contacto capturados — nombre, tienda, WhatsApp, correo — tenerlo en cuenta antes de compartirlo).

## Si la Sheet del cliente no se está actualizando

1. Abrir el Sheet maestro → menú **Universales → Sincronizar ahora** (fuerza una sincronización inmediata).
2. Si sigue sin actualizar, revisar en Apps Script → **Disparadores** (Triggers) que exista uno activo para la función `sincronizar`.
