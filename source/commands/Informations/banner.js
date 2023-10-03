const { MessageAttachment, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'banner',
    perm: 1,
    description: 'Affiche la bannière d\'un utilisateur en fonction de son ID ou de la mention.',
    usage: '<ID utilisateur ou mention>',
    run: async (client, message, args) => {
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
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!target) {
        return message.channel.send(`Vous devez mentionner un utilisateur ou donner l'identifiant`);
    }
  
    const url = await target.user.fetch().then((user) => user.bannerURL({ format: "png", dynamic: true, size: 4096 }));

    if (!url) {
        return message.channel.send('La bannière de cet utilisateur est introuvable.');
    }


        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setTimestamp()
            .setAuthor({name: `${target.user.tag}`, iconURL: target.user.avatarURL({ format: 'png', size: 4096 })})
            .setImage(url)

        message.channel.send({ embeds: [embed] });
    },
};
