/******************************************************************************************************
 *
 * Convert Spotify playlist to a Google Sheet and Tweet every entry in it.
 * 
 * @return {String} error message if one is received, otherwise returns 1 for success
 * 
 * Instructions
 * 1. Go to https://developer.spotify.com/dashboard/applications and sign in with your Spotify account.
 * 2. Create an app. Call it something simple like "Google Sheets Spotify Connector".
 * 3. Save your Client ID and Client Secret. Insert them above the getSpotifyService_() function in spotify_oauth/getSpotifyService.gs.
 * 4. Save the Redirect URI for your script. It is https://script.google.com/macros/d/<<ID>>/usercallback where <<ID>> is the script ID in the URL or in your script Project Settings.
 * 5. At https://developer.spotify.com/dashboard/applications, click on your app and Edit Settings. Add the Redirect URI created above. Save.
 * 6. Create a Twitter Developer account and create a new app: https://developer.twitter.com/en/portal/dashboard
 * 7. Save the keys and tokens from your new Twitter app in the sendTweet() function in helpers/twitterFunctions.gs.
 * 8. If not already added, add the OAuth2 Library by the Script ID: 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF. Use the latest version.
 * 9. If not already added, add the OAuth2 Library by the Script ID: 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF. Use the latest version.
 * 10. Run the function spotifyToGoogleSheets() in _primary/spotifyToGoogleSheets.
 * 11. On the first run through you'll see a URL generated in the Console Log: "Open the following URL and re-run the script: <<URL>>". Open the URL in a new tab.
 * 12. Agree to the Spotify app authorization request to authorize your script using OAuth.
 * 13. When you see "Success! You can close this tab.", go back to the script and re-run the function spotifyToGoogleSheets() in _primary/spotifyToGoogleSheets.
 *
 ******************************************************************************************************/

function spotifyToGoogleSheets() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Social Media Playlist";

  try {
    var oldSheet = spreadsheet.insertSheet(sheetName);
  } catch (e) {
    var oldSheet = spreadsheet.getSheetByName(sheetName);
  }

  var oldSheetRange = oldSheet.getDataRange();
  var oldSheetRangeValues = oldSheetRange.getDisplayValues();

  // Return Spotify array
  try {
    var spotifyPlaylist = getSpotifyData();
    if (spotifyPlaylist.errorMessage) {
      return spotifyPlaylist.errorMessage;
    }

    // Change to Google Sheet format
    var convertedSpotifyData = convertSpotifyDataToGoogleSheet(spotifyPlaylist);

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
