var th = require('thesaurus-com');

var results = th.search('test');

console.log(results.synonyms[Math.floor(Math.random()*results.synonyms.length)].concat(results.synonyms[Math.floor(Math.random()*results.synonyms.length)]));
//word = wordArray[Math.floor(Math.random()*items.length)];
// var fs = require('fs');
// var wordListPath = require('word-list');

// var wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');

// console.log(wordArray);