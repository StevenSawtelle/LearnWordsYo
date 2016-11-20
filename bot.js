console.log("the bot is starting");

//imports
var Twit = require('twit');
var config = require('./config');
var th = require('thesaurus-com');
var fs = require('fs');
var wordListPath = require('word-list');

var T = new Twit(config);//twit object for tweeting
var wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');//array of all words. BIG

tweetIt();//call at beginning of program and..
setInterval(tweetIt, 1000*30);//..then every (30) seconds afterwards

function tweetIt(){

	var word;//word that the synonyms will be based off of
	var results;//will hold ALL of the synonyms of 'word'

	var found = false;
	while(!found){
		word = wordArray[Math.floor(Math.random()*wordArray.length)];//randomly grab word
		try{
			results = th.search(word);//actuall call to thesaurus
		}catch(err){
			console.log(err);
		}
		if(results.synonyms.length>=5){
			found=true;//if it's a word that has at least 5 synonyms conditions have been satisfied
		}
	}
	var posty = generateWords(results);//will be posted in the status
	var status = "Find a word with these 5 synonyms:\n"+posty;
	var tweet = { status: status };

	T.post('statuses/update', tweet, gotData)//post the tweet

	//gets called when post goes through
	function gotData(err, data, response){
		if(err){
			console.log(err);
		}else{
			console.log(data);
		}
	}
}

//generates word properly formatted for posting to a tweet
function generateWords(results){
	var finals=[];//array of words to be posted
	finals.push(results.synonyms[Math.floor(Math.random()*results.synonyms.length)]);//grab random synonym to post
	var count = 1;
	while(count<5){//fill out rest of random synonyms
		var temp = results.synonyms[Math.floor(Math.random()*results.synonyms.length)]
		if (!(finals.includes(temp))){//dont readd same word
			finals.push(temp);
			count++;
		}
	}

	var returner = "";//this will be properly formatted for tweeting
	for(var i=0;i<finals.length-1;i++){//for each element, add it to final string
		returner = returner + finals[i]+'\n';
	}
	returner = returner + finals[i];//dont need new line on final synonym
	return returner;
}


