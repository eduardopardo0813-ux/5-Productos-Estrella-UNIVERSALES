# Formulario Universales — Top 5

Formulario que se abre desde un QR: la persona completa 4 datos y recibe al instante la imagen "Top 5 de los productos más vendidos".

## Qué falta para dejarlo funcionando

1. **Imágenes reales**
   - `assets/logo.png` — logo de Universales (circular o cuadrado, se recorta solo a círculo con CSS).
   - `assets/top5-productos.jpg` — la imagen final del Top 5 (por ahora podés usar la versión de prueba/placeholder).

2. **Google Sheets (guardar los datos)**
   - Seguir los pasos de `apps-script/Code.gs`.
   - Pegar la URL del Web App en `index.html`, en la constante `SHEETS_ENDPOINT`.

3. **GitHub Pages (hosting sin dominio)**
   - Crear un repositorio en GitHub y subir esta carpeta.
   - Settings > Pages > Deploy from branch > `main` / `root`.
   - La URL quedará tipo `https://usuario.github.io/repo/`.

4. **QR**
   - Generar el QR apuntando a la URL de GitHub Pages.

## Cómo funciona

- El formulario guarda cada envío en `localStorage` **antes** de intentar mandarlo a Sheets, y muestra la imagen del Top 5 de inmediato — así nadie se queda sin su imagen por un wifi lento del evento.
- Si el envío a Sheets falla (sin señal, Apps Script caído, etc.), queda en una cola local y se reintenta solo cuando vuelve la conexión (evento `online`) o al recargar la página.
- No hay build ni dependencias: es HTML/CSS/JS plano, así que el deploy en GitHub Pages es directo.
