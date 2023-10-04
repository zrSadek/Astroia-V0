const { Client, GatewayIntentBits } = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: 'servinvite',
    aliases: ['serveur-invite', 'serveurinvite'],
    description: 'Affiche la liste des serveurs sur lesquels le bot est présent',
    /**
     * @param {Astroia} client 
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        let pass = false
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
        const guildId = args[0];
        try {
            const guild = await client.guilds.fetch(guildId);
            if (!guild) return message.channel.send(`Aucun serveur trouvé pour \`${args[0] || 'rien'}\``);

            const invite = await guild.channels.cache.filter(channel => channel.type === 0).first().createInvite();
            message.channel.send(`Voici le lien d'invitation pour le serveur ${guild.name}: ${invite.url}`);
        } catch (error) {
            message.channel.send('Une erreur s\'est produite.');
            console.error(error);
        }
    }
}
