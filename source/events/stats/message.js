const { Astroia } = require("../../structures/client/index");
const Discord = require('discord.js');

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Astroia} client 
     * @returns 
     */
    run: async (client, message) => {
        if (message.author.bot || !message.guild) return;

        const userId = message.author.id;
        const guildId = message.guild.id;
        let messagecount = client.db.get(`message_${guildId}_${userId}`) || 0;
        messagecount++
        client.db.set(`message_${guildId}_${userId}`, messagecount);

    }
}