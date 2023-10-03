const { Astroia } = require("../../structures/client/index");
const Discord = require('discord.js');

module.exports = {
    name: 'messageDelete',
    run: async (client, message) => {
        try {
            if (!message.partial) {
                const attachmentUrls = [];

                if (message.attachments) {
                    attachmentUrls.push(...message.attachments.map(attachment => attachment.url));
                }

                const snipeData = {
                    author: message.author || null,
                    date: new Date(),
                    content: message.content || null,
                    attachments: attachmentUrls,  
                    embeds: message.embeds || []
                };

                client.snipeMap.set(message.channel.id, snipeData);
            }
        } catch (error) {
            console.error('Une erreur est survenue :', error);
        }
    }
};
