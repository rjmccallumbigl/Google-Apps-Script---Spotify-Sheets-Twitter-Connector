/******************************************************************************************************
 * Send a Tweet from Google Apps Script
 * 
 * @param {String} tweetText The text of the Tweet you want to send
 * @return {String} ID of successful Tweet, 0 if no new songs to Tweet, -1 if auth failed.
 * 
 * Sources
 * https://github.com/airhadoken/twitter-lib
 * https://script.google.com/home/projects/11dB74uW9VLpgvy1Ax3eBZ8J7as0ZrGtx4BPw7RKK-JQXyAJHBx98pY-7/edit
 * https://script.google.com/u/0/home/projects/1ewPMjPo_0r09LphYRbDUJnoxWiLPMl78uOOYtqkSzlD-o--SpoLKdV37/edit
 * https://script.google.com/home/projects/1ey19LQBBQIB85voeIk0BUsYYFncgIHwUbi5c7jXYJ2a76duR2tl-90qZ/edit
 * 
 ******************************************************************************************************/

function sendTweet(tweetText) {

  // Declare variables
  var props = PropertiesService.getScriptProperties();
  var twitterKeys = {
    TWITTER_CONSUMER_KEY: "",
    TWITTER_CONSUMER_SECRET: "",
    TWITTER_ACCESS_TOKEN: "",
    TWITTER_ACCESS_SECRET: ""
  }

  // Set properties
  props.setProperties(twitterKeys);
  var twitterService = new Twitter.OAuth(props);

  // Building OAuth call to API
  if (!twitterService.hasAccess()) {
    console.log("Authorization Failed");
    return -1;
  } else {
    console.log("Authentication Successful");

    // Send Tweet
    try {
      var response = twitterService.sendTweet(tweetText);
      if (response) {
        console.log("Posted Tweet: " + response);
        return (response.id_str);
      } else {
        console.log("No Response");
        return 0;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
