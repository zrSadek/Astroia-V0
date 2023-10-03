const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');
const db = require('quick.db')
module.exports = {
    name: 'settings',
    description: 'Affiche les paramètres du bot',
    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message
     * @param {string[]} args 
     */
    run: async (client, message, args, commandeName) => {
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
        let autoupdate = client.db.get('autoupdate') || 'Désactivé';
        const version = client.version || 'Erreur';
        const activityname = client.db.get('nomstatut') || 'Aucune activité définie';
        let activitytype = client.db.get('type') || 'Non défini';
        let activitystatus = client.db.get('presence') || 'en ligne';
        const color = client.color || client.config.default_color;
        let langue = client.db.get('langue') || 'fr';
        const prefix = client.prefix || client.config.prefix;
        const buyers = await Promise.all(client.config.buyers.map(async buyer => {
            const user = await client.users.fetch(buyer);
            return user.tag;
        })) || 'Aucun acheteur défini';
            switch (activitytype) {
            case 'PLAYING':
                activitytype = 'Joue à';
                break;
            case 'STREAMING':
                activitytype = 'En stream';
                break;
            case 'LISTENING':
                activitytype = 'Écoute';
                break;
            case 'WATCHING':
                activitytype = 'Regarde';
                break;
            default:
                activitytype = 'En ligne';
            }

            switch (autoupdate) {
                case 'on':
                    autoupdate = 'Activé';
                    break;
                case 'off':
                    autoupdate = 'Désactivé';
                    break;
                default:
                    autoupdate = 'Désactivé';
            }

            switch (langue) {
                case 'en':
                    langue = 'Anglais';
                    break;
                case 'fr':
                    langue = 'Français';
                    break;
                default:
                    langue = 'Langue inconnue';
            }

        const embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setFooter(client.footer)
            .setTitle('Paramètres du bot')
            .setTimestamp()
            .addFields(
                { name: 'Acheteurs', value: `\`${buyers.join('`,`')}\``, inline: true , inline: true },
                { name: 'Mise à jour automatique', value: `\`${autoupdate}\`` , inline: true },
                { name: 'Version', value: `\`${version}\`` , inline: true },
                { name: 'Nom de l\'activité', value: `\`${activityname}\`` , inline: true },
                { name: 'Type d\'activité', value: `\`${activitytype}\`` , inline: true },
                { name: 'Statut', value: `\`${activitystatus}\`` , inline: true },
                { name: 'Couleur', value: `\`${color}\`` , inline: true },
                { name: 'Langue', value: `\`${langue}\`` , inline: true },
                { name: 'Préfixe', value: `\`${prefix }\``, inline: true}
                );

        return message.channel.send({ embeds: [embed] });
    }
}
