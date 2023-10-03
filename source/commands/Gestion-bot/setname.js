const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: "name",
    description: "Permet de changer le nom du bot",
    usages: "name <nom>",
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

if (pass === false) return message.channel.send(await client.lang(`setname.perm`))

        let name = args.join(" ");
        if(!name) return;
        if(name.length > 32) return message.channel.send(await client.lang(`setname.long`));
        if(name.length < 2) return message.channel.send(await client.lang(`setname.court`));

        client.user.setUsername(name);
        message.channel.send(await client.lang(`setname.succes`));

    
    }
}