const { QueryType, SearchResult } = require("discord-player");
const { useMainPlayer, useQueue } = require("discord-player");
const regex = /(https?:\/\/(?:www\.)?(?:open\.spotify|deezer|soundcloud|music\.apple)\.[a-z\.]+\/[^\s]+)/g;
const Discord = require('discord.js');

module.exports = {
    name: "play",
    description: "Permet de lancer une musique",
    usages: "play <musique>",
    run: async (client, message, args, commandName) => {
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
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
        const channel = message.member.voice.channel;
        const query = args.join(" ");
        if (!channel) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Vous n'êtes pas dans un channel vocal !");
            return message.channel.send({ embeds: [embed] });
        }
        if (queue && queue.channel.id !== channel.id) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Je joue déjà dans un autre salon vocal.");
            return message.channel.send({ embeds: [embed] });
        }
        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription('Je suis déjà dans un autre salon vocal. Veuillez me déplacer ou me faire quitter le salon actuel avant de jouer de la musique.')
            return message.channel.send({ embeds: [embed] });
        }
        if (!channel.viewable) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Je n'ai pas la permission de voir le salon");
            return message.channel.send({ embeds: [embed] });
        }
        if (!channel.joinable) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Je n'ai pas la permission de rejoindre le salon");
            return message.channel.send({ embeds: [embed] });
        }
        if (message.member.voice.channelId !== message.guild.members.me.voice.channelId && channel.full) {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Ce salon vocal est plein !");
            return message.channel.send({ embeds: [embed] });
        }
        let ez = QueryType.YOUTUBE;
        const matches = query.match(regex);
        if (matches) ez = QueryType.AUTO;

        let searchResult = (await player.search(query, {
            requestedBy: message.user,
            searchEngine: ez
        }))
        const embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Je recherche votre musique`)
            .setFooter(client.footer)
        await message.channel.send({ embeds: [embed] })
        let text;
        text = " est en cours de lecture !"
        if (queue || (queue && queue.tracks.data.length > 0)) text = " à été ajouté à la queue !"
        await player.play(channel, searchResult, {
            nodeOptions: {
                metadata: {
                    channel: message.channel,
                    client: message.guild.members.me,
                    requestedBy: message.user,
                },
                selfDeaf: true,
                volume: 50,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            },
        })
            .then((song) => {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setFooter(client.footer)
                    .setDescription(song.track.title + text);
                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel(song.track.title)
                            .setStyle(Discord.ButtonStyle.Link)
                            .setURL(song.track.url)
                    )
                return message.channel.send({ embeds: [embed], components: [row] });
            })
            .catch((e) => {
                if (e.message.includes(`No results found for "[object Object]"`)) {
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setFooter(client.footer)
                        .setDescription("Désolé mais je n'ai pas trouvé votre titre..");
                    return message.channel.send({ embeds: [embed] });
                }
            })
    }
}
