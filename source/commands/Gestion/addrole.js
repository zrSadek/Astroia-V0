const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: "addrole",
    description: "Permet d'ajouter un r�le � un membre.",
    usages: "addrole <membre> <nom-du-r�le>",
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

        if (args.length < 2) {
            return message.channel.send("Usage incorrect. Utilisation correcte : addrole <membre> <nom-du-r�le>");
        }

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            member = message.guild.members.cache.get(args[0]);
            if (!member) {
                return message.channel.send("Membre introuvable sur le serveur.");
            }
        }

        const roleName = args.slice(1).join(" ");
        const role = message.guild.roles.cache.find(role => role.name === roleName);
        if (!role) {
            return message.channel.send("Rôle introuvable sur le serveur.");
        }

        if (member.roles.cache.has(role.id)) {
            return message.channel.send(`${member.user.tag} a déjà le rôle ${roleName}.`);
        }

        try {
            await member.roles.add(role);
            message.channel.send(`${member.user.tag} vient de recevoir le rôle : ${roleName}.`);
        } catch (error) {
            console.error(error);
            message.channel.send("Une erreur vient de se produire.");
        }
    }
}
