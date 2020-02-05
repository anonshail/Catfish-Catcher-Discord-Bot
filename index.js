const Discord = require('discord.js');
const client = new Discord.Client();

//reverse image search API
const reverseImageSearch = require('reverse-image-search-google')

//function that will obtain results
const reverseImageSearchResults = (results) => {
    console.log(results.url)
}

//obtaining token and prefix from the config file
const { prefix, token } = require('./config.json');

//displaying status once bot has logged in
client.once('ready', () => {
	console.log('Ready!');
});

//logging in 
client.login(token);

//on message
client.on('message', function(message){
    let atch = (message.attachments).array();
    atch.forEach(function(attachment) {
        reverseImageSearch(attachment.url, reverseImageSearchResults);
    })
})
