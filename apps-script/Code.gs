/**
 * Backend de Google Sheets para el formulario Universales.
 *
 * Setup:
 * 1. Crear una Google Sheet nueva. En la primera fila de la primera pestaña
 *    poner los encabezados:
 *    #ID | Fecha | Nombre | Tienda | Código País | WhatsApp | Correo
 * 2. Extensiones > Apps Script, borrar el contenido y pegar este archivo.
 * 3. Implementar > Nueva implementación > Tipo: Aplicación web.
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 4. Copiar la URL que entrega (".../exec") y pegarla en SHEETS_ENDPOINT
 *    dentro de index.html.
 *
 * Si ya tenías esto desplegado y solo cambiaste el código: hay que ir a
 * Implementar > Administrar implementaciones > ícono de lápiz > Versión:
 * Nueva versión > Implementar, para que el cambio se aplique sin que
 * cambie la URL ya usada en el formulario.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    var nextId = sheet.getLastRow(); // fila 1 es el encabezado, así que la primera fila de datos queda con ID 1

    sheet.appendRow([
      nextId,
      data.fecha || new Date().toISOString(),
      data.nombre || "",
      data.tienda || "",
      "'" + (data.codigoPais || ""), // apóstrofe: Sheets lo guarda como texto, no como fórmula
      "'" + (data.whatsapp || ""),
      data.correo || ""
    ]);
  } finally {
    lock.releaseLock();
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
