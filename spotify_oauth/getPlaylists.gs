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


