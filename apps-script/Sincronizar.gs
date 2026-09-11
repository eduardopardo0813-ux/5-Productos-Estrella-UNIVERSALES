/**
 * Sincroniza los datos del Sheet maestro (privado, donde escribe el
 * formulario) hacia otro Sheet aparte que sí se puede compartir con el
 * cliente (Universales) — así nunca tienen acceso de edición al original.
 * Si dañan algo en la copia, la próxima sincronización lo corrige solo.
 *
 * Setup (una sola vez):
 * 1. Crear una Google Sheet nueva y vacía — será la que se comparte con
 *    el cliente. Copiar su ID desde la URL:
 *    https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
 * 2. Pegar ese ID abajo en DEST_SHEET_ID.
 * 3. En el editor de Apps Script (el mismo proyecto donde está Code.gs):
 *    Archivos > el ícono "+" > Script. Nombralo "Sincronizar" y pegá
 *    este archivo completo.
 * 4. En el desplegable de funciones (arriba, al lado de "Depuración")
 *    elegí "crearTriggerSincronizacion" y dale a Ejecutar (▶) una sola
 *    vez. Va a pedir autorización la primera vez, igual que con doPost.
 * 5. Compartí la Sheet nueva con el cliente en modo "Lector" (no editor).
 *
 * Por defecto sincroniza cada 10 minutos. También queda un botón
 * "Universales > Sincronizar ahora" en el menú del Sheet maestro para
 * forzar una sincronización manual cuando quieras.
 */

var DEST_SHEET_ID = "1woaKQBzOh8738sp8PWjpFhIoT8HtPsN9BHAwsDOcPtI";

function sincronizar() {
  var origenHoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var destinoHoja = SpreadsheetApp.openById(DEST_SHEET_ID).getSheets()[0];

  var datos = origenHoja.getDataRange().getValues();
  var filas = datos.length;
  var columnas = datos[0].length;

  destinoHoja.clearContents();
  // Código País (col 5) y WhatsApp (col 6) como texto plano, para que
  // el "+" no se interprete como fórmula al copiarlos.
  destinoHoja.getRange(1, 5, filas, 2).setNumberFormat("@");
  destinoHoja.getRange(1, 1, filas, columnas).setValues(datos);
}

function crearTriggerSincronizacion() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "sincronizar") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("sincronizar").timeBased().everyMinutes(10).create();
  sincronizar(); // primera sincronización inmediata
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Universales")
    .addItem("Sincronizar ahora", "sincronizar")
    .addToUi();
}
