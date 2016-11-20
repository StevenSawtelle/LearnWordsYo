var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

var stream = T.stream('statuses/sample');

stream.on('tweet', tweeter)

function tweeter(tweet){
	var word = "boob";
	if(tweet.text.includes(word)){
		console.log(tweet.text)
	}
}