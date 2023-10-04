const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'removeinvite',
    description: "Permet de retirer des invitations.",
    run: async (client, message, args, commandName) => {
        const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            return message.reply('Utilisateur introuvable');
        }
        const count = parseInt(args[1]);
        if (isNaN(count) || count <= 0) {
            return message.reply('Veuillez fournir un nombre valide d\'invitations à retirer.');
        }
        
        let invitesData = await client.db.get(`invites_${user.id}_${message.guild.id}`) || {
            total: 0,
            valid: 0,
            left: 0,
            bonus: 0
        };

        if (invitesData.bonus < count) {
            return message.reply('L\'utilisateur n\'a pas assez d\'invitations bonus à retirer.');
        }

        invitesData.bonus -= count;
        await client.db.set(`invites_${user.id}_${message.guild.id}`, invitesData);

        message.reply(`Vous avez retiré \`${count} invitations\` à \`${user.tag}\`.`);

    }
};
