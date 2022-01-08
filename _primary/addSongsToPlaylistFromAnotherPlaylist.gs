/******************************************************************************************************
 *
 * Get Spotify playlists, grab the songs, and add to a Google Sheet and playlist.
 * Helpful for adding tracks from weekly changing playlists (e.g. Discover Weekly, Release Radar) to a static one.
 * 
 ******************************************************************************************************/

function addSongsToPlaylistFromAnotherPlaylist() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var discoverWeekly = getSpotifyData("add playlist ID here");
  var discoverWeeklyName = "Discover Weekly";
  var releaseRadar = getSpotifyData("add playlist ID here");
  var releaseRadarName = "Release Radar";

  // Change to Google Sheet format
  var discoverWeeklySpotifyData = convertSpotifyDataToGoogleSheet(discoverWeekly, "added_at");
  var releaseRadarSpotifyData = convertSpotifyDataToGoogleSheet(releaseRadar, "added_at");

  // Map to spreadsheet
  setArraySheet(spreadsheet, discoverWeeklySpotifyData, discoverWeeklyName);
  setArraySheet(spreadsheet, releaseRadarSpotifyData, releaseRadarName);

  // Add to My Current Playlist
  addSongsToPlaylists(discoverWeekly, "add playlist ID here");
  addSongsToPlaylists(releaseRadar, "add playlist ID here");
}

/******************************************************************************************************
 *
 * Add songs to playlists
 *
 * @param {Array} songArray The array of song data to add to the playlist
 * @param {Array} playlistID The ID of the playlist we want the songs added to
 * 
 * @return {Array} error message if one is received, otherwise returns the array of songs from the playlist
 * 
 ******************************************************************************************************/

function addSongsToPlaylists(songArray, playlistID) {

  // set up the service
  var spotifyService = getSpotifyService_();

  if (spotifyService.hasAccess()) {
    // console.log("App has access.");

    // Send playlist data in sets of 25 (limited by acceptable size of URLFetchApp.Fetch request, limit of API is 100)
    var limit = 25;
    var offset = 0;
    var base = "https://api.spotify.com";
    var endpoint = "/v1/playlists/" + playlistID + "/tracks";
    var uriArray = [];

    // Pass token to API through header
    var headers = {
      "Authorization": "Bearer " + getSpotifyService_().getAccessToken(),
      'Content-Type': 'application/json'
    };
    var options = {
      "headers": headers,
      "method": "POST",
      "muteHttpExceptions": true,
      "payload": {}
    };

    // Filter song array to remove empty tracks and only return the URI
    var songArrayURIs = songArray.map(function (key) {
      if (key.track) {
        return key.track["uri"];
      }
    });
    songArrayURIs = songArrayURIs.filter(function (key) {
      return key != undefined;
    });

    // Send tracks to playlist via API in sets of 25 until we send them all
    do {
      if (songArrayURIs.length < limit) {
        // options.payload.uris = songArrayURIs;   //Issue parsing JSON in payload, will only send in parameter
        uriArray = songArrayURIs;
      } else {
        // options.payload.uris = new Array(JSON.stringify(songArrayURIs.slice(offset, limit + offset)));   //Issue parsing JSON in payload, will only send in parameter
        uriArray = songArrayURIs.slice(0, limit);
      }

      var response = UrlFetchApp.fetch(base + endpoint + "?uris=" + encodeURIComponent(uriArray), options);
      var responseCode = response.getResponseCode();
      offset += uriArray.length;
      songArrayURIs = songArrayURIs.slice(limit, songArrayURIs.length);
    } while (responseCode == 201 && offset < songArray.length);
    console.log("Added " + offset + " tracks to playlist");
    if (offset < songArray.length) {
      console.warn("Added less songs than total number of songs in playlist passed to function. Processed " + offset + " but function was passed " + songArray.length + " songs. This may be because Spotify delisted some of the tracks from the playlist but you may want to double check.");
    }
  }
  // Need to authorize, open this URL from the Console Log to gain authorization from Spotify
  else {
    console.log("App has no access yet.");
    var authorizationUrl = spotifyService.getAuthorizationUrl();
    console.log("Open the following URL and re-run the script: " + authorizationUrl);
    return { "errorMessage": "Authorize and rerun: " + authorizationUrl };
  }
}
