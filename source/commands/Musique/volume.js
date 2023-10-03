const { useQueue, useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "volume",
    description: "Modifie le volume de la musique en cours de lecture.",
    run: async (client, message, args) => {
        let pass = false
        let staff = client.staff
        if(!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true){
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true; 
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;   
        } else pass = true;
        
        if (pass === false) {
        if (client.noperm && client.noperm.trim() !== '') {
            return message.channel.send(client.noperm);
        } else {
            return; 
        }
    }
        const queue = useQueue(message.guild.id);
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setFooter(client.footer);

        if (!queue || !queue.currentTrack) {
            embed.setDescription("Il n'y a pas de musique en cours de lecture !");
            message.reply({ embeds: [embed] });
            return;
        }

        const volumeValue = parseFloat(args[0]);

        if (isNaN(volumeValue) || volumeValue < 1 || volumeValue > 100) {
            embed.setDescription("Merci de donner un chiffre entre 1 et 100 pour le volume.");
            message.reply({ embeds: [embed] });
            return;
        }

        const channel = message.member.voice.channel;

        if (!channel) {
            embed.setDescription("Vous n'êtes pas connecté à un salon vocal !");
            message.reply({ embeds: [embed] });
            return;
        }

        if (queue.channel.id !== channel.id) {
            embed.setDescription("Je joue déjà dans un autre salon vocal.");
            embed.setColor(client.color);
            message.reply({ embeds: [embed] });
            return;
        }

        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
            embed.setDescription("Je suis déjà dans un autre salon vocal.");
            message.reply({ embeds: [embed] });
            return;
        }

        queue.node.setVolume(volumeValue);

        embed.setDescription(`Volume réglé sur ${volumeValue}%`);
        embed.setColor(client.color);
        message.reply({ embeds: [embed] });
    }
};
