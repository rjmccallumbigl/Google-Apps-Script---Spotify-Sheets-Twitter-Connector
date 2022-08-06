/********************************************************************************************************************************************************** 
 * 
 * Create a menu option for script functions, updates first couple of sheets
 * 
**********************************************************************************************************************************************************/

function onOpen() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var faveSheets = ["Extra", "Social Media Likes", "Playlists"]; // Add the names of the sheets/playlists you want to be activated and moved in your spreadsheet if desired

  // Create menu
  ui.createMenu('Spotify')
    .addItem('Print Playlists to a Google Sheet', 'getPlaylists')
    .addItem('Get Content of All Playlists', 'printAllPlaylists')
    .addItem('Tweet New Entries in a Playlist', 'spotifyToGoogleSheets')
    .addSeparator()
    .addItem('Add songs from an artist to a new playlist','addToArtistPlaylist')
    .addItem('Add songs from an artist to My Current Playlist','addToMyCurrentPlaylist')
    .addToUi();

// Move these sheets to the front of the spreadsheet
  faveSheets.forEach(function (faveSheet) {
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName(faveSheet));
    spreadsheet.moveActiveSheet(1);
  });
}
