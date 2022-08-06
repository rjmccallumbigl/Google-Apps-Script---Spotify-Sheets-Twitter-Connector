/******************************************************************************************************
 *
 * Get songs from artist and add to a Google Sheet and playlist.
 * 
 ******************************************************************************************************/

function addToArtistPlaylist() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var prompt = ui.prompt("Enter an artist name: ");
  if (prompt.getSelectedButton() == ui.Button.OK) {
    var artistName = prompt.getResponseText().trim();
    var artistObject = getSpotifyArtist(artistName);
    var albums = getSpotifyArtistAlbums(artistObject.id);
    var songs = getSongsFromAlbums(albums, artistObject.id);

    // Change to Google Sheet format
    var songSpotifyData = convertSpotifyDataToGoogleSheet(songs);

    // Map to spreadsheet
    setArraySheet(spreadsheet, songSpotifyData, artistObject.name);

    // Build playlist payload
    var playlistPayload = {
      "name": artistObject.name,
      "description": artistObject.external_urls.spotify,
      "public": false
    };

    // Add to playlist
    addSongsToPlaylists(songs, null, playlistPayload);
  }
}

/******************************************************************************************************
 *
 * Get songs from artist and add to My Current Playlist.
 * 
 ******************************************************************************************************/

function addToMyCurrentPlaylist() {

  // Declare variables  
  var ui = SpreadsheetApp.getUi();
  var prompt = ui.prompt("Enter an artist name: ");
  if (prompt.getSelectedButton() == ui.Button.OK) {
    var artistName = prompt.getResponseText().trim();
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var artistObject = getSpotifyArtist(artistName);
    var albums = getSpotifyArtistAlbums(artistObject.id);
    var songs = getSongsFromAlbums(albums, artistObject.id);
    var myCurrentPlaylistName = "My Current Playlist";

    // Add to playlist
    addSongsToPlaylists(songs, MY_CURRENT_PLAYLIST_ID);

    // Grab "My Current Playlist" playlist data
    var myCurrentPlaylist = getSpotifyData(MY_CURRENT_PLAYLIST_ID);

    // Change to Google Sheet format
    var myCurrentPlaylistSpotifyData = convertSpotifyDataToGoogleSheet(myCurrentPlaylist, "added_at");

    // Map to spreadsheet
    setArraySheet(spreadsheet, myCurrentPlaylistSpotifyData, myCurrentPlaylistName);
  }
}