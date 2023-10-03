const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');
const ms = require('ms');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    name: 'resetbot',
    description: 'supprime toutes les données du bot',
    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message 
     * @param {Array} args
     * 
     **/
    run: async (client, message, args, commandName) => {
        let pass = false
        let staff = client.staff
        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = "oui";
        } else pass = true;

        if (pass === false) {
            if (client.noperm && client.noperm.trim() !== '') {
                return message.channel.send(client.noperm);
            } else {
                return;
            }
        }
        try {

            const buttonvalider = new ButtonBuilder()
                .setLabel('✅')
                .setCustomId('resetbot_valider_' + message.id)
                .setStyle(ButtonStyle.Success)

            const buttonrefuser = new ButtonBuilder()
                .setLabel('❌')
                .setCustomId('resetbot_refuser_' + message.id)
                .setStyle(ButtonStyle.Danger)


            const row = new ActionRowBuilder()
                .addComponents(buttonvalider, buttonrefuser)

                const msg = await message.channel.send({ content: await client.lang('resetbot.message'), components: [row] });
                const collector = message.channel.createMessageComponentCollector({
                  filter: m => m.user.id === message.author.id && m.component.type === Discord.ComponentType.Button,
                  time: ms('2m')
                });
          
                collector.on("collect", async (i) => {
                  if (i.customId === `resetbot_valider_${message.id}`) {
                    const allKeys = client.db.fetchAll();
          
                    allKeys.forEach(key => {
                      client.db.delete(key.ID);
                    });
                    i.update({ content: await client.lang('resetbot.reset'), components: [] });
                  }
          
                  if (i.customId === `resetbot_refuser_${message.id}`) {
                    i.update({ content: await client.lang('resetbot.noreset'), components: [] });
                  }
                });
          
                collector.on('end', async () => {
                  await msg.edit({ components: [] });
                });
            
              } catch (error) {
                message.channel.send(`${await client.lang('resetbot.noreset')} \`\`\`\n" + ${error.message} + '\`\`\``);
              }
            }
          };