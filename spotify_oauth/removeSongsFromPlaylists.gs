
/******************************************************************************************************
 *
 * Remove songs from playlists
 *
 * @param {Array} songURIs The array of song URIs to remove from the playlist
 * @param {string} playlistID The ID of the playlist we want the songs removed from
 * 
 * @return {Array} error message if one is received, otherwise returns an empty array
 * 
 ******************************************************************************************************/

function removeSongsFromPlaylist(songURIs, playlistID) {

  // Objectify the array of song URIs
  var songURIObject = formatSongURIsForRemoval(songURIs);

  // Set up the service
  var spotifyService = getSpotifyService_();
  
  if (spotifyService.hasAccess()) {
    // console.log("App has access.");

    // Send delete requests in sets (limited by payload size)
    var limit = 25;
    var offset = 0;
    var base = "https://api.spotify.com";
    var uriString = songURIObject;
    var looped = false;
    var loopedCounter = 0;

    // Pass token to API through header
    var headers = {
      "Authorization": "Bearer " + getSpotifyService_().getAccessToken(),
      "Content-Type": "application/json"
    };

    do {
      // Send tracks to delete in sets until we send them all      
      if (uriString.tracks.length < limit) {
        uriString.tracks = songURIObject.tracks.slice(offset, songURIObject.tracks.length);
      } else {
        uriString.tracks = songURIObject.tracks.slice(offset, limit + offset);
        looped = true;
      }

      // songURIObject.s

      var options = {
        "headers": headers,
        "method": "DELETE",
        "payload": JSON.stringify(uriString),
        "muteHttpExceptions": true
      };

      var endpoint = "/v1/playlists/" + playlistID + "/tracks"; //?uris=" + uriString;
      var response = UrlFetchApp.fetch(base + endpoint, options);
      var responseInfo = response.getContentText();      
      var responseCode = response.getResponseCode();
      
      // ======================- Debug -===========================
      console.log("responseCode: " + responseCode);
      console.log("responseInfo: " + responseInfo);
      console.log("offset: " + offset);
      console.log("songURIObject.tracks.length: " + songURIObject.tracks.length);
      // ======================- Debug -===========================

      offset += limit;
      // songURIs = songURIs.slice(limit, songURIs.length);
      // } while (responseCode == 200 && offset < uriString.tracks.length);
    // } while (responseCode >= 200 && responseCode <= 300 && offset < songURIObject.tracks.length);
    } while (responseCode >= 200 && responseCode <= 300 && offset < songURIs.length);

    if (looped) {
      if (loopedCounter > 0) {
        console.log("Removed " + (offset - limit) + " tracks from playlist altogether");
      } else {
        console.log("Removed " + (limit) + " tracks from playlist");
      }
      loopedCounter++;
    } else {
      console.log("Removed " + songURIObject.tracks.length + " tracks from playlist");
      return []; // Return empty array on success
    }
  } else {
    // Need to authorize, open this URL from the Console Log to gain authorization from Spotify
    console.log("App has no access yet.");
    var authorizationUrl = spotifyService.getAuthorizationUrl();
    console.log("Open the following URL and re-run the script: " + authorizationUrl);
    return { "errorMessage": "Authorize and rerun: " + authorizationUrl };
  }
}


/******************************************************************************************************
 *
 * Convert song URIs from string array to object array
 *
 * @param {Array} songURIs The array of song URIs to remove from the playlist
 * 
 * @return {Array} returns an object with the song array in it
 * 
 ******************************************************************************************************/

function formatSongURIsForRemoval(songURIs) {
  // Create an empty object to hold the formatted data
  var formattedObject = {
    "tracks": []
  };

  // Loop through each song URI in the array
  for (var i = 0; i < songURIs.length; i++) {
    // Create an object for each song with its URI
    var songObject = {
      "uri": songURIs[i]
    };

    // Add the song object to the "tracks" array in the formatted object
    formattedObject.tracks.push(songObject);
  }

  // Return the formatted object
  return formattedObject;
}
