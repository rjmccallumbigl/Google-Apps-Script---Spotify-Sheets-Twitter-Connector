/******************************************************************************************************
 * Get a playlist with track contents from Spotify using OAuth2
 * 
 * @param {String} spotifyPlaylist playlist ID, can obtain from URL of playlist
 * 
 * @return {Array} error message if one is received, otherwise returns the array of songs from the playlist
 * 
 * https://script.google.com/macros/d/1lCFkj11CegtV9XyDpqPaRAqk_DlfZzTXo9q6EbdQfd_djjVpWsk2k61u/usercallback
 * 
 * Sources
 * https://github.com/benlcollins/apps_script_apis/blob/master/api_012_spotify/api_012_spotify_code.gs
 * https://www.benlcollins.com/apps-script/api-tutorial-for-beginners/
 * https://hawksey.info/blog/2015/10/setting-up-oauth2-access-with-google-apps-script-blogger-api-example/
 * https://developer.spotify.com/documentation/web-api/reference/#category-playlists
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#list-of-scopes
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists
 * https://github.com/jmperez/spotify-web-api-js
 * https://stackoverflow.com/questions/54856992/spotify-api-authorisation-via-google-apps-script
 * 
 * Deployment ID
 * AKfycbytJDm49ZWklHqF0IKJehfk4T6ZPgo7vr5L47sQf2_2v1FpHdfD1HZx4snVFA8fcIGBrg
 * 
 * Web app
 * https://script.google.com/macros/s/AKfycbytJDm49ZWklHqF0IKJehfk4T6ZPgo7vr5L47sQf2_2v1FpHdfD1HZx4snVFA8fcIGBrg/exec
 *
 ******************************************************************************************************/

function getSpotifyData(spotifyPlaylist) {
  
  // Set up the service
  var spotifyService = getSpotifyService_();

  if (spotifyService.hasAccess()) {
    try {
      // console.log("App has access.");

      // Grab playlist data in sets of 100 (limited by API)
      var limit = 100;
      var offset = 0;
      var offsetText = "";
      var totalArray = [];
      var base = "https://api.spotify.com";

      // Examples of endpoints:
      // var endpoint = "/v1/me";
      // var endpoint = "/v1/me/tracks";
      // var endpoint = "/v1/me/playlists?limit=50";    
      var endpoint = "/v1/playlists/" + spotifyPlaylist + "/tracks?fields=items(added_at,track)&limit=" + limit;

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
        offset += 100;
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
