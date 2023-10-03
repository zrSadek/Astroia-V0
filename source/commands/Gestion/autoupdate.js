const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');
const ms = require('ms');

module.exports = {
    name: 'autoupdate',
    description: 'Permet de mettre automatiquement votre bot à jour',

    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message 
     * @param {Array} args
     * @param {String} commandName
     * 
     **/
    run: async (client, message, args, commandName) => {
        try {
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


            const autoUpdateStatus = client.db.get(`autoupdate`);

            if (!args[0]) {
                message.channel.send('Veuillez spécifier si vous souhaitez activer ou désactiver l\'autoupdate.');
                return;
            }

            if (args[0] === 'on' && autoUpdateStatus !== 'on') {
                client.db.set(`autoupdate`, 'on');
                message.channel.send('L\'autoupdate est maintenant activé.');
            } else if (args[0] === 'off' && autoUpdateStatus !== 'off') {
                client.db.set(`autoupdate`, 'off');
                message.channel.send('L\'autoupdate est maintenant désactivé.');
            } else {
                message.channel.send('L\'autoupdate est déjà désactiver.')
            }
        } catch (erreur) {
            console.error(erreur);
            message.channel.send('Une erreur est survenue.');
        }
    }
};
