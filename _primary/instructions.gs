/******************************************************************************************************
 *
 * Instructions
 * 1. You can either import the scripts from this repo manually or use the plugin Google Apps Script GitHub Assistant to import:
 *    https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo
 * 2. Go to https://developer.spotify.com/dashboard/applications and sign in with your Spotify account.
 * 3. Create an app. Call it something simple like "Google Sheets Spotify Connector".
 * 4. Save your Client ID and Client Secret. Insert them above the getSpotifyService_() function in spotify_oauth/getSpotifyService.gs.
 * 5. Save the Redirect URI for your script. It is https://script.google.com/macros/d/<<ID>>/usercallback where <<ID>> is the script ID in the URL or in your script Project Settings.
 * 6. At https://developer.spotify.com/dashboard/applications, click on your app and Edit Settings. Add the Redirect URI created above. Save.
 * 7. Run one of the Spotify functions mentioned below or in _primary/spotifyToGoogleSheets.
 * 8. On the first run through you'll see a URL generated in the Console Log: "Open the following URL and re-run the script: <<URL>>". Open the URL in a new tab.
 * 9. Agree to the Spotify app authorization request to authorize your script using OAuth.
 * 10. When you see "Success! You can close this tab.", go back to the script and re-run the function spotifyToGoogleSheets() in _primary/spotifyToGoogleSheets.
 *
 * Tweeting Playlist Entries
 * 1. Create a Twitter Developer account and create a new app: https://developer.twitter.com/en/portal/dashboard
 * 2. Save the keys and tokens from your new Twitter app in the sendTweet() function in helpers/twitterFunctions.gs.
 * 3. If not already added, add the OAuth2 Library by the Script ID: 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF. Use the latest version.
 * 4. If not already added, add the Twitter Library by the Script ID: 11dB74uW9VLpgvy1Ax3eBZ8J7as0ZrGtx4BPw7RKK-JQXyAJHBx98pY-7. Use the latest version and name it Twitter.
 * 5. Enter the playlist ID in var spotifyPlaylist.
 * 6. Change var sheetName in function spotifyToGoogleSheets() to whatever you want to be the name of the sheet.
 * 7. Run 'Tweet New Entries in a Playlist' from the Google Sheet or spotifyToGoogleSheets() from Google Apps Script. Every entry in this playlist will be tweeted. The next time you run this function, it will compare the playlist with the entries in the sheet. If there are new entries (i.e. you added new songs to the playlist and it grabbed them), it will tweet them too. If you want to do this periodically and automatically, create a trigger to run this function about once an hour. Any more often and you might be rate limited by the API.
 *
 * Get All Playlists and print to a Google Sheet
 * 1. Run 'Print Playlists to a Google Sheet' from the Google Sheet or getPlaylists() from Google Apps Script. This will print your playlists to the "Playlists" sheet.
 *
 * Get Content of All Playlists and print all to Google Sheets
 * 1. Run 'Get Content of All Playlists' from the Google Sheet or getAllPlaylists() from Google Apps Script. This will print your all your playlist contents to the spreadsheet with each sheet being a different sheet. If you want to activate and move certain sheets when the spreadsheet is open, update var faveSheets in onOpen() with the names of these sheets.
 *
 * Copy Songs from Playlist(s) to Playlist
 * 1. Run addSongsToPlaylistFromAnotherPlaylist() from Google Apps Script. This will get the specified Spotify playlists, grab the songs, and add to a Google Sheet and anotehr playlist. Helpful for adding tracks from weekly changing playlists (e.g. Discover Weekly, Release Radar) to a static one.
 * 2. If you want to specify different playlists, update the variables in _primary/addSongsToPlaylistFromAnotherPlaylist().
 *
******************************************************************************************************/
