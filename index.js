const Discord = require('discord.js');
const client = new Discord.Client();

//reverse image search API
const reverseImageSearch = require('reverse-image-search-google')

//obtaining token and prefix from the config file
const { prefix, token } = require('./config.json');

//displaying status once bot has logged in
client.once('ready', () => {
    console.log('Ready!');
});

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

//logging in 
client.login(token);

//on receiving a message, check if it is in bot-testing, and chech syntax
client.on('message', function(message){

    

    //if channel is sent on relevant command channel?
    if(message.channel.name === 'detectivebot'){
        let newMsg = message.content

        //if newMsg begins with ${prefix}reverse
        if(newMsg.startsWith(`${prefix}reverse`)){
            //reset reportString and numOfHits

            //check validity of command, syntax, and then execute
            
            command = newMsg.split(" ");
            numOfMessages = command[1]
            channelID = command[2]
            channelID = channelID.slice(2,-1)

            //error checking, check the number, and the channel
            if(isNaN(numOfMessages)){
                message.reply("Please enter a valid number!\nFormat: !reverse <numberOfMsgs> <channel>")
            }

            //checking if channel is valid
            if(message.guild.channels.find(val => val.id === channelID) == null){
                message.reply("Please enter a valid channel!\nFormat: !reverse <numberOfMsgs> <channel>")
            }

            //now, look up the numOfMessages from the channel and apply reverse search
            let targetChannel = message.mentions.channels.first() //got target channel - assume first
            targetChannel.fetchMessages({ limit: Number(numOfMessages) })
            .then(messages => {
                //lookup all messages and check for image attachments and do reverse image search

                let listOfMsgs = messages.array()
                listOfMsgs.forEach( (msg, index) => {
                    let attaches = (msg.attachments).array();
                    attaches.forEach(async function(attachment) {
                        let url = attachment.url
                        if(url.endsWith(".jpg")
                            ||url.endsWith(".png")
                            ||url.endsWith(".jpeg")
                            ||url.endsWith(".gif")
                            ||url.endsWith(".bmp")
                        ){
                            //if the url is an image, look it up!
                            
                            //function that will obtain results
                            const reverseImageSearchResults1 = (results) => {
                                message.channel.send(`Results for the user **${msg.author.tag}**:`)
                                message.channel.send(results.url)
                            }
                            reverseImageSearch(attachment.url, reverseImageSearchResults1)
                        }
                    })
                })
            }).catch(console.error);
            
        }

        if(newMsg.startsWith(`${prefix}lookup`)){
            command = newMsg.split(" ");
            
            //argument must be a url
            let url = command[1]


            //function that will obtain results
            const reverseImageSearchResults2 = (results) => {
                message.channel.send(`Results for the url:`)
                message.channel.send(results.url)
            }

            if(validURL(url)){
                reverseImageSearch(url, reverseImageSearchResults2)
            }

        }

    }
})
