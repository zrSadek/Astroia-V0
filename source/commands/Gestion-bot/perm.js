const Discord = require('discord.js');
const { bot } = require('../../structures/client');

module.exports = {
    name: "perm",
    description: "Permet de configurer les permissions du bot",
    usages: ["perm <perm1-5> <@role/id>", "perm <permticket-giveaway>"],
        run: async(client, message, args, commandName) => {


        if (!client.config.buyers.includes(message.author.id)) return message.channel.send(await client.lang(`setperm.perm`));

        let perm_ticket = client.db.get(`perm_ticket.${message.guild.id}`);
        let perm_giveaway = client.db.get(`perm_giveaway.${message.guild.id}`);
        let perm_1 = client.db.get(`perm1.${message.guild.id}`);
        let perm_2 = client.db.get(`perm2.${message.guild.id}`);
        let perm_3 = client.db.get(`perm3.${message.guild.id}`);
        let perm_4 = client.db.get(`perm4.${message.guild.id}`);
        let perm_5 = client.db.get(`perm5.${message.guild.id}`);

        let valid_perms = ["perm1", "perm2", "perm3", "perm4", "perm5", "perm_ticket", "perm_gw"];
        let perm_to_edit = args[0];
        let action = args[1];
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);

        if (!valid_perms.includes(perm_to_edit)) return message.channel.send(await client.lang(`setperm.invalide-perm`));
        if (!role) return message.channel.send(await client.lang(`setperm.invalide-role`));

        if (action === "add") {
            let permzz = client.db.get(`${perm_to_edit}.${message.guild.id}`);
            if (!Array.isArray(permzz)) permzz = [];
            if (permzz.includes(role.id)) return message.channel.send(await client.lang(`setperm.role`) + ` \`\`${role.name}\`\` ` + await client.lang(`setperm.perm-deja`) + ` ${perm_to_edit}.`);
            client.db.push(`${perm_to_edit}.${message.guild.id}`, role.id);
            message.channel.send(await client.lang(`setperm.role`) + ` \`\`${role.name}\`\` ` + await client.lang(`setperm.perm-add`));
        }

        if (action === "remove") {
            let permzz = client.db.get(`${perm_to_edit}.${message.guild.id}`);
            if (!Array.isArray(permzz)) permzz = [];
            if (!permzz.includes(role.id)) return message.channel.send(await client.lang(`setperm.role`) + ` \`\`${role.name}\`\` ` + await client.lang(`setperm.perm-role-erreur`) + ` ${perm_to_edit}.`);
            client.db.set(`${perm_to_edit}.${message.guild.id}`, permzz.filter(r => r !== role.id));
            message.channel.send(await client.lang(`setperm.perm-remove`));
        }
    }
};
