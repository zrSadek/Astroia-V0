const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "change",
    aliases: [],
    description: "Permet de changer la permission d'une commande",
    usages: "change <nom de la commande> <1-5>",
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
        let perms = ["public", "1", "2", "3", "4", "5"];

        if (args[0] === "remove") {
            let cmd = client.commands.get(args[1]) || client.commands.get(client.aliases.get(args[1]));
        
            if (!cmd) {
                return message.channel.send("Commande introuvable.");
            }
        
            client.db.delete(`perm_${cmd.name}.${message.guild.id}`);
            message.channel.send(`La permission de la commande \`${cmd.name}\` a été réinitialisée.`);
        } else if (args[0] === "reset") {
            client.commands.forEach(async (cmd) => {
                client.db.delete(`perm_${cmd.name}.${message.guild.id}`);
            });
        
            message.channel.send("Toutes les autorisations des commandes ont été réinitialisées.");
        } else if (args[0] !== "reset" && args[0] !== "remove") {
            let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
            let perm = args[1];
        
            if (!cmd) {
                return message.channel.send("Commande introuvable.");
            }
        
            if (!perms.includes(perm)) {
                return message.channel.send(`Permission invalide. Les permissions valides sont : \`\`\`yml\n${perms.join(", ")}\`\`\``);
            }
        
            client.db.set(`perm_${cmd.name}.${message.guild.id}`, perm);
            message.channel.send(`La permission de la commande \`${cmd.name}\` a été définie sur \`${perm}\`.`);
        }
    }}        