/******************************************************************************************************
 *
 * Get an artist from Spotify using OAuth2
 * 
 * @param {String} spotifyArtist name of artist
 * 
 * @return {Object} artist information
 *
 ******************************************************************************************************/

function getSpotifyArtist(spotifyArtist) {
  
// Debug
// var spotifyArtist = "redman";

  // Set up the service
  var spotifyService = getSpotifyService_();

  if (spotifyService.hasAccess()) {
    try {
      // console.log("App has access.");

      // Grab artist data
      var limit = 1;
      var totalArray = [];
      var base = "https://api.spotify.com";

      // Examples of endpoints:
      // var endpoint = "/v1/me";
      // var endpoint = "/v1/me/tracks";
      // var endpoint = "/v1/me/playlists?limit=50";    
      var endpoint = "/v1/search?q=" + encodeURIComponent(spotifyArtist) + "&type=artist&market=US&locale=en-US%2Cen%3Bq%3D0.9";      

      // Pass token to API through header
      var headers = {
        "Authorization": "Bearer " + getSpotifyService_().getAccessToken()
      };
      var options = {
        "headers": headers,
        "method": "GET",
        "muteHttpExceptions": true
      };

      // Collect data from API
        var response = UrlFetchApp.fetch(base + endpoint, options);
        var responseCode = response.getResponseCode();
        var responseText = response.getContentText();
        var responseTextJSON = JSON.parse(responseText);

      // Return artist ID
      return responseTextJSON.artists.items[0];

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
