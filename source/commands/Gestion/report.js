const Discord = require('discord.js');
const Astroia = require('../../structures/client');
const ms = require('ms')
module.exports = {
  name: "report",
  description: "Permet de configurer le système de report",
  /**
   * @param {Astroia} client 
   * @param {Discord.Message} message
   */
  run: async (client, message, args, commandName) => {

    let pass = false

    let staff = client.staff
    if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
      if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
      if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
      if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
      if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
      if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
      if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
    } else pass = true;

    if (pass === false) {
      if (client.noperm && client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
      } else {
        return;
      }
    }
    let msg = await message.reply({ content: 'Chargement en cours...' })
    async function update() {
      const db = client.db.get(`report_${message.guild.id}`) || {
        status: false,
        role: [],
        channel: null
      }
      const channelName = client.channels.cache.get(db.channel)?.name || "Aucun défini";
      const status = db?.status === true ? '🟢' : '🔴';
      const role = db?.role;
      const rolename = role ? role.map(roleId => message.guild.roles.cache.get(roleId)?.name || "Inconnu") : [];
      const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setFooter(client.footer)
        .setTitle('Report Système')
        .addFields(
          { name: 'Status', value: `\`\`\`yml\n${status}\`\`\`` },
          { name: "Rôles :", value: `\`\`\`yml\n${rolename.join(', ') || "Aucun rôle défini"}\`\`\`` },
          { name: "Channel :", value: `\`\`\`yml\n${channelName || "Aucun défini"}\`\`\`` }

        )

      const rowbutton = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId(`report_active_` + message.id)
            .setEmoji(db?.status === true ? '🟢' : '🔴')
            .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
            .setCustomId(`report_role_` + message.id)
            .setLabel('Ajouter / Retire des rôles')
            .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
            .setCustomId(`report_channel_` + message.id)
            .setLabel('Channel')
            .setStyle(Discord.ButtonStyle.Secondary),
        )


      return msg.edit({ embeds: [embed], components: [rowbutton], content: null })
    }
    update()

    const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.Button, time: ms("2m") })
    collector.on("collect", async (i) => {
      if (i.customId === `report_role_${message.id}`) {
        const rowrole = new Discord.RoleSelectMenuBuilder()
          .setCustomId('report_role_select_' + message.id)
          .setMaxValues(1)
          .setMaxValues(25);
        const row = new Discord.ActionRowBuilder()
          .addComponents(rowrole);
        const rowbutton = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId('report_role_retour_' + message.id)
              .setStyle(Discord.ButtonStyle.Danger)
              .setEmoji('◀')
          );
        i.update({ components: [row, rowbutton], embeds: [], content: "Merci de choisir les rôles a ajouter ou a supprimer" })
      } else if (i.customId === `report_channel_${message.id}`) {
        const rowrole = new Discord.ChannelSelectMenuBuilder()
          .setCustomId('report_channel_select_' + message.id)
          .setMaxValues(1)
          .setChannelTypes(['GuildText'])
          .setMaxValues(1);
        const row = new Discord.ActionRowBuilder()
          .addComponents(rowrole);
        const rowbutton = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId('report_role_retour_' + message.id)
              .setStyle(Discord.ButtonStyle.Danger)
              .setEmoji('◀')
          );
        i.update({ components: [row, rowbutton], embeds: [], content: "Merci de choisir le channel." })
      }

    })

    client.on('interactionCreate', async (i) => {
      if (i.user.id !== message.author.id) return i.reply({ content: await client.lang('noperminterac'), ephemeral: true });
      if (i.customId === `report_role_retour_${message.id}`) {
        update()
      } else if (i.customId === `report_active_${message.id}`) {
        let db = client.db.get(`report_${message.guild.id}`);
        const currentStatus = db?.status;
        const newStatus = currentStatus === null ? true : !currentStatus;
        db = { ...db, status: newStatus };
        client.db.set(`report_${message.guild.id}`, db);
        const status = db?.status === true ? 'Le status a été activiter avec succès' : 'Le status a été déactiviter avec succès';
        const reply = await i.reply({ content: status, ephemeral: true });
        setTimeout(async () => {
          await reply.delete();
        }, ms('1s'));
        update()

      } else if (i.customId === `report_reset_${message.id}`) {
        let reply = await i.reply({ content: '`✅` les paramètres ont était bien reset', ephemeral: true })
        client.db.delete(`report_${message.guild.id}`);
        setTimeout(async () => {
          await reply.delete();
        }, ms('1s'));
        update()
      
      } else if (i.customId === `report_channel_select_${message.id}`) {
        const selectchannel = i.values[0];
        const dbchannel = client.db.get(`report_${message.guild.id}`);

        dbchannel.channel = selectchannel;
        client.db.set(`report_${message.guild.id}`, dbchannel);
        i.reply({ content: `Le channel sera donc : ` + client.channels.cache.get(selectchannel)?.name || "Unknow Channel", ephemeral: true });

        update()

      }
      else if (i.customId === `report_role_select_${message.id}`) {
        const selectedRoles = i.values;
        let roledb = client.db.get(`report_${message.guild.id}`);
        if (!roledb) {
          roledb = {
            status: false,
            role: [],
            channel: null
          };
        }

        const existingRoles = roledb.role || [];

        let rolesAdded = 0;
        let rolesRemoved = 0;
        let invalidRoles = 0;
        let inaccessibleRoles = 0;

        for (const roleId of selectedRoles) {
          const role = message.guild.roles.cache.get(roleId);

          if (!role) {
            invalidRoles++;
            continue;
          }

          if (role.managed) {
            inaccessibleRoles++;
            continue;
          }

          if (!role.editable) {
            inaccessibleRoles++;
            continue;
          }

          if (existingRoles.includes(roleId)) {
            const updatedRoles = existingRoles.filter(id => id !== roleId);
            roledb.role = updatedRoles;
            client.db.set(`report_${message.guild.id}`, roledb);
            rolesRemoved++;
          } else {
            existingRoles.push(roleId);
            roledb.role = existingRoles;
            client.db.set(`report_${message.guild.id}`, roledb);
            rolesAdded++;
          }
        }

        let response = '';

        if (rolesAdded > 0) {
          response += `Rôles Ajoutés : \`${rolesAdded} rôles\`\n`;
        }
        if (rolesRemoved > 0) {
          response += `Rôles Retirés : \`${rolesRemoved} rôles\`\n`;
        }
        if (invalidRoles > 0) {
          response += `Rôles Invalides : \`${invalidRoles} rôles\`\n`;
        }
        if (inaccessibleRoles > 0) {
          response += `Rôles Inaccessibles : \`${inaccessibleRoles} rôles\`\n`;
        }

        i.reply({ content: response, ephemeral: true });
        update()
      }
    });


    collector.on('end', () => {
      msg.edit({ components: [] });
    });
  }
}