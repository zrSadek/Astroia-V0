const Discord = require('discord.js');

module.exports = {
    name: "antilink",
    description: "Permet de paramétrer l'antilink",
    category: "antiraid",
    usage: ["antilink <on/off/max>", "antilink <allow/deny> <#channel/id>", "antilink <all/invites>"],

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

        const antilinkData = client.db.get(`antilink_${message.guild.id}`) || {
            sanction: ['delete', 'mute', 'message'],
            ignore: [],
            lien: 'all',
            status: 'off'
        };

        if (args[0] === "on") {
            antilinkData.status = "on";
            client.db.set(`antilink_${message.guild.id}`, antilinkData);
            return message.channel.send(`L'antilink est désormais activé.`);
        }

        if (args[0] === "off") {
            antilinkData.status = "off";
            client.db.set(`antilink_${message.guild.id}`, antilinkData);
            return message.channel.send(`L'antilink est désormais désactivé.`);
        }

        if (args[0] === "max") {
            antilinkData.lien = "max";
            client.db.set(`antilink_${message.guild.id}`, antilinkData);
            return message.channel.send(`Le mode "max" de l'antilink est activé.`);
        }

        if (args[0] === "allow" || args[0] === "deny") {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel;
            if (args[0] === "allow") {
                antilinkData.ignore.push(channel.id);
            } else {
                antilinkData.ignore = antilinkData.ignore.filter(id => id !== channel.id);
            }
            client.db.set(`antilink_${message.guild.id}`, antilinkData);
            return message.channel.send(`Le channel ${channel} est ${args[0] === "allow" ? "autorisé" : "interdit"} pour les liens.`);
        }

        if (args[0] === "all" || args[0] === "invites") {
            antilinkData.lien = args[0];
            client.db.set(`antilink_${message.guild.id}`, antilinkData);
            return message.channel.send(`L'antilink est configuré pour ${args[0] === "all" ? "tous les liens" : "les invitations discord"}.`);
        }

        const usageWithPrefix = client.commands.get("antilink").usage.map(use => `\`${client.prefix}${use}\``).join("\n");
        return message.channel.send(`Utilisation incorrecte, utilisations possibles : \n${usageWithPrefix}`);
    }
};
