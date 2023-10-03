const { useQueue } = require("discord-player");
const Discord = require("discord.js");
const { Astroia } = require('../../structures/client/index')

module.exports = {
    name: "queue",
    description: "Voir les musiques qui vont être jouées",
    /**
     * @param {Astroia} client
     * @param {Astroia} message
     * @param {Astroia} args
     */

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
        if (!queue || !queue.currentTrack) {
            const embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
                .setDescription("Aucune musique en cours !");
            return message.reply({ embeds: [embed] });
        }

        const channel = message.member.voice.channel;
        if (!channel) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Vous n'êtes pas en vocal !");
            return message.reply({ embeds: [embed] });
        }

        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Je suis déjà dans un autre salon vocal !");
            return message.reply({ embeds: [embed] });
        }

        if (!message.guild.members.me.voice) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique en cours de lecture !");
            return message.reply({ embeds: [embed] });
        }

        const currentSong = queue.currentTrack;

        const queueEmbed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle("Queue de " + message.guild.name)
            .setThumbnail(currentSong.thumbnail.url || currentSong.thumbnail)
            .addFields({ name: "Musique Actuelle", value: `\`\`\`js\n${currentSong.title} - (${currentSong.durationFormatted || currentSong.duration})\`\`\`` })
            .addFields({name: `Musique a suivre (${queue.tracks.data.length})`, value: `\`\`\`js\n${queue.tracks.data
                .map((song, id) => `${id} - ${song.raw.title} - (${song.raw.durationFormatted || song.duration})`)
                .slice(1, 11)
                .join('\n')}\`\`\``})
            .setFooter(client.footer);

        await message.reply({ embeds: [queueEmbed] });
    }
};
