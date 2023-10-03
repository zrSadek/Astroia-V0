const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: 'langue',
    description: 'Change la langue du bot',
    usages: "langue <fr/en>",
    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message
     * @param {Array} args
     * 
     **/
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
        const langCode = args[0];

        const dblangue = client.db.get(`langue`)

        if(dblangue === langCode) {
            message.channel.send(`${await client.lang('langue.deja')} \`${dblangue}\``)
            return; 
        }
        if (!langCode) {
            return message.channel.send(await client.lang('langue.erreurs')).catch(() => {});
        }

        if (!isValidLanguage(langCode)) {
            return message.channel.send(await client.lang('langue.invalide')).catch(() => {});
        }

        client.db.set('langue', langCode);
        const response = (await client.lang('langue.set')).replace("{langCode}", `\`${langCode}\``)
        return message.channel.send({content: response}).catch(() => {});
    }
};

function isValidLanguage(langCode) {
    const validLanguages = ["fr", "en"];
    return validLanguages.includes(langCode);
}
