const { useQueue } = require("discord-player");
const { EmbedBuilder } = require('discord.js');
const { Astroia } = require('../../structures/client/index')
module.exports = {
    name: "skip",
    description: "Passe la musique actuelle",
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
                .setDescription("Il n'y a pas de musique en cours de lecture");
            return message.reply({ embeds: [embed] });
        }

        if (queue && queue.tracks.data.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique après celle-ci !");
            return message.reply({ embeds: [embed] });
        }

        const channel = message.member.voice.channel;

        if (!channel) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Vous n'êtes pas en vocal !");
            return message.reply({ embeds: [embed] });
        }

        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Je suis déjà dans un autre salon vocal !");
            return message.reply({ embeds: [embed] });
        }

        if (!message.guild.members.me.voice) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique lancée !");
            return message.reply({ embeds: [embed] });
        }

        queue.node.skip();

        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setFooter(client.footer)
        .setDescription("La musique a bien été passée je vous laisse profiter de la musique !");
        return message.reply({ embeds: [embed] });
    }
}
