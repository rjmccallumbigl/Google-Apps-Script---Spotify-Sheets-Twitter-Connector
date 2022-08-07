# Google-Apps-Script---Spotify-Sheets-Twitter-Connector
Connects Spotify + Google Apps Script + Twitter. Has functionality like converting a Spotify playlist to a Google Sheet and Tweeting every entry in it. Can set to run on a trigger if you want an update every hour or so.

![image](https://user-images.githubusercontent.com/15747450/183298113-95739533-2200-45d2-8cf7-b357a91d98e6.png)

  ## Functions
   * Output list of Spotify playlist(s) to a Google Sheet
   * Output all Spotify playlists to their Google Sheets
   * Tweet every entry in a playlist so when you add a song to a playlist, it shares on Twitter
   * Add all songs from a rotating playlist (e.g. Discover Weekly & Release Radar) to a static playlist so you don't miss the recommended songs when they refresh
   * Add all songs/features from an artist to their own playlist
   
  ## Instructions (Pre-Requisite)
  1. You can either import the scripts from this repo manually or use the plugin Google Apps Script GitHub Assistant to import:
     https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo
  2. Go to https://developer.spotify.com/dashboard/applications and sign in with your Spotify account.
  3. Create an app. Call it something simple like "**Google Sheets Spotify Connector**".
  4. Save your Client ID and Client Secret. Insert them above the `getSpotifyService_()` function in `spotify_oauth/getSpotifyService.gs.
  5. Save the Redirect URI for your script. It is https://script.google.com/macros/d/<<ID>>/usercallback where <<ID>> is the script ID in the URL or in your script Project Settings. I saved it in `spotify_oauth/getSpotifyData.gs` for ease.
  6. At https://developer.spotify.com/dashboard/applications, click on your app and Edit Settings. Add the Redirect URI created above. Save.
  7. Run one of the Spotify functions mentioned below or in `_primary/spotifyToGoogleSheets`.
  8. On the first run through you'll see a URL generated in the Console Log: "**Open the following URL and re-run the script: <<URL>>**". Open the URL in a new tab.
  9. Agree to the Spotify app authorization request to authorize your script using OAuth.
  10. When you see "**Success! You can close this tab.**", go back to the script and re-run the function `spotifyToGoogleSheets()` in `_primary/spotifyToGoogleSheets.gs`.
 
  ### Tweeting Playlist Entries
  1. Create a Twitter Developer account and create a new app: https://developer.twitter.com/en/portal/dashboard
  2. Save the keys and tokens from your new Twitter app in the `sendTweet()` function in `helpers/twitterFunctions.gs`.
  3. If not already added, add the OAuth2 Library by the Script ID: `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF`. Use the latest version.
  4. If not already added, add the Twitter Library by the Script ID: `11dB74uW9VLpgvy1Ax3eBZ8J7as0ZrGtx4BPw7RKK-JQXyAJHBx98pY-7`. Use the latest version and name it `Twitter`.
  5. Enter the playlist IDs in `_primary/addSongsToPlaylistFromAnotherPlaylist`.
  6. Change `var sheetName` in function `spotifyToGoogleSheets()` to whatever you want to be the name of the sheet.
  7. Run `Tweet New Entries in a Playlist` from the Google Sheet or `spotifyToGoogleSheets()` from Google Apps Script in `_primary/spotifyToGoogleSheets`. Every entry in this playlist will be tweeted. The next time you run this function, it will compare the playlist with the entries in the sheet. If there are new entries (i.e. you added new songs to the playlist and it grabbed them), it will tweet them too. If you want to do this periodically and automatically, create a trigger to run this function about once an hour. Any more often and you might be rate limited by the API.
  
  ![image](https://user-images.githubusercontent.com/15747450/183298733-f11f8b41-a89b-4f9c-9581-0f339ca9dde9.png)

  ### Get All Playlists and print to a Google Sheet
  1. Run `Print Playlists to a Google Sheet` from the Google Sheet or `getPlaylists()` from Google Apps Script in `spotify_oauth/getPlaylists`. This will print your playlists to the "**Playlists**" sheet.
 
  ### Get Content of All Playlists and print all to Google Sheets
  1. Run `Get Content of All Playlists` from the Google Sheet or `printAllPlaylists()` from Google Apps Script in `_primary/printAllPlaylists`. This will print all your playlist contents to the spreadsheet with each sheet being a different sheet. If you want to activate and move certain sheets to the front when the spreadsheet is open, update `var faveSheets` for the function `onOpen()` in `_primary/onOpen.gs` with the names of these sheets.
 
### Copy Songs from Playlist(s) to Playlist
  1. Run `addSongsToPlaylistFromAnotherPlaylist()` from Google Apps Script. This will get the specified Spotify playlists, grab the songs, and add to a Google Sheet and another playlist. Helpful for adding tracks from weekly changing playlists (e.g. Discover Weekly, Release Radar) to a static one.
  2. If you want to specify different playlists, update the variables in `_primary/addSongsToPlaylistFromAnotherPlaylist()`.

### Copy Songs from Artist to Playlist
  1. Run `Add songs from an artist to a new playlist` from the Google Sheet. This will get the specified Spotify artist, grab the songs, add to a Google Sheet and then add to a new playlist. Helpful for checking out an artist's album songs, singles, and features.
  2. Run `Add songs from an artist to My Current Playlist` from the Google Sheet. This will get the specified Spotify artist, grab the songs, add to a Google Sheet and then add to a specified playlist instead of a new one. 
  3. If you want to specify a different playlist, update the variables in `_primary/addToArtistPlaylist`.
