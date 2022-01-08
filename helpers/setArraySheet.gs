/******************************************************************************************************
 * Convert 2D array into sheet
 * 
 * @param {Object} spreadsheet The primary Spreadsheet
 * @param {Array} array The multidimensional array that we need to map to a sheet
 * @param {String} sheetName The name of the sheet the array is being mapped to
 * 
 ******************************************************************************************************/

function setArraySheet(spreadsheet, array, sheetName) {
  // Select the sheet and set values  

  try {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log("Creating sheet " + sheetName);
  } catch (e) {
    sheet = spreadsheet.getSheetByName(sheetName).clear();
    console.log("Recreating sheet " + sheetName);
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, array.length, array[0].length).setValues(array);
}
