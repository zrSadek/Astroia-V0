const { lyricsExtractor } = require ('@discord-player/extractor');
const {EmbedBuilder} = require("discord.js")

module.exports = {
    name: "lyrics",
    description: "Rechercher les paroles d'un titre !",
    usages: "lyrics <musique>",
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
const lyricsFinder = lyricsExtractor();

const lyrics = await lyricsFinder.search(args.join(" ")).catch(() => null);
if (!lyrics) return message.channel.send({ content: 'Les paroles ne sont pas disponible pour ce titre !' });

const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

const embed = new EmbedBuilder()
    .setTitle(lyrics.title)
    .setURL(lyrics.url)
    .setThumbnail(lyrics.thumbnail)
    .setAuthor({
        name: lyrics.artist.name,
        iconURL: lyrics.artist.image,
        url: lyrics.artist.url
    })
    .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
    .setColor(client.color);

return message.channel.send({ embeds: [embed] });

}}