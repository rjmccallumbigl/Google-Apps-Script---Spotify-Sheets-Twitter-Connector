/******************************************************************************************************
 *
 * Convert Spotify playlist to a Google Sheet and Tweet every entry in it.
 * 
 * @return {String} error message if one is received, otherwise returns 1 for success
 *
 ******************************************************************************************************/

function spotifyToGoogleSheets() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Sheet Name";        // Enter the name you want your Google Sheet to be

  try {
    var oldSheet = spreadsheet.insertSheet(sheetName);
  } catch (e) {
    var oldSheet = spreadsheet.getSheetByName(sheetName);
  }

  var oldSheetRange = oldSheet.getDataRange();
  var oldSheetRangeValues = oldSheetRange.getDisplayValues();

  // Return Spotify array
  try {
    var spotifyPlaylist = getSpotifyData("playlist ID");
    if (spotifyPlaylist.errorMessage) {
      return spotifyPlaylist.errorMessage;
    }

    // Change to Google Sheet format
    var convertedSpotifyData = convertSpotifyDataToGoogleSheet(spotifyPlaylist, "added_at");

    // Get new entries
    var newEntries = compareArraysReturnDiff(oldSheetRangeValues, convertedSpotifyData);

    // Check if there are no new songs
    if (newEntries.length == 0) {
      console.log("No new songs");
      return 0;
    } else {
      // Tweet new entries
      console.log("New songs detected");
      for (var x = 0; x < newEntries.length; x++) {
        sendTweet("#nowplaying " + newEntries[x][12] + " by " + newEntries[x][1] + " " + newEntries[x][8]);
      }

      // Map to spreadsheet
      setArraySheet(spreadsheet, convertedSpotifyData, sheetName);
      return 1;
    }
  } catch (e) {
    return e;
  };
}
