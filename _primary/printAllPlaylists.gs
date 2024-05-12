/******************************************************************************************************
 *
 * Print content of all Spotify playlists to Google Sheets
 * 
 ******************************************************************************************************/

function printAllPlaylists() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Playlists");
  var sheetRange = sheet.getDataRange();
  var sheetRangeValues = sheetRange.getDisplayValues();
  var headerRow = sheetRangeValues[0];
  var nameHeader = headerRow.indexOf("name");
  var idHeader = headerRow.indexOf("id");
  var currentSheets = spreadsheet.getSheets().map(function (key) {
    // Only return the sheet name     
    return key.getName();
  });

  // Create request for each playlist in out Playlists sheet
  for (var x = 1; x < sheetRangeValues.length; x++) {

    // Continue only if it has an ID and there is not a sheet for that playlist (did this due to 5 minute timeout if processing playlists already added)
    if (sheetRangeValues[x][idHeader] && currentSheets.indexOf(sheetRangeValues[x][nameHeader]) == -1) {

      // Get tracks from the playlist
      var spotifyPlaylist = getSpotifyData(sheetRangeValues[x][idHeader]);

      // Change to Google Sheet format
      var convertedSpotifyData = convertSpotifyDataToGoogleSheet(spotifyPlaylist, "added_at");

      // Map to spreadsheet
      setArraySheet(spreadsheet, convertedSpotifyData, sheetRangeValues[x][nameHeader]);
    } else {
      console.log("Skipping playlist " + sheetRangeValues[x][nameHeader]);
    }
  }
}
