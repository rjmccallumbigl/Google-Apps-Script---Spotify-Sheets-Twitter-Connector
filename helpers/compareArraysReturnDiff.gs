/******************************************************************************************************
 * Compare two arrays and return the entries that are in the new array, but not in the old one.
 * 
 * @param {Array} oldArray The baseline array from the Google Sheet
 * @param {Array} newArray The array with new values
 * @return {Array} The values in the new array that weren't in the old array
 * 
 ******************************************************************************************************/

function compareArraysReturnDiff(oldArray, newArray) {

  var results = [];

  for (var x = 0; x < newArray.length; x++) {
    if (oldArray[x] == null) {
      results.push(newArray[x]);
    }
  }
  return results;
}
