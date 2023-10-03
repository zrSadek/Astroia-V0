const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: "vc",
    description: "Permet de voir les statistiques vocal du serveur",
    /**
     * 
     * @param {Astroia} client 
     * @param {Discord} message 
     * @param {Discord} args 
     */
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
    
        var connectedCount = 0
        var streamingCount = 0
        var mutedCount = 0
        var mutedMic = 0
        var cameraCount = 0
        
        for(const [,channel] of message.guild.channels.cache.filter(c => c.type === 2 || c.type === 13)) {
            for(const [,member] of channel.members) {
                let fetchedMember = await member.fetch().catch(e=>{})
                if(!fetchedMember) continue;
                connectedCount++
                if(fetchedMember.voice.streaming) streamingCount++
                if(fetchedMember.voice.serverDeaf || fetchedMember.voice.selfDeaf) mutedCount++
                if(fetchedMember.voice.serverMute || fetchedMember.voice.selfMute) mutedMic++
                if(fetchedMember.voice.selfVideo) cameraCount++
            }
        }

        let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setTitle(await client.lang(`voicestat.titre`) + ` ${message.guild.name}`)
            .setDescription(`\`🔊\` ${await client.lang(`voicestat.co`)} \`${connectedCount}/${message.guild.memberCount}\`\n\`🔇\` ${await client.lang(`voicestat.mute`)} \`${mutedMic}/${message.guild.memberCount}\`\n\`🎧\` ${await client.lang(`voicestat.mutecasque`)} \`${mutedCount}/${message.guild.memberCount}\`\n\`🎥\` ${await client.lang(`voicestat.cam`)} \`${cameraCount}/${message.guild.memberCount}\`\n\`💻\` ${await client.lang(`voicestat.stream`)} \`${streamingCount}/${message.guild.memberCount}\``)

        message.channel.send({ embeds: [Embed] })
    }
}