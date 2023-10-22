module.exports = {
    name: "emoji",
    aliases: ["addemoji"],
    run: async (client, message, args, commandName) => {
        let staff = client.staff
        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
        } else pass = true;

        if (pass === false) {
            if (client.noperm && client.noperm.trim() !== '') {
                return message.channel.send(client.noperm);
            } else {
                return;
            }
        }
        if (!args.length) {
            return message.channel.send({ content: "Veuillez spécifier l'émoji" });
        }

        const emojiRegex = /<a?:[a-zA-Z0-9_]+:(\d+)>/;
        const totalEmojis = args.length;
        let creeemojis = 0;

        const msg = await message.channel.send("Merci de bien patienter pendant la création des emojis...");

        for (const rawEmoji of args) {
            const emojiss = rawEmoji.match(emojiRegex);

            if (emojiss) {
                const emojiId = emojiss[1];
                const extension = rawEmoji.startsWith("<a:") ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${emojiId + extension}`;

                message.guild.emojis.create({ attachment: url, name: emojiId })
                    .then((emoji) => {
                        creeemojis++;

                        if (creeemojis === totalEmojis) {
                            msg.edit(`La création des emojis est terminée, nombre d'emojis créés : ${creeemojis}`);
                        }
                    })
                    .catch((error) => {
                        msg.edit({ content: "Une erreur s'est produite" });
                        console.error(error);
                    });
            }
        }
    }
};
