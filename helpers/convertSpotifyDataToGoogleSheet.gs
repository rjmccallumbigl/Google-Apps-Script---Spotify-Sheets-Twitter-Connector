/******************************************************************************************************
 * Convert Spotify Data to Google Sheet
 * 
 * @param {Object} spotifyObj The data returned from Spotify
 * @param {String} newKey The new key to add to our Header Row
 * @return {Array} The 2D array created from the Spotify data
 * 
 ******************************************************************************************************/

function convertSpotifyDataToGoogleSheet(spotifyObj, newKey) {

  // Declare variables
  var keyArray = [];
  var sheetArray = [];
  var returnedArtists = [];

  // Define an array of all the returned object's keys to act as the Header Row
  keyArray.length = 0;
  if (newKey) {
    keyArray = Object.keys(spotifyObj[0].track).concat(newKey);
  } else {
    keyArray = Object.keys(spotifyObj[0]);
  }
  sheetArray.length = 0;
  sheetArray.push(keyArray);

  //  Map Spotify track to Google Sheet row
  for (var x = 0; x < spotifyObj.length; x++) {
    sheetArray.push(keyArray.map(function (key) {
      // Only return the album name
      if (spotifyObj[x].track) {
        if (key == "album") {
          return spotifyObj[x].track[key].name;
          // Return the artist name if there's only one, otherwise return all artists
        } else if (key == "artists") {
          returnedArtists.length = 0;
          for (var artist in spotifyObj[x].track[key]) {
            returnedArtists.push(spotifyObj[x].track[key][artist].name);
          }
          return returnedArtists.join(", ");
          // Return the Spotify URL
        } else if (key == "external_urls") {
          if (newKey) {
            return spotifyObj[x].track[key].spotify;
          } else {
            return spotifyObj[x][key].spotify;
          }
          // Return the date the song was added to the playlist
        } else if (key == "added_at") {
          return spotifyObj[x][key];
        } else {
          if (newKey) {
            return spotifyObj[x].track[key];
          } else {
            return spotifyObj[x][key];
          }
        }
        // Only return the URL
      } else if (key == "external_urls") {
        return spotifyObj[x][key].spotify;
        // Only return number of tracks in the playlist 
      } else if (key == "tracks") {
        return spotifyObj[x][key].total;
        // Return the date the song was added to the playlist
      } else {
        return spotifyObj[x][key];
      }
    }));
  }
  return sheetArray;
}
