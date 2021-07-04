/******************************************************************************************************
 *
 * Convert Spotify playlist to a Google Sheet and Tweet every entry in it.
 * 
 * @return {String} error message if one is received, otherwise returns 1 for success
 * 
 * Instructions
 * 1. You can either import the scripts from this repo manually or use the plugin Google Apps Script GitHub Assistant to import: 
 *    https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo
 * 2. Go to https://developer.spotify.com/dashboard/applications and sign in with your Spotify account.
 * 3. Create an app. Call it something simple like "Google Sheets Spotify Connector".
 * 4. Save your Client ID and Client Secret. Insert them above the getSpotifyService_() function in spotify_oauth/getSpotifyService.gs.
 * 5. Save the Redirect URI for your script. It is https://script.google.com/macros/d/<<ID>>/usercallback where <<ID>> is the script ID in the URL or in your script Project Settings.
 * 6. At https://developer.spotify.com/dashboard/applications, click on your app and Edit Settings. Add the Redirect URI created above. Save.
 * 7. Create a Twitter Developer account and create a new app: https://developer.twitter.com/en/portal/dashboard
 * 8. Save the keys and tokens from your new Twitter app in the sendTweet() function in helpers/twitterFunctions.gs.
 * 9. If not already added, add the OAuth2 Library by the Script ID: 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF. Use the latest version.
 * 10. If not already added, add the Twitter Library by the Script ID: 11dB74uW9VLpgvy1Ax3eBZ8J7as0ZrGtx4BPw7RKK-JQXyAJHBx98pY-7. Use the latest version and name it Twitter.
 * 11. Enter the playlist ID in var spotifyPlaylist of function getSpotifyData() under spotify_oauth/getSpotifyData.gs (can obtain from the URL of the playlist).
 * 12. If you want to modify the name of the sheet, change var sheetName below in function spotifyToGoogleSheets().
 * 13. Run the function spotifyToGoogleSheets() in _primary/spotifyToGoogleSheets.
 * 14. On the first run through you'll see a URL generated in the Console Log: "Open the following URL and re-run the script: <<URL>>". Open the URL in a new tab.
 * 15. Agree to the Spotify app authorization request to authorize your script using OAuth.
 * 16. When you see "Success! You can close this tab.", go back to the script and re-run the function spotifyToGoogleSheets() in _primary/spotifyToGoogleSheets.
 *
 ******************************************************************************************************/

function spotifyToGoogleSheets() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Social Media Playlist";         // Enter the name you want your Google Sheet to be

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
