# LearnWordsYo
A project I did that sounded fun and to teach myself, JavaScript, Node.js, and various APIs. In this case, I used the NPM packages Twit, Thesaurus-com, and word-list to implement functionality.

@LearnWordsYo is a Twitter Bot to help people expand their vocabulary. @LearnWordsYo works by getting a random word from the package word-list, randomly selecting one of those to use as the "correct" word (if it has enough synonyms), and using Thesaurus-com to generate 5 random synonyms for that word. It posts these synonyms to its twitter account.

LearnWordsYo also relies on a separate config.js file to store the users access keys, tokens, etc. for Twit to implement OAuth. This is left uncompleted for obvious security reasons.
