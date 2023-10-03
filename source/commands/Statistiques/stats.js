const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'stats',
    description: 'Affiche les stats d\'un membre.',
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

            const member = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null) || message.author;
            if (!member) {
                return message.reply('Membre introuvable.');
              }
              const guild = message.guild.id
              const userId = member.id
              const messagecount = client.db.get(`message_${guild}_${userId}`) || 0
              const vocal = client.db.get(`vocal_${guild}_${userId}`) || 0
              const vocaltemps = formattemps(vocal);
              const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle('Stats de ' + member.tag)
              .setDescription(`\`💭\` | Message : \`${messagecount}\`\n\`🔊\` | Vocal : \`${vocaltemps}\``)
              .setFooter(client.footer)

              return message.channel.send({embeds: [embed]})
        
    }
};


function formattemps(temps) {
    let time;

    if (temps < 60) {
        time = `${temps} secondes`;
    } else if (temps < 3600) {
        const minutes = Math.floor(temps / 60);
        const seconds = temps % 60;
        time = `${minutes} minute${minutes !== 1 ? 's' : ''} et ${seconds} seconde${seconds !== 1 ? 's' : ''}`;
    } else if (temps < 86400) {
        const heures = Math.floor(temps / 3600);
        const minutes = Math.floor((temps % 3600) / 60);
        time = `${heures} heure${heures !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (temps < 31536000) {
        const jours = Math.floor(temps / 86400);
        const heures = Math.floor((temps % 86400) / 3600);
        time = `${jours} jour${jours !== 1 ? 's' : ''}, ${heures} heure${heures !== 1 ? 's' : ''}`;
    } else {
        const années = Math.floor(temps / 31536000);
        const jours = Math.floor((temps % 31536000) / 86400);
        time = `${années} an${années !== 1 ? 's' : ''}, ${jours} jour${jours !== 1 ? 's' : ''}`;
    }

    return time;
}
