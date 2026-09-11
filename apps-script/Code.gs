/**
 * Backend de Google Sheets para el formulario Universales.
 *
 * Setup:
 * 1. Crear una Google Sheet nueva. En la primera fila poner los encabezados:
 *    Fecha | Nombre | Tienda | WhatsApp | Correo
 * 2. Extensiones > Apps Script, borrar el contenido y pegar este archivo.
 * 3. Implementar > Nueva implementación > Tipo: Aplicación web.
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 4. Copiar la URL que entrega (".../exec") y pegarla en SHEETS_ENDPOINT
 *    dentro de index.html.
 */

var SHEET_NAME = "Respuestas";

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.fecha || new Date().toISOString(),
    data.nombre || "",
    data.tienda || "",
    data.whatsapp || "",
    data.correo || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
