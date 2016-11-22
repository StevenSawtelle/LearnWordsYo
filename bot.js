console.log("the bot is starting");

//imports
var Twit = require('twit');
var config = require('./config');
var th = require('thesaurus-com');
var fs = require('fs');
var wordListPath = require('word-list');
var wd = require('word-definition');

var word;//word that the synonyms will be based off of
var oldWord;//for posting if no one gets it right
var curWordFound=true;
//if odd, this will get checkWinner to execute. if not, no execute. This is so
//that it doesn't immediately refresh and then give a hint out
var count=3;

var T = new Twit(config);//twit object for tweeting
var wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');//array of all words. BIG

var numOfSeconds=3600;//1800 is 30 minutes
setInterval(tweetIt, 1000*numOfSeconds/3);//tweet numOfSeconds often the prompt


var stream = T.stream('user');
stream.on('tweet', processTweet);

function processTweet(eventMsg){
	var replyAt = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var user = eventMsg.user.screen_name;
	console.log("\n\n\nWORD IS " + word);
	if(replyAt === 'LearnWordsYo'){
		if(text.includes(word)){
			curWordFound = true;
			var status = 'We have a winner! @' + user + ' got it right! The word is ' + word;
			var tweet = { status: status};
			T.post('statuses/update', tweet, gotData);
		}
	}
}

function tweetIt(){
	if(count%3==0){
		var results;//will hold ALL of the synonyms of 'word'

		var found = false;
		oldWord=word;
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
		console.log("\n\n\nWORD IS " + word);
		var posty = generateWords(results);//will be posted in the status
		var status="";
		if(!curWordFound){
			status+="Nobody got that one. The word was ";
			status+=oldWord;
			status+='. Next round:\n';
		}else{
			status+="Find a word with these 5 synonyms:\n";
		}
		status += posty+'\nHint: it starts with '+ word.toUpperCase().charAt(0);
		var tweet = { status: status };

		T.post('statuses/update', tweet, gotData)//post the tweet
		curWordFound = false;//as of now, no one has guessed right word
	}else if((count-1)%3==0){
		if(!curWordFound){
			var status = "No one yet? Second letter is '" + word.charAt(1) + "' and length of word is " + word.length;
			var tweet = { status: status};
			T.post('statuses/update', tweet, gotData);
			count++;
		}
	}else if((count-2)%3==0){
		if(!curWordFound){
			try{
				wd.getDef(word, "en", null, function(test){
					var status = "Still no one? The definition of the word is: " + test.definition;
					var tweet = {status: status};
					T.post('statuses/update', tweet, gotData);
				});
			}catch(err){
				T.post('Still no one? The third letter is ' + word.charAt(2) + '. This is a tough one.');
			}
		}
	}
	count++;
}

//generates word properly formatted for posting to a tweet
function generateWords(results){
	var finals=[];//array of words to be posted
	finals.push(results.synonyms[Math.floor(Math.random()*results.synonyms.length)]);//grab random synonym to post
	var count = 1;
	while(count<5){//fill out rest of random synonyms
		var temp = results.synonyms[Math.floor(Math.random()*results.synonyms.length)]
		if (!(finals.indexOf(temp)>-1)){//dont readd same word
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

function gotData(err, data, response){
	if(err){
		console.log(err);
	}else{
		console.log(data);
	}
}

