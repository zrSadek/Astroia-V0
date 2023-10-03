const { useQueue, useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { Astroia } = require('../../structures/client/index')
module.exports = {
    name: "pause",
    description: "Met en pause la musique",
    /**
     * @param {Astroia} client
     * @param {Astroia} message
     */

    run: async (client, message) => {
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

        if (!queue || !queue.currentTrack) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique n'est en cours...");
                return message.reply({ embeds: [embed] });
        }

        const channel = message.member.voice.channel;
        if (!channel) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Vous n'êtes pas connecté à un salon vocal !");
            return message.reply({ embeds: [embed] });
        }

        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Je suis actuellement dans le salon <#"+ message.guild.members.me.voice.channelId + ">, donc merci de me rejoindre !");
            return message.reply({ embeds: [embed] });
        }

        if (!message.guild.members.me.voice) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique n'est en cours...");
            return message.reply({ embeds: [embed] });
        }

        if (queue.node.isPaused()) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("La musique étant déjà en pause, je ne pourrais pas la relancer !");
            return message.reply({ embeds: [embed] });
        }

        queue.node.pause();

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setDescription("La musique est actuellement en pause.");
        return message.reply({ embeds: [embed] });
    }
};
