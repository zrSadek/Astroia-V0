const { Astroia } = require("../../structures/client/index");
const Discord = require('discord.js');

module.exports = {
    name: 'ready', 
    run: async (client) => {
        
        setInterval(() => {
            client.guilds.cache.forEach(guild => {
                guild.members.cache.forEach(member => {
                    if (member.voice.channel && !member.voice.afk && !member.user.bot) {
                        const userId = member.user.id;
                        const guildId = guild.id;
                        let messagecount = client.db.get(`vocal_${guildId}_${userId}`) || 0;

                        messagecount++;
                        client.db.set(`vocal_${guildId}_${userId}`, messagecount);
                    }
                });
            });
        }, 1000); 
    },
};
