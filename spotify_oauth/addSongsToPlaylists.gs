/******************************************************************************************************
 *
 * Add songs to playlists
 *
 * @param {Array} songArray The array of song data to add to the playlist
 * @param {Array} playlistID The ID of the playlist we want the songs added to
 * @param {Object} playlistPayload If creating a new playlist, pass the required data to build it
 * 
 * @return {Array} error message if one is received, otherwise returns the array of songs from the playlist
 * 
 ******************************************************************************************************/

function addSongsToPlaylists(songArray, playlistID, playlistPayload) {

  // set up the service
  var spotifyService = getSpotifyService_();

  if (spotifyService.hasAccess()) {
    // console.log("App has access.");

    // Send playlist data in sets of 25 (limited by acceptable size of URLFetchApp.Fetch request, limit of API is 100)
    var limit = 25;
    var offset = 0;
    var base = "https://api.spotify.com";

    // Pass token to API through header
    var headers = {
      "Authorization": "Bearer " + getSpotifyService_().getAccessToken(),
      'Content-Type': 'application/json'
    };
    var options = {
      "headers": headers,
      "method": "POST",
      "muteHttpExceptions": true
    };

    // Create new playlist if necessary
    if (playlistPayload) {
      options.payload = JSON.stringify(playlistPayload);
      var playlistResponse = UrlFetchApp.fetch(base + "/v1/users/" + USERNAME + "/playlists", options);
      //var playlistResponseCode = playlistResponse.getResponseCode();
      var playlistResponseText = playlistResponse.getContentText();
      var playlistResponseTextJSON = JSON.parse(playlistResponseText);
      var playlistID = playlistResponseTextJSON.id;
    }

    var endpoint = "/v1/playlists/" + playlistID + "/tracks";
    var uriArray = [];

    // Filter song array to only return the URI
    var songArrayURIs = songArray.map(function (key) {
      if (key.track) {
        return key.track["uri"];
      } else if (key.uri) {
        return key.uri;
      }
    });

    // Filter song array to remove empty tracks
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
      var responseText = response.getContentText();
      var responseTextJSON = JSON.parse(responseText);
      offset += uriArray.length;
      songArrayURIs = songArrayURIs.slice(limit, songArrayURIs.length);
    } while (responseCode >= 200 && responseCode < 400 && offset < songArray.length);
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
