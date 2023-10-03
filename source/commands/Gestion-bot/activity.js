const Astroia = require('../../structures/client/index');
const db = require('quick.db')
const Discord = require('discord.js')
module.exports = {
    name: 'activity',
    usage: 'activity [type activiter] [ton status]',
    description: 'Changer le statut du bot',
    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message
     * @param {Discord.args} args
     */
        run: async(client, message, args, commandName) => {
    
            let staff = client.staff
            let pass = false
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
        const prefix = client.config.prefix;
        const activityType = args[0];
        const presence = client.db.get('presence');
        const activityName = args.slice(1).join(' ');
        let activity;

        if (activityType === 'playto' || activityType === 'play') {
            client.user.setPresence({activities: [{name: activityName, type: Discord.ActivityType.Playing, url: "https://twitch.tv/oni145"}], status: presence})
            activity = { name: activityName, type: 'PLAYING' };
        } else if (activityType === 'watch') {
            client.user.setPresence({activities: [{name: activityName, type: Discord.ActivityType.Watching, url: "https://twitch.tv/oni145"}], status: presence})
            activity = { name: activityName, type: 'WATCHING' };
        } else if (activityType === 'listen') {
            client.user.setPresence({activities: [{name: activityName, type: Discord.ActivityType.Listening, url: "https://twitch.tv/oni145"}], status: presence})
            activity = { name: activityName, type: 'LISTENING' };
        } else if (activityType === 'stream') {
            client.user.setPresence({activities: [{name: activityName, type: Discord.ActivityType.Streaming, url: "https://twitch.tv/oni145"}], status: presence})

            activity = { name: activityName, type: 'STREAMING', url: 'https://www.twitch.tv/oni145' };
        } else {
            const messages = await client.lang('activity.invalide');
            const messagesss = messages.replaceAll("{prefix}", `\`${prefix}`);
            return message.channel.send({ content: messagesss, allowedMentions: { repliedUser: false } });
        }

        
        await db.set('nomstatut', activity.name);
        await db.set('type', activity.type);
        const reponse = (await client.lang('activity.set')).replace("{activityType}", `\`${activityType}\``).replace("{activityName}", `\`${activityName}\``)
        await message.channel.send({ content: reponse, allowedMentions: { repliedUser: false } });

    }
};
