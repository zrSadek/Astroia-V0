const Discord = require('discord.js');
const Astroia = require('../../structures/client');
const ms = require('ms')
module.exports = {
  name: "defautroles",
  aliases: ["defautrole", "joinrole", "joinsrole", "joinsroles"],
  description: "Ajoute des rôle a ajouter au role de joins",
  /**
   * @param {Astroia} client 
   * @param {Discord.Message} message
   */
  run: async (client, message, args, commandName) => {

      let pass = false;
      let staff = client.staff;
      if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
          if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
          if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
          if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
          if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
          if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
          if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
      } else {
          pass = true;
      }

      if (pass === false) {
          if (client.noperm && client.noperm.trim() !== '') {
              return message.channel.send(client.noperm);
          } else {
              return;
          }
      }
    let msg = await message.reply({ content: 'Chargement en cours...' })
    async function update() {
      const db = client.db.get(`defautrole_${message.guild.id}`) || {
        status: false,
        role: []
      }
      const status = db?.status === true ? '🟢' : '🔴';
      const role = db?.role;
      const rolename = role ? role.map(roleId => message.guild.roles.cache.get(roleId)?.name || "Inconnu") : [];
      const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setFooter(client.footer)
        .setTitle('Defaut Roles')
        .addFields(
          { name: 'Status', value: `\`\`\`yml\n${status}\`\`\`` },
          { name: "Rôles :", value: `\`\`\`yml\n${rolename.join(', ') || "Aucun rôle défini"}\`\`\`` }
        )

      const rowbutton = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId(`defautrole_active_` + message.id)
            .setEmoji(db?.status === true ? '🟢' : '🔴')
            .setStyle(db?.status === true ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger),
          new Discord.ButtonBuilder()
            .setCustomId(`defautrole_channel_` + message.id)
            .setLabel('Ajouter / Retire des rôles')
            .setStyle(Discord.ButtonStyle.Success),
          new Discord.ButtonBuilder()
            .setCustomId(`defautrole_reset_` + message.id)
            .setLabel('Reset')
            .setStyle(Discord.ButtonStyle.Danger)
        )


      return msg.edit({ embeds: [embed], components: [rowbutton], content: null })
    }
    update()

    const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.Button, time: ms("2m") })
    collector.on("collect", async (i) => {
      if (i.customId === `defautrole_channel_${message.id}`) {
        const rowrole = new Discord.RoleSelectMenuBuilder()
          .setCustomId('defautrole_channel_select_' + message.id)
          .setMaxValues(1)
          .setMaxValues(25);
        const row = new Discord.ActionRowBuilder()
          .addComponents(rowrole);
        const rowbutton = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId('defautrole_channel_retour_' + message.id)
              .setStyle(Discord.ButtonStyle.Danger)
              .setEmoji('◀')
          );
        i.update({ components: [row, rowbutton], embeds: [], content: "Merci de choisir les rôles a ajouter ou a supprimer" })
      }

    })

    client.on('interactionCreate', async (i) => {
      if (i.user.id !== message.author.id) return i.reply({ content: await client.lang('noperminterac'), ephemeral: true });
      if (i.customId === `defautrole_channel_retour_${message.id}`) {
        update()
      } else if (i.customId === `defautrole_active_${message.id}`) {
        let db = client.db.get(`defautrole_${message.guild.id}`);
        const currentStatus = db?.status;
        const newStatus = currentStatus === null ? true : !currentStatus;
        db = { ...db, status: newStatus };
        client.db.set(`defautrole_${message.guild.id}`, db);
        const status = db?.status === true ? 'Le status a été activiter avec succès' : 'Le status a été déactiviter avec succès';
        const reply = await i.reply({ content: status, ephemeral: true });
        setTimeout(async () => {
          await reply.delete();
      }, ms('1s')); 
        update()

      } else if (i.customId === `defautrole_reset_${message.id}`) {
       let reply = await i.reply({content: '`✅` les paramètres ont était bien reset',ephemeral: true})
        client.db.delete(`defautrole_${message.guild.id}`);
        setTimeout(async () => {
          await reply.delete();
      }, ms('1s')); 
        update()
      } else if (i.customId === `defautrole_channel_select_${message.id}`) {
        const selectedRoles = i.values;
        let roledb = client.db.get(`defautrole_${message.guild.id}`);
        if (!roledb) {
          roledb = {
            status: false,
            role: [],
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
            client.db.set(`defautrole_${message.guild.id}`, roledb);
            rolesRemoved++;
          } else {
            existingRoles.push(roleId);
            roledb.role = existingRoles;
            client.db.set(`defautrole_${message.guild.id}`, roledb);
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