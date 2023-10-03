const { EmbedBuilder } = require('discord.js');
const ms = require('ms')

module.exports = {
    name: 'tempban',
    description: 'Bannit temporairement un utilisateur du serveur.',
    usage: `tempban <user> <temps> <raison>`,
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
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.reply(`\`❌\` Aucune personne trouvée !`)

        let temps = args[1]
        let raison = args.slice(2).join(' ')
        if (!raison) raison = "Aucune raison"
        if (isNaN(ms(temps))) return message.reply("Veuillez indiquer une durée pour le tempban !")

        member.ban({
            reason: `Banni par ${message.author.tag} pendant ${temps} pour **${raison}**`,
            days: 0
        }).catch(() => false)

        const embed = new EmbedBuilder()
        .setDescription(`${member} a été temporairement banni par ${message.author.tag} pendant ${temps} pour: ${raison}`)
        .setFooter(client.footer)
        .setColor(client.color)

        message.channel.send({embeds: [embed]})

        setTimeout(() => {
            message.guild.members.unban(member, `Fin du tempban de ${member.tag}`).catch(() => false)
        }, ms(temps));
    }
}