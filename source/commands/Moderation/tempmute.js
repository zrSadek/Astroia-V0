const Discord = require("discord.js")
getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };
const ms = require("ms");

module.exports = {
    name: 'tempmute',
    aliases: ["timeout"],
    description: 'Permet de mute temporairement un membre du serveur',
    usage: `tempmute <utilisateur/id> <temps> [raison]`,
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
        const tempmutemember = args[0]
        if (!tempmutemember) return message.reply({content: await client.lang('tempmute.membre')});
            const duration = args[1];
            if (!duration) return message.channel.send(await client.lang('tempmute.duréé'));
            if (!ms(duration)) return message.channel.send(await client.lang('tempmute.invalidetemps'))
            if (ms(duration) > 2419200000) return message.channel.send(await client.lang('tempmute.temps'));
    
            if (!duration.endsWith("s") && !duration.endsWith("h") && !duration.endsWith("d") && !duration.endsWith("m")) return message.channel.send(await client.lang('tempmute.invalideforma'))
            
            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const reason = args.slice(2).join(" ");
            
            if (!target || !message.guild.members.cache.has(target.id)) {
                return message.channel.send(await client.lang('tempmute.invalidemembre'));
            }            
            await target.timeout(ms(duration), reason);
            const messae = (await client.lang('tempmute.mute')).replace('{membre}', target.user.username).replace('{duration}', duration).replace('{raison}', reason || await client.lang('tempmute.aucuneraison'));
            await message.channel.send({content: messae})
            setTimeout(async () => {
                await target.timeout(0, await client.lang('tempmute.raison'));
                const messae = (await client.lang('tempmute.unmute'))
                .replace("{membre}", target.user.username)
                .replace("{duration}", duration)
                message.channel.send({content: messae})
            }, ms(duration));
        
        let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${message.author} ${await client.lang(`tempmute.message1`)} [\`${target.user.username}\`](https://discord.com/users/${target.user.id}) **${duration}** ${await client.lang(`tempmute.message2`)} \`${reason || await client.lang(`tempmute.aucuneraison`)}\`` || `${await client.lang(`unban.message2`)}`);

        message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [Embed] });

        } catch (error) {
            if(error.code === 50013) {
                message.reply(await client.lang('tempmute.impossible'))
                return;
            }
            console.log(error)

            message.channel.send(await client.lang('erreur'))
    }
}
    }