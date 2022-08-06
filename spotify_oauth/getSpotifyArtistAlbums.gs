/******************************************************************************************************
 *
 * Get an artist's albums from Spotify using OAuth2
 * 
 * @param {String} spotifyArtistID ID of artist
 * 
 * @return {Array} song array
 *
 ******************************************************************************************************/

function getSpotifyArtistAlbums(spotifyArtistID){
  
  // Set up the service
  var spotifyService = getSpotifyService_();

  if (spotifyService.hasAccess()) {
    try {
      // console.log("App has access.");

      // Grab song data in sets (limited by API)
      var limit = 50;
      var offset = 0;
      var offsetText = "";
      var totalArray = [];
      var base = "https://api.spotify.com";

      // Examples of endpoints:
      // var endpoint = "/v1/me";
      // var endpoint = "/v1/me/tracks";
      // var endpoint = "/v1/me/playlists?limit=50";    
      var endpoint = "/v1/artists/" + encodeURIComponent(spotifyArtistID) + "/albums? " + /*encodeURIComponent("include_groups=single,appears_on,album,compilations")*/ + "&limit=" + limit;

      // Pass token to API through header
      var headers = {
        "Authorization": "Bearer " + getSpotifyService_().getAccessToken()
      };
      var options = {
        "headers": headers,
        "method": "GET",
        "muteHttpExceptions": true
      };

      // Collect data from API in sets until we grab it all
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
      } while (responseCode == 200 && responseTextJSON.items.length != 0);

      // Return array of collected data
      return totalArray;

      // Error handling
    } catch (e) {
      return { "errorMessage": "Something went wrong while collecting data" };
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