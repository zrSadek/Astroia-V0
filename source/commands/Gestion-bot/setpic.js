const Discord = require('discord.js');

module.exports = {
    name: 'setpic',
    aliases: ["setavatar", "avatar"],
    usages: "setpic <image/lien>",
    description: 'Définit l\'avatar du bot.',
        run: async(client, message, args, commandName) => {
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
            let avatarURL;

            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                avatarURL = attachment.url;
            } else if (args[0]) {
                avatarURL = args[0];
            } else {
                return message.channel.send(await client.lang(`setpic.erreur`));
            }

            try {
                await client.user.setAvatar(avatarURL);
                return message.channel.send(await client.lang(`setpic.succes`));
            } catch (error) {
                console.error('Erreur lors de la mise à jour de l\'avatar du bot :', error);
                return message.channel.send(await client.lang(`setpic.erreur2`));
            }
    },
};
