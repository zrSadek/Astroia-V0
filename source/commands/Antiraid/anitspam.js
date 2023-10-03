const { Astroia } = require("../../structures/client/index");
const ms = require('ms');
const Discord = require('discord.js');

module.exports = {
    name: 'antispam',
    description: 'Configure les paramètres de l\'anti-spam.',
    usage: '<on/off/max> | <message max> <intervalle>',
    run: async (client, message, args, commandName) => {
        let pass = false;
        let staff = client.staff;
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

        if (args.length < 1) {
            return message.channel.send(`\`${client.prefix}antispam <on/off/max>\` ou \`${client.prefix}antispam <message max> <intervalle>\``);
        }

        const antispamData = client.db.get(`antispam_${message.guild.id}`) || {
            message: 4,
            temps: 5000,
            status: 'off'
        };

        if (args[0] === 'on') {
            antispamData.status = 'on';
            client.db.set(`antispam_${message.guild.id}`, antispamData);
            return message.channel.send('L\'anti-spam est activé.');
        }

        if (args[0] === 'off') {
            antispamData.status = 'off';
            client.db.set(`antispam_${message.guild.id}`, antispamData);
            return message.channel.send('L\'anti-spam est désactivé.');
        }

        if (args[0] === 'max') {
            antispamData.message = 'max';
            antispamData.temps = 'max';
            client.db.set(`antispam_${message.guild.id}`, antispamData);
            return message.channel.send('Le mode "max" de l\'anti-spam est activé.');
        }

        const maxMessages = parseInt(args[0]);
        const interval = parseInterval(args[1]);
    

        if (isNaN(maxMessages) || maxMessages <= 0 || isNaN(interval) || interval <= 0) {
            return message.channel.send(`Veuillez fournir des valeurs numériques valides, exemple : \`${client.prefix}antispam 1 1s\`.`);
        }

        antispamData.message = maxMessages;
        antispamData.temps = interval;
        client.db.set(`antispam_${message.guild.id}`, antispamData);

        return message.channel.send(`Paramètres de l'anti-spam mis à jour : Message Max = ${maxMessages}, Intervalle = ${args[1]}`);
    },
};

function parseInterval(input) {
    const intervalRegex = /^(\d+)([smhdw])$/;
    const match = input.match(intervalRegex);
    if (!match) return NaN;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000; 
        case 'm': return value * 60000; 
        case 'h': return value * 3600000; 
        case 'd': return value * 86400000; 
        case 'j': return value * 86400000;
        case 'w': return value * 604800000; 
        default: return NaN;
    }
}
