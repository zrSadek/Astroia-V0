const Discord = require('discord.js')
module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {

        if (!message.guild) return;
        if(message.author.id === client.user.id)return; 

        let autoreact = client.db.get(`autoreact_${message.guild.id}`)
        if (!autoreact || autoreact.length === 0) return;

        let autoreact_ = autoreact.filter(r => r.channel === message.channel.id)
        if (autoreact_.length === 0) return;

        let autoreact_emoji = autoreact_.map(r => r.emoji)
        
        autoreact_emoji.forEach(async (emoji) => {
            await message.react(emoji)
        })



    }
}