const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: "renew",
    aliases: ["purge"],
    description: "Permet de récréer un salon",
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

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if(!channel) channel = message.channel;

        try {
            channel.clone({reason: `${await client.lang(`renew.message1`)} ${message.author.tag}`}).then(async c => {
                let renewmsg = c.send(`${message.author} ${await client.lang(`renew.message2`)}`)            
                let Embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${message.author} ${await client.lang(`renew.message3`)} [\`${c.name}\`](https://discord.com/channels/${message.guild.id}/${c.id}))**`)
                message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [Embed] })

            })
          channel.delete({ reason: `${await client.lang(`renew.message1`)} ${message.author.tag}` })
        } catch (e) {
            console.log(e)
        }

       



        
    }
}