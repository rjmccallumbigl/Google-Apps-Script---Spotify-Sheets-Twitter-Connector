// ** Runner function for Spotify playlist manipulation operations  */
function runnerForDeDuper() {
  // Remove songs already in playlist 1 from playlist 2
  spotifyDeduper("123...", "456...");

  // Put duplicates within playlist in a spreadsheet
  // spotifySingleDeduper("123...");

  // Remove unavailable songs from playlist not available in any markets with no preview
  // removeUnavailableTracks("123...");
}



/******************************************************************************************************
 *
 * Compares tracks between two Spotify playlists and removes duplicates from the second playlist.
 *
 * @param {string} playlist1ID The ID of the first playlist (playlist to use as reference for duplicates).
 * @param {string} playlist2ID The ID of the second playlist (playlist to remove duplicates from).
 *
 * @return {string} Success message indicating duplicates were removed or error message if one is encountered.
 *
 * This function retrieves tracks from both playlists, then removes duplicates from playlist2 that are also found in playlist1.
 * It utilizes separate helper functions to retrieve tracks (`getPlaylistTracks`) and remove duplicates (`removeDuplicatesFromPlaylist`).
 *
 ******************************************************************************************************/

function spotifyDeduper(playlist1ID, playlist2ID) {

  // Set up the service
  var spotifyService = getSpotifyService_();

  if (spotifyService.hasAccess()) {
    try {
      console.log("App has access.");

      // Get tracks from both playlists
      var playlist1Tracks = getSpotifyData(playlist1ID);
      var playlist2Tracks = getSpotifyData(playlist2ID);

      if (playlist1Tracks.errorMessage || playlist2Tracks.errorMessage) {
        return playlist1Tracks.errorMessage || playlist2Tracks.errorMessage;
      }

      // Convert tracks to a set for efficient duplicate checking
      var playlist1TrackSet = new Set(playlist1Tracks.map(track => track.track.uri));

      // Filter playlist2 to remove tracks also present in playlist1
      var filteredPlaylist2 = playlist2Tracks.filter(track => playlist1TrackSet.has(track.track.uri));
      // console.log("filteredPlaylist2: " + filteredPlaylist2);
      var filteredPlaylist2Ids = filteredPlaylist2.map(track => track.track.uri);

      // Remove the duplicates from playlist2 using the filtered tracks 
      removeSongsFromPlaylist(filteredPlaylist2Ids, playlist2ID);

      return "Duplicates removed from playlist " + playlist2ID;

    } catch (e) {
      return { "errorMessage": "Something went wrong while collecting data - " + e };
    }
  } else {
    console.log("App has no access yet.");
    var authorizationUrl = spotifyService.getAuthorizationUrl();
    console.log("Open the following URL and re-run the script: " + authorizationUrl);
    return { "errorMessage": "Authorize and rerun: " + authorizationUrl };
  }
}

/******************************************************************************************************
 *
 * Finds duplicate tracks within a Spotify playlist and returns an array containing those duplicates.
 *
 * @param {string} playlistID The ID of the Spotify playlist to check for duplicates.
 *
 * @return {Array} An array of duplicate track objects found in the playlist, or an empty array if no duplicates are found.
 *                 Each track object has the same structure as the objects returned by the `getSpotifyData` function.
 * 
 * This function retrieves tracks from the specified playlist and identifies tracks with duplicate URIs.
 * It utilizes a Set to efficiently track unique track URIs encountered while iterating through the playlist.
 * Tracks with URIs already existing in the Set are considered duplicates and added to a separate array.
 *
 ******************************************************************************************************/

function spotifySingleDeduper(playlistID) {
  // Set up the service
  var spotifyService = getSpotifyService_();

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Duplicates";

  if (spotifyService.hasAccess()) {
    try {
      console.log("App has access.");

      // Get tracks from the playlist
      var playlistTracks = getSpotifyData(playlistID);

      if (playlistTracks.errorMessage) {
        return playlistTracks.errorMessage;
      }

      // Create a Set to store unique track URIs (seen tracks)
      var seenTracks = new Set();
      // Create an empty array to store duplicate tracks
      var duplicateTracks = [];

      // Loop through playlist tracks
      for (var track of playlistTracks) {
        var trackURI = track.track.uri;
        // Check if track URI already exists in the set
        if (seenTracks.has(trackURI)) {
          duplicateTracks.push(track); // Add duplicate track to the array
        } else {
          seenTracks.add(trackURI); // Add unique track URI to the set
        }
      }

      // Return array with duplicates or empty array if none found      
      // return duplicateTracks.length > 0 ? duplicateTracks : [];
      // Change to Google Sheet format
      // var convertedSpotifyData = convertSpotifyDataToGoogleSheet(duplicateTracks, "added_at");

      // Map to spreadsheet
      // setArraySheet(spreadsheet, convertedSpotifyData, sheetRangeValues[x][nameHeader]);

      // Change to Google Sheet format
      var duplicateTracksSpotifyData = convertSpotifyDataToGoogleSheet(duplicateTracks, "added_at");

      // Map to spreadsheet
      setArraySheet(spreadsheet, duplicateTracksSpotifyData, sheetName);


    } catch (e) {
      return { "errorMessage": "Something went wrong while collecting data - " + e };
    }
  } else {
    console.log("App has no access yet.");
    var authorizationUrl = spotifyService.getAuthorizationUrl();
    console.log("Open the following URL and re-run the script: " + authorizationUrl);
    return { "errorMessage": "Authorize and rerun: " + authorizationUrl };
  }
}

/******************************************************************************************************
*
* Removes tracks from a Spotify playlist that are unavailable in any markets.
*
* @param {string} playlistID The ID of the Spotify playlist to filter for unavailable tracks.
*
* @return {string} Success message indicating unavailable tracks were removed or error message if one is encountered.
*
* This function retrieves tracks from the playlist and filters them based on the availability_markets property within each track object.
* Tracks with an empty availability_markets array are considered unavailable and removed from the playlist using the `removeSongsFromPlaylist` function.
*
******************************************************************************************************/

function removeUnavailableTracks(playlistID) {
	
  // Set up the service
	var spotifyService = getSpotifyService_();

	if (spotifyService.hasAccess()) {
		try {
			console.log("App has access.");

			// Get tracks from playlist
			var playlistTracks = getSpotifyData(playlistID);

			if (playlistTracks.errorMessage) {
				return playlistTracks.errorMessage;
			}

			// Filter playlist to pinpoint unavailable tracks
			var filteredPlaylist = playlistTracks.filter(
				(song) =>
					song.track.available_markets.length === 0 &&
					song.track.preview_url == null
			);
			
			var filteredPlaylistIds = filteredPlaylist.map(
				(track) => track.track.uri
			);

			// Remove the duplicates from the playlist using the filtered tracks
			removeSongsFromPlaylist(filteredPlaylistIds, playlistID);

			return "Duplicates removed from playlist " + playlistID;
		} catch (e) {
			return {
				errorMessage: "Something went wrong while collecting data - " + e,
			};
		}
	} else {
		console.log("App has no access yet.");
		var authorizationUrl = spotifyService.getAuthorizationUrl();
		console.log(
			"Open the following URL and re-run the script: " + authorizationUrl
		);
		return { errorMessage: "Authorize and rerun: " + authorizationUrl };
	}
}
