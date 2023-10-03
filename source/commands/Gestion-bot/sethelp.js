const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: "sethelp",
    description: "Permet de definir le help sur [ select / onepage ].",
    aliases: ["setuphelp"],
       /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message
     * 
     **/
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

    let help = args[0];
    

    if (!help || (help !== 'select' && help !== 'onepage')) {
        return message.channel.send('Veuillez mentionner un type help valide `select / onepage`');
    }

    client.db.set(`sethelp_${message.guild.id}`, help)
    
    message.channel.send(`Le mode du help a été modifié en \`${help}\``)




}
}