const Discord = require('discord.js');
const Astroia = require('../../structures/client');

module.exports = {
    name: "wl",
    aliases: ["whitelist"],
    description: "Permet de gérer la whitelist",
    category: "botcontrol",
    usage: ["wl <utilisateur>", "wl clear", "wl"],
    /**
     * @param {Astroia} client 
     * @param {Discord.Message} message
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


if (!args[0]) {
    let wlz = client.db.get(`wl.${message.guild.id}`);
    let wl;
  
    if (!wlz || wlz.length === 0) {
      wl = await client.lang(`wl.aucun`);
      message.channel.send(wl);
    } else {
      wl = wlz.map(a => `<@${a}>`).join("\n");
      let embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle(`Whitelist`)
        .setDescription(`${wl}`)
        .setFooter(client.footer);
      message.channel.send({ embeds: [embed] });
    }
  }
  

    if (message.mentions.members.size > 0 || client.users.cache.get(args[0])) {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member || !message.guild.members.cache.has(member.id)) {
            return message.channel.send(await client.lang('tempmute.invalidemembre'));
        }      

        client.db.push(`wl.${message.guild.id}`, member.id)
        client.db.set(`wlmd_${message.guild.id}_${member.id}`, true)
        message.channel.send(`**${member.user.username}** ${await client.lang(`wl.message1`)}`)

    } else if(args[0] === "clear") {
        let data = await client.db.all().filter(data => data.ID.startsWith(`wlmd_${message.guild.id}`));
        client.db.set(`wl.${message.guild.id}`, [])
        message.channel.send(`${data.length === undefined||null ? 0:data.length} ${data.length > 1 ? `${await client.lang(`wl.message2`)}`: `${await client.lang(`wl.message3`)}`} ${await client.lang(`wl.message4`)}`)

   
        let count = 0;
        for(let i = 0; i < data.length; i++) {
          client.db.delete(data[i].ID);
          count++;
        }    

    }


    }
}