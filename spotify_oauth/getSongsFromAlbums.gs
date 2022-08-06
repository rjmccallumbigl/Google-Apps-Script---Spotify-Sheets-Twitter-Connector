/******************************************************************************************************
 *
 * Get an artist's songs from their albums in Spotify using OAuth2
 * 
 * @param {Array} albums array of albums returned from Spotify API for a particular artist
 * @param {String} artistID Spotify ID for our artist
 * 
 * @return {Array} song array
 *
 ******************************************************************************************************/

function getSongsFromAlbums(albums, artistID) {
  // Set up the service
  var spotifyService = getSpotifyService_();
  var totalArray = [];

  if (spotifyService.hasAccess()) {
    albums.forEach(function (album) {
      try {
        // Grab song data in sets (limited by API)
        var limit = 50;
        var offset = 0;
        var offsetText = "";
        var base = "https://api.spotify.com";
        var endpoint = "/v1/albums/" + album.id + "/tracks?limit=" + limit;

        // Pass token to API through header
        var headers = {
          "Authorization": "Bearer " + getSpotifyService_().getAccessToken()
        };
        var options = {
          "headers": headers,
          "method": "GET",
          "muteHttpExceptions": true
        };

        // Collect data from API in sets of 100 until we grab it all
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
          offset += limit;
        } while (responseCode == 200 && responseTextJSON.items.length != 0 && responseTextJSON.next != null);

        // Error handling
      } catch (e) {
        return { "errorMessage": "Something went wrong while collecting data - " + e };
      }
    });

    // Only return the tracks involving our artist
    totalArray = totalArray.filter(function (key) {
      return key.artists.some(function (key2) {
        return key2.id == artistID;
      })
    });

    // Return array of collected data
    return totalArray;
  }

  // Need to authorize, open this URL from the Console Log to gain authorization from Spotify
  else {
    console.log("App has no access yet.");
    var authorizationUrl = spotifyService.getAuthorizationUrl();
    console.log("Open the following URL and re-run the script: " + authorizationUrl);
    return { "errorMessage": "Authorize and rerun: " + authorizationUrl };
  }
}
