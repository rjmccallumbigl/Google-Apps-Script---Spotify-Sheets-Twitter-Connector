/******************************************************************************************************
 *
 * Print content of all Spotify playlists to Google Sheets
 * 
 ******************************************************************************************************/

function getAllPlaylists() {

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

/******************************************************************************************************
 *
 * Get Spotify playlists and add to a Google Sheet
 * 
 ******************************************************************************************************/

function getPlaylists() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Playlists";

  // Get or create sheet
  try {
    var oldSheet = spreadsheet.insertSheet(sheetName);
  } catch (e) {
    var oldSheet = spreadsheet.getSheetByName(sheetName);
  }

  // set up the service
  var spotifyService = getSpotifyService_();

  if (spotifyService.hasAccess()) {
    // try {
      // console.log("App has access.");

      // Send playlist data in sets of 100 (limited by API)
      var limit = 20;
      var offset = 0;
      var offsetText = "";
      var totalArray = [];
      var base = "https://api.spotify.com";

      // Examples of endpoints:
      var endpoint = "/v1/me/playlists?limit=" + limit;

      // Pass token to API through header
      var headers = {
        "Authorization": "Bearer " + getSpotifyService_().getAccessToken()
      };
      var options = {
        "headers": headers,
        "method": "GET",
        "muteHttpExceptions": true
      };

      // Collect data from API in sets of 50 until we grab it all
      do {
        if (offset > 0) {
          offsetText = "&offset=" + offset;
        }
        var response = UrlFetchApp.fetch(base + endpoint + offsetText, options);
        var responseCode = response.getResponseCode();
        var responseText = response.getContentText();
        var responseTextJSON = JSON.parse(responseText);

        // For debugging, download source text of URL to Google Drive since it's too much text for console log
        //  console.log(DriveApp.createFile("Spotify_return.txt", JSON.stringify(response)).getUrl());

        totalArray = totalArray.concat(responseTextJSON.items);
        offset += 20;
      } while (responseCode == 200 && responseTextJSON.items.length != 0);

      // Print array of collected data
      // return totalArray;
      // Map to spreadsheet
      var spotifyObj = convertSpotifyDataToGoogleSheet(totalArray);
      setArraySheet(spreadsheet, spotifyObj, sheetName);
      return spotifyObj;

      // Error handling
    // } catch (e) {
      // return { "errorMessage": "Something went wrong while collecting data - " + e };
    // }
  }
  // Need to authorize, open this URL from the Console Log to gain authorization from Spotify
  else {
    console.log("App has no access yet.");
    var authorizationUrl = spotifyService.getAuthorizationUrl();
    console.log("Open the following URL and re-run the script: " + authorizationUrl);
    return { "errorMessage": "Authorize and rerun: " + authorizationUrl };
  }
}
