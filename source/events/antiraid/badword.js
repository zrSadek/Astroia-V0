const { Astroia } = require("../../structures/client/index");
const ms = require('ms');
const Discord = require('discord.js')
const spamMap = new Map();

module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot) return;
        const db = client.db.get(`badword_${message.guild.id}`)
        if(message.author.id === message.guild.ownerId)return; 
        if (client.config.buyers.includes(message.author.id)) return;
        if (message.author.id === client.db.get(`owner_${message.author.id}`)) return;
        if(client.staff.includes(message.author.id)) return;
        if (client.db.get(`owner_${message.author.id}`) === true) return;

        if(!db)return;
        const messageContientBadWord = db.mots.some(mot => message.content.toLowerCase().includes(mot.toLowerCase()));
        if (messageContientBadWord) {
            message.delete();

            message.channel.send(`<@${message.author.id}> Votre message a été supprimé car il contenait un mot interdit.`).then((c) => {
                setTimeout(() => { 
                c.delete();
            }, 2500)
            });
            
        }
    }
}