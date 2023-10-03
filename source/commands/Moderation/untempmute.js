const Discord = require("discord.js")
getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };
const ms = require("ms");

module.exports = {
    name: "untempmute",
    aliases: ["untimeout"],
    description: 'Permet de retire le mute temporairement un membre du serveur',
    usage: `untempmute <utilisateur/id>`,
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
        try { 
            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])

            await message.guild.members.cache.get(target.id).timeout(null);
            const messae = (await client.lang('untempmute.unmute'))
            .replace("{membre}", target.user.username)
            .replace("{author}", message.author.username)
            message.channel.send({content: messae})

            let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${message.author} ${await client.lang(`untempmute.message1`)} [\`${target.user.username}\`](https://discord.com/users/${target.user.id})` || `${await client.lang(`unban.message2`)}`);

        message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [Embed] });        } catch (erreur) {
            console.log(erreur)
            message.channel.send(await client.lang('erreur'))
        }
        }
    
}