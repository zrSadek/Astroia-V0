const Discord = require('discord.js');


module.exports = {
    name: "punition",
    aliases: ["punish"],
    description: "Permet de gérer les punitions des antiraid",
    usage: ["punition all <ban/kick/derank/mute>", "punition [module] <ban/kick/derank/mute>"],


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
        const db = await client.db.get(`punish_${message.guild.id}`) || client.db.set(`punish_${message.guild.id}`, {
            antibot: 'derank',
            antilink: 'mute',
            antispam: 'derank'
        })

        if (args < 2) return message.react('❌')

        let modules = [
            "antibot",
            "antilink",
            "antispam",
        ]

        let sanctions = [
            "kick",
            "ban",
            "derank",
            "mute",
        ]

        let all = args[0] === "all" && sanctions.includes(args[1])
        let module = modules.includes(args[0]) && sanctions.includes(args[1])

        if (all) {
            modules.forEach(async (m) => {
                await client.db.set(`punish_${message.guild.id}`, {
                    antibot: args[1],
                    antilink: args[1],
                    antispam: args[1]
                })
            })
            message.channel.send(`${await client.lang(`punish.message1`)} **${args[1]}**.`)
        }

        if (module) {
            const modules = args[0];
            const sanction = args[1];
            
            if (!db[modules]) {
                return message.channel.send(`Le module "${modules}" n'existe pas.`);
            }
            
            db[modules] = sanction;
            await client.db.set(`punish_${message.guild.id}`, db);
            message.channel.send(`${await client.lang(`punish.message2`)} **__${args[0]}__** ${await client.lang(`punish.message3`)} **${args[1]}**.`)
        }



    }
}