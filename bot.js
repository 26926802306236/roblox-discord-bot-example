const roblox = require('noblox.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;
 
client.login(token)
 
const cookie = process.env.COOKIE;

const prefix = process.env.PREFIX;
const groupId = process.env.GROUPID;
const maximumRank = process.env.MAXRANK;
const minimumRank = process.env.MINRANK;
 
function login() {
    return roblox.cookieLogin(cookie);
}
 
login() // Log into ROBLOX
    .then(function() { // After the function has been executed
        console.log('Logged in.') // Log to the console that we've logged in
    })
    .catch(function(error) { // This is a catch in the case that there's an error. Not using this will result in an unhandled rejection error.
        console.log(`Login error: ${error}`) // Log the error to console if there is one.
    });
 
function isCommand(command, message){
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
 
client.on('message', (message) => {
    if (message.author.bot) return; // Dont answer yourself.
    var args = message.content.split(/[ ]+/)
   
    if(isCommand('rank', message)){
       console.log(message)
       if (!message.member.hasPermission('MANAGE_MEMBERS')) return message.reply("**🔒 Sorry, you can't do that.**").then(m => m.delete(5000));
        var username = args[1]
        var rank2 = args[2]
        var rankIdentifier = Number(args[2]) ? Number(args[2]) : args[2];
        if (username){
            message.channel.send(`Checking ROBLOX for ***${username}***`)
            roblox.getIdFromUsername(username)
            .then(function(id){
                roblox.getRankInGroup(groupId, id)
                .then(function(rank){
                    if (!rankIdentifier) return message.channel.send(`***${username}*** is rank ***${rank}***.`);
                    if(minimumRank > rank){
                        message.channel.send(`🔒***${id}*** is rank ***${rank}*** and cannot be promoted before that rank.`)
                    } else {
                    if(maximumRank < rank){
                        message.channel.send(`🔒***${id}*** is rank ***${rank}*** and not promotable.`)
                    } else {
                        message.channel.send(`***${id}*** is rank ***${rank}*** and promotable.`)
                        roblox.setRank(groupId, id, rankIdentifier)
                        .then(function(newRole){
                            message.channel.send(`Changed rank to ***${args[2]}***`)
                        }).catch(function(err){
                            console.error(err)
                            message.channel.send("Failed to change rank.")
                        });
                    }
                    }
                }).catch(function(err){
                    message.channel.send("Couldn't get that player in the group.")
                });
            }).catch(function(err){
                message.channel.send(`Sorry, but ${username} doesn't exist on ROBLOX.`)
          });
      } else {
          message.channel.send("Please enter a rank.")
      }
      return;
  }
})
