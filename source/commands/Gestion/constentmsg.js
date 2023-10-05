const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'constentmessage',
    description: 'Active le contentmessage pour ce channel.',
    run: async (client, message, args) => {
        let pass = false;
        let staff = client.staff;
        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
        } else {
            pass = true;
        }

        if (pass === false) {
            if (client.noperm && client.noperm.trim() !== '') {
                return message.channel.send(client.noperm);
            } else {
                return;
            }
        }
        let content = args.join(' ');

        if (args.length === 1 && !isNaN(args[0])) {
            try {
                const fetchedMessage = await message.channel.messages.fetch(args[0]);
                if (fetchedMessage) {
                    content = fetchedMessage.content;
                    if (fetchedMessage.embeds.length > 0) {
                        const embedData = fetchedMessage.embeds[0];
                        const embed = new EmbedBuilder(embedData);
                        await client.db.set(`constentmsg_${message.guild.id}_${message.channel.id}`, { embed: embed.toJSON(), content: content, msgID: null });
                        return message.channel.send('L\'embed du message spécifié a été sauvegardé avec succès dans la base de données !');
                    }
                }
            } catch (error) {
                console.error(error.message);
                return message.channel.send('Le message spécifié est introuvable ou inaccessible.');
            }
        }

        try {
            await client.db.set(`constentmsg_${message.guild.id}_${message.channel.id}`, { content: content });
            message.channel.send('Le message a été sauvegardé avec succès dans la base de données !');
        } catch (error) {
            console.error(error.message);
            message.channel.send('Une erreur s\'est produite lors de la sauvegarde du message.');
        }
    }
}
