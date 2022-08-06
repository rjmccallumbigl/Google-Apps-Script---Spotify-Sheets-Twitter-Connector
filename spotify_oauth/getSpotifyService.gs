/******************************************************************************************************
 * Authorize Spotify API using OAuth2
 * 
 * Sources
 * https://github.com/benlcollins/apps_script_apis/blob/master/api_012_spotify/api_012_spotify_oauth.gs
 * 
 ******************************************************************************************************/

// Put Spotify ID and Secret here
var CLIENT_ID = '';
var CLIENT_SECRET = '';
var USERNAME = '';

// Configure the service
function getSpotifyService_() {
  return OAuth2.createService('Spotify')
    .setAuthorizationBaseUrl('https://accounts.spotify.com/authorize')
    .setTokenUrl('https://accounts.spotify.com/api/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('user-library-read playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private');
}

// Logs the redirect URI to register. You can also get this from File > Project Properties
function logRedirectUri() {
  var service = getSpotifyService_();
  console.log(service.getRedirectUri());
}

// Handle the callback
function authCallback(request) {
  var spotifyService = getSpotifyService_();
  var isAuthorized = spotifyService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}
