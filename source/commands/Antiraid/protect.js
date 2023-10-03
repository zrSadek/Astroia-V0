const Discord = require('discord.js');
const { bot } = require('../../structures/client');
const fs = require('fs');
const Astroia = require('../../structures/client');

module.exports = {
    name: "protect",
    aliases: ["secur", "security", "sec", "protections", "protection"],
    description: "Affiche/Configue la sécuriter",
    /**
     * @param {Astroia} client 
     * @param {Discord.Message} message 
     */

    run: async (client, message, args, commandName) => {

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
        // ANTI SPAM
        const antispamData = client.db.get(`antispam_${message.guild.id}`) || { message: 4, temps: 5000, status: 'off' };
        const antispamstatus = antispamData.status === 'on' ? '✅' : antispamData.status === 'off' ? '❌' : antispamData.status === 'max' ? '✅' : '❓';
        const antispamtemps = formatInterval(antispamData.temps)
        const antispamcount = antispamData.message
        //ANTI LINK
        const antilinkData = client.db.get(`antilink_${message.guild.id}`) || { sanction: ['delete', 'mute', 'message'], ignore: [], lien: 'all', status: 'off' };
        const antilinktatus = antilinkData.status === 'on' ? '✅' : antilinkData.status === 'off' ? '❌' : antilinkData.status === 'max' ? '✅' : '❓';
        //ANTIBOT 
        const antibot = client.db.get(`antibot_${message.guild.id}`) || { status: 'off' };
        const antibotstatus = antibot.status === 'on' ? '✅' : antibot.status === 'off' ? '❌' : antibot.status === 'max' ? '✅' : '❓';

        const [setting] = args;

        if (setting) {
            const newSetting = setting.toLowerCase();
            if (['on', 'off', 'max'].includes(newSetting)) {
                antispamData.status = newSetting;
                antilinkData.status = newSetting;
                antibot.status = newSetting;
                try {
                    await client.db.set(`antispam_${message.guild.id}`, antispamData);
                    await client.db.set(`antilink_${message.guild.id}`, antilinkData);
                    await client.db.set(`antibot_${message.guild.id}`, antibot);
                    return message.reply(`Toutes les protections sont maintenant sur \`${newSetting}\`.`);
                } catch (error) {
                    console.error(error);
                    return message.reply("Une erreur s'est produite lors de la mise à jour des paramètres.");
                }
            } else {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setFooter(client.footer)
                    .setTitle(`Protect`)
                    .setDescription(`
**AntiSpam :** [\`${antispamstatus} (${antispamcount}/${antispamtemps})\`](${client.support})
**Antilink :** [\`${antilinktatus} (${antilinkData.lien})\`](${client.support})
**AntiBot  :** [\`${antibotstatus}\`](${client.support})
        `);
                return message.channel.send({ embeds: [embed] });
            }
        } else {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setTitle(`Protect`)
                .setDescription(`
 **AntiSpam :** [\`${antispamstatus} (${antispamcount}/${antispamtemps})\`](${client.support})
**Antilink :** [\`${antilinktatus} (${antilinkData.lien})\`](${client.support})
**AntiBot  :** [\`${antibotstatus}\`](${client.support})
        `);
            return message.channel.send({ embeds: [embed] });
        }
    }}        

function formatInterval(milliseconds) {
    if (isNaN(milliseconds) || milliseconds <= 0) return "Invalid";

    const intervals = [
        { unit: 'w', divisor: 604800000 },
        { unit: 'd', divisor: 86400000 },
        { unit: 'h', divisor: 3600000 },
        { unit: 'm', divisor: 60000 },
        { unit: 's', divisor: 1000 }
    ];

    for (const interval of intervals) {
        const value = Math.floor(milliseconds / interval.divisor);
        if (value >= 1) {
            return `${value}${interval.unit}`;
        }
    }

    return "0s";
}