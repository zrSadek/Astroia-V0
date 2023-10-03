const Discord = require('discord.js')
const Astroia = require('../../structures/client/index')
const ms = require('ms')
module.exports = {
    name: 'change',
    description: 'change une commande de permissions !',
    /**
      * 
      * @param {Astroia} client 
      * @param {Discord.Message} message 
      * @param {Discord.args} args
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

        const commands = client.commands.map(command => ({
            label: command.name,
            emoji: '<:fleche:1110936894931480619>',
            value: command.name,
        }));
        const selectMenus = [];
        let currentMenu = [];
        let menuCounter = 0;
        let perm_public = [];
        let perm_1 = [];
        let perm_2 = [];
        let perm_3 = [];
        let perm_4 = [];
        let perm_5 = [];
        client.commands.forEach((m) => {
            let perm = client.db.get(`perm_${m.name}.${message.guild.id}`);
            if (perm === "public") perm_public.push(m.name);
            else if (perm === "1") perm_1.push(m.name);
            else if (perm === "2") perm_2.push(m.name);
            else if (perm === "3") perm_3.push(m.name);
            else if (perm === "4") perm_4.push(m.name);
            else if (perm === "5") perm_5.push(m.name);
        });

        const msg = await message.channel.send('Chargement en cours...');

        async function updateEmbed() {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setTitle('Change Perms')
                .addFields(
                    { name: 'Perm Public', value: `\`\`\`yml\n${perm_public.length > 0 ? perm_public.map(cmdn => `${cmdn}`).join(", ") : "Aucune commande"}\`\`\``, inline: true },
                    { name: 'Perm 1', value: `\`\`\`yml\n${perm_1.length > 0 ? perm_1.map(cmdn => `${cmdn}`).join(" , ") : "Aucune commande"}\`\`\``, inline: true },
                    { name: 'Perm 2', value: `\`\`\`yml\n${perm_2.length > 0 ? perm_2.map(cmdn => `${cmdn}`).join(" , ") : "Aucune commande"}\`\`\``, inline: true },
                    { name: 'Perm 3', value: `\`\`\`yml\n${perm_3.length > 0 ? perm_3.map(cmdn => `${cmdn}`).join(" , ") : "Aucune commande"}\`\`\``, inline: true },
                    { name: 'Perm 4', value: `\`\`\`yml\n${perm_4.length > 0 ? perm_1.map(cmdn => `${cmdn}`).join(" , ") : "Aucune commande"}\`\`\``, inline: true },
                    { name: 'Perm 5', value: `\`\`\`yml\n${perm_5.length > 0 ? perm_5.map(cmdn => `${cmdn}`).join(" , ") : "Aucune commande"}\`\`\``, inline: true }
                )
            const select = new Discord.StringSelectMenuBuilder()
                .setCustomId('select_perm_' + message.id)
                .setMinValues(1)
                .setMaxValues(1)
                .setOptions(
                    {
                        label: 'Public',
                        value: 'public_' + message.id
                    },
                    {
                        label: 'Permissions 1',
                        value: 'perm1_' + message.id
                    },
                    {
                        label: 'Permissions 2',
                        value: 'perm2_' + message.id
                    },
                    {
                        label: 'Permissions 3',
                        value: 'perm3_' + message.id
                    },
                    {
                        label: 'Permissions 4',
                        value: 'perm4_' + message.id
                    },
                    {
                        label: 'Permissions 5',
                        value: 'perm5_' + message.id
                    }
                )

            const row = new Discord.ActionRowBuilder()
                .addComponents(select)

            msg.edit({ embeds: [embed], content: null, components: [row] })
            
        }
        await updateEmbed();

        const collector = msg.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect, time: ms("2m") })
        collector.on("collect", async (i) => {
            if (i.values[0] === `public_${message.id}`) {
                for (const command of commands) {
                    currentMenu.push(command);
    
                    if (currentMenu.length === 25) {
                        const selectMenu = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`command_public_select_${message.id}_${menuCounter}`)
                            .setMaxValues(25)
                            .setMinValues(1)
                            .setPlaceholder('Sélectionnez une commande...')
                            .addOptions(currentMenu);
    
                        selectMenus.push(selectMenu);
    
                        currentMenu = [];
                        menuCounter++;
                    }
                }
    
                if (currentMenu.length > 0) {
                    const selectMenu = new Discord.StringSelectMenuBuilder()
                        .setMaxValues(25)
                        .setMinValues(1)
                        .setCustomId(`command_public_select_${message.id}_${menuCounter}`)
                        .setMaxValues(currentMenu.length)
    
                        .setPlaceholder('Sélectionnez une commande...')
                        .addOptions(currentMenu);
    
                    selectMenus.push(selectMenu);
                }
    
                const actionRows = [];
          
                for (const selectMenu of selectMenus) {
                    const actionRow = new Discord.ActionRowBuilder()
                        .addComponents(selectMenu)
    
                    actionRows.push(actionRow)
                }
    
                const buttonvalider = new Discord.ButtonBuilder()
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId('change_valide_' + message.id)

                const buttonrefuser = new Discord.ButtonBuilder()
                .setEmoji('✖️')
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId('refuser_valide_' + message.id)

                const actionRowss = new Discord.ActionRowBuilder()
               .addComponents(buttonvalider, buttonrefuser);

    actionRows.push(actionRowss);

                i.reply({
                    content: null,
                    embeds: [],
                    components: actionRows,
                });
            }
            if (i.values[0] === `perm1_${message.id}`) {
                for (const command of commands) {
                    currentMenu.push(command);
    
                    if (currentMenu.length === 25) {
                        const selectMenu = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`command_perm1_select_${message.id}_${menuCounter}`)
                            .setMaxValues(25)
                            .setMinValues(1)
                            .setPlaceholder('Sélectionnez une commande...')
                            .addOptions(currentMenu);
    
                        selectMenus.push(selectMenu);
    
                        currentMenu = [];
                        menuCounter++;
                    }
                }
    
                if (currentMenu.length > 0) {
                    const selectMenu = new Discord.StringSelectMenuBuilder()
                        .setMaxValues(25)
                        .setMinValues(1)
                        .setCustomId(`command_perm1_select_${message.id}_${menuCounter}`)
                        .setMaxValues(currentMenu.length)
    
                        .setPlaceholder('Sélectionnez une commande...')
                        .addOptions(currentMenu);
    
                    selectMenus.push(selectMenu);
                }
    
                const actionRows = [];
          
                for (const selectMenu of selectMenus) {
                    const actionRow = new Discord.ActionRowBuilder()
                        .addComponents(selectMenu)
    
                    actionRows.push(actionRow)
                }
    
                const buttonvalider = new Discord.ButtonBuilder()
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId('change_valide_' + message.id)

                const buttonrefuser = new Discord.ButtonBuilder()
                .setEmoji('✖️')
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId('refuser_valide_' + message.id)

                const actionRowss = new Discord.ActionRowBuilder()
               .addComponents(buttonvalider, buttonrefuser);

    actionRows.push(actionRowss);

                i.reply({
                    content: null,
                    embeds: [],
                    components: actionRows,
                });
            }

            if (i.values[0] === `perm2_${message.id}`) {
                for (const command of commands) {
                    currentMenu.push(command);
    
                    if (currentMenu.length === 25) {
                        const selectMenu = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`command_perm2_select_${message.id}_${menuCounter}`)
                            .setMaxValues(25)
                            .setMinValues(1)
                            .setPlaceholder('Sélectionnez une commande...')
                            .addOptions(currentMenu);
    
                        selectMenus.push(selectMenu);
    
                        currentMenu = [];
                        menuCounter++;
                    }
                }
    
                if (currentMenu.length > 0) {
                    const selectMenu = new Discord.StringSelectMenuBuilder()
                        .setMaxValues(25)
                        .setMinValues(1)
                        .setCustomId(`command_perm2_select_${message.id}_${menuCounter}`)
                        .setMaxValues(currentMenu.length)
    
                        .setPlaceholder('Sélectionnez une commande...')
                        .addOptions(currentMenu);
    
                    selectMenus.push(selectMenu);
                }
    
                const actionRows = [];
          
                for (const selectMenu of selectMenus) {
                    const actionRow = new Discord.ActionRowBuilder()
                        .addComponents(selectMenu)
    
                    actionRows.push(actionRow)
                }
    
                const buttonvalider = new Discord.ButtonBuilder()
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId('change_valide_' + message.id)

                const buttonrefuser = new Discord.ButtonBuilder()
                .setEmoji('✖️')
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId('refuser_valide_' + message.id)

                const actionRowss = new Discord.ActionRowBuilder()
               .addComponents(buttonvalider, buttonrefuser);

    actionRows.push(actionRowss);

                i.reply({
                    content: null,
                    embeds: [],
                    components: actionRows,
                });
            }
            if (i.values[0] === `perm3_${message.id}`) {
                for (const command of commands) {
                    currentMenu.push(command);
    
                    if (currentMenu.length === 25) {
                        const selectMenu = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`command_perm3_select_${message.id}_${menuCounter}`)
                            .setMaxValues(25)
                            .setMinValues(1)
                            .setPlaceholder('Sélectionnez une commande...')
                            .addOptions(currentMenu);
    
                        selectMenus.push(selectMenu);
    
                        currentMenu = [];
                        menuCounter++;
                    }
                }
    
                if (currentMenu.length > 0) {
                    const selectMenu = new Discord.StringSelectMenuBuilder()
                        .setMaxValues(25)
                        .setMinValues(1)
                        .setCustomId(`command_perm3_select_${message.id}_${menuCounter}`)
                        .setMaxValues(currentMenu.length)
    
                        .setPlaceholder('Sélectionnez une commande...')
                        .addOptions(currentMenu);
    
                    selectMenus.push(selectMenu);
                }
    
                const actionRows = [];
          
                for (const selectMenu of selectMenus) {
                    const actionRow = new Discord.ActionRowBuilder()
                        .addComponents(selectMenu)
    
                    actionRows.push(actionRow)
                }
    
                const buttonvalider = new Discord.ButtonBuilder()
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId('change_valide_' + message.id)

                const buttonrefuser = new Discord.ButtonBuilder()
                .setEmoji('✖️')
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId('refuser_valide_' + message.id)

                const actionRowss = new Discord.ActionRowBuilder()
               .addComponents(buttonvalider, buttonrefuser);

    actionRows.push(actionRowss);

                i.reply({
                    content: null,
                    embeds: [],
                    components: actionRows,
                });
            }

            if (i.values[0] === `perm4_${message.id}`) {
                for (const command of commands) {
                    currentMenu.push(command);
    
                    if (currentMenu.length === 25) {
                        const selectMenu = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`command_perm4_select_${message.id}_${menuCounter}`)
                            .setMaxValues(25)
                            .setMinValues(1)
                            .setPlaceholder('Sélectionnez une commande...')
                            .addOptions(currentMenu);
    
                        selectMenus.push(selectMenu);
    
                        currentMenu = [];
                        menuCounter++;
                    }
                }
    
                if (currentMenu.length > 0) {
                    const selectMenu = new Discord.StringSelectMenuBuilder()
                        .setMaxValues(25)
                        .setMinValues(1)
                        .setCustomId(`command_perm4_select_${message.id}_${menuCounter}`)
                        .setMaxValues(currentMenu.length)
    
                        .setPlaceholder('Sélectionnez une commande...')
                        .addOptions(currentMenu);
    
                    selectMenus.push(selectMenu);
                }
    
                const actionRows = [];
          
                for (const selectMenu of selectMenus) {
                    const actionRow = new Discord.ActionRowBuilder()
                        .addComponents(selectMenu)
    
                    actionRows.push(actionRow)
                }
    
                const buttonvalider = new Discord.ButtonBuilder()
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId('change_valide_' + message.id)

                const buttonrefuser = new Discord.ButtonBuilder()
                .setEmoji('✖️')
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId('refuser_valide_' + message.id)

                const actionRowss = new Discord.ActionRowBuilder()
               .addComponents(buttonvalider, buttonrefuser);

    actionRows.push(actionRowss);

                i.reply({
                    content: null,
                    embeds: [],
                    components: actionRows,
                });
            }


            if (i.values[0] === `perm5_${message.id}`) {
                for (const command of commands) {
                    currentMenu.push(command);
    
                    if (currentMenu.length === 25) {
                        const selectMenu = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`command_perm5_select_${message.id}_${menuCounter}`)
                            .setMaxValues(25)
                            .setMinValues(1)
                            .setPlaceholder('Sélectionnez une commande...')
                            .addOptions(currentMenu);
    
                        selectMenus.push(selectMenu);
    
                        currentMenu = [];
                        menuCounter++;
                    }
                }
    
                if (currentMenu.length > 0) {
                    const selectMenu = new Discord.StringSelectMenuBuilder()
                        .setMaxValues(25)
                        .setMinValues(1)
                        .setCustomId(`command_perm5_select_${message.id}_${menuCounter}`)
                        .setMaxValues(currentMenu.length)
    
                        .setPlaceholder('Sélectionnez une commande...')
                        .addOptions(currentMenu);
    
                    selectMenus.push(selectMenu);
                }
    
                const actionRows = [];
          
                for (const selectMenu of selectMenus) {
                    const actionRow = new Discord.ActionRowBuilder()
                        .addComponents(selectMenu)
    
                    actionRows.push(actionRow)
                }
    
                const buttonvalider = new Discord.ButtonBuilder()
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId('change_valide_' + message.id)

                const buttonrefuser = new Discord.ButtonBuilder()
                .setEmoji('✖️')
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId('refuser_valide_' + message.id)

                const actionRowss = new Discord.ActionRowBuilder()
               .addComponents(buttonvalider, buttonrefuser);

    actionRows.push(actionRowss);

                i.reply({
                    content: null,
                    embeds: [],
                    components: actionRows,
                });
            }
        })
        client.on('interactionCreate', async (i) => {
            try {
            if (i.isButton()) {
                if (i.customId === 'change_valide_' + message.id) {
                    await i.message.delete().catch(() => {})
                    await msg.edit(updateEmbed()).catch(() => {}) 
                } else if(i.customId === 'refuser_valide_' + message.id) {
                    await  msg.delete().catch(() => {})
                    await i.message.delete().catch(() => {})
                }
            }
        
            if (i.isStringSelectMenu() && i.customId.startsWith('command_public_select_')) {
                const [menuName, messageId, menuCounter] = i.customId.split('_').slice(2);
                if (messageId === message.id) {
                    const selectedPermissions = i.values;
                    for (const selectedCommand of selectedPermissions) {
                        const permissionKey = `perm_${selectedCommand}.${i.guild.id}`;
                        const existingPermission = await client.db.get(permissionKey);
        
                        if (existingPermission === 'public') {
                            await client.db.delete(permissionKey);
                            const index = perm_public.indexOf(selectedCommand);
                            if (index !== -1) {
                                perm_public.splice(index, 1);
                            }
                        } else {
                            await client.db.set(permissionKey, 'public');
                            perm_public.push(selectedCommand);
                        }
                    }
        
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setFooter(client.footer)
                        .addFields({ name: 'Permissions Public', value: `\`\`\`yml\n${perm_public.length > 0 ? perm_public.join(", ") : "Aucune commande"}\`\`\``, inline: true });
        
                    await i.update({
                        embeds: [embed]
                    });
                    await updateEmbed();
                }
            }
          
            if (i.isStringSelectMenu() && i.customId.startsWith('command_perm1_select_')) {
                const [menuName, messageId, menuCounter] = i.customId.split('_').slice(2);
                if (messageId === message.id) {
                    const selectedPermissions = i.values;
                    for (const selectedCommand of selectedPermissions) {
                        const permissionKey = `perm_${selectedCommand}.${i.guild.id}`;
                        const existingPermission = await client.db.get(permissionKey);
        
                        if (existingPermission === '1') {
                            await client.db.delete(permissionKey);
                            const index = perm_1.indexOf(selectedCommand);
                            if (index !== -1) {
                                perm_1.splice(index, 1);
                            }
                        } else {
                            await client.db.set(permissionKey, '1');
                            perm_1.push(selectedCommand);
                        }
                    }
        
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setFooter(client.footer)
                        .addFields({ name: 'Permissions 1', value: `\`\`\`yml\n${perm_1.length > 0 ? perm_1.join(", ") : "Aucune commande"}\`\`\``, inline: true });
        
                    await i.update({
                        embeds: [embed]
                    });
                    await updateEmbed();
                }
            }
            
            if (i.isStringSelectMenu() && i.customId.startsWith('command_perm2_select_')) {
                const [menuName, messageId, menuCounter] = i.customId.split('_').slice(2);
                if (messageId === message.id) {
                    const selectedPermissions = i.values;
                    for (const selectedCommand of selectedPermissions) {
                        const permissionKey = `perm_${selectedCommand}.${i.guild.id}`;
                        const existingPermission = await client.db.get(permissionKey);
        
                        if (existingPermission === '1') {
                            await client.db.delete(permissionKey);
                            const index = perm_2.indexOf(selectedCommand);
                            if (index !== -1) {
                                perm_2.splice(index, 1);
                            }
                        } else {
                            await client.db.set(permissionKey, '2');
                            perm_2.push(selectedCommand);
                        }
                    }
        
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setFooter(client.footer)
                        .addFields({ name: 'Permissions 2', value: `\`\`\`yml\n${perm_2.length > 0 ? perm_2.join(", ") : "Aucune commande"}\`\`\``, inline: true });
        
                    await i.update({
                        embeds: [embed]
                    });
                    await updateEmbed();
                }
            }
            if (i.isStringSelectMenu() && i.customId.startsWith('command_perm3_select_')) {
                const [menuName, messageId, menuCounter] = i.customId.split('_').slice(2);
                if (messageId === message.id) {
                    const selectedPermissions = i.values;
                    for (const selectedCommand of selectedPermissions) {
                        const permissionKey = `perm_${selectedCommand}.${i.guild.id}`;
                        const existingPermission = await client.db.get(permissionKey);
        
                        if (existingPermission === '3') {
                            await client.db.delete(permissionKey);
                            const index = perm_3.indexOf(selectedCommand);
                            if (index !== -1) {
                                perm_3.splice(index, 1);
                            }
                        } else {
                            await client.db.set(permissionKey, '3');
                            perm_3.push(selectedCommand);
                        }
                    }
        
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setFooter(client.footer)
                        .addFields({ name: 'Permissions 3', value: `\`\`\`yml\n${perm_3.length > 0 ? perm_3.join(", ") : "Aucune commande"}\`\`\``, inline: true });
        
                    await i.update({
                        embeds: [embed]
                    });
                    await updateEmbed();
                }
            }
            if (i.isStringSelectMenu() && i.customId.startsWith('command_perm4_select_')) {
                const [menuName, messageId, menuCounter] = i.customId.split('_').slice(2);
                if (messageId === message.id) {
                    const selectedPermissions = i.values;
                    for (const selectedCommand of selectedPermissions) {
                        const permissionKey = `perm_${selectedCommand}.${i.guild.id}`;
                        const existingPermission = await client.db.get(permissionKey);
        
                        if (existingPermission === '4') {
                            await client.db.delete(permissionKey);
                            const index = perm_3.indexOf(selectedCommand);
                            if (index !== -1) {
                                perm_4.splice(index, 1);
                            }
                        } else {
                            await client.db.set(permissionKey, '4');
                            perm_4.push(selectedCommand);
                        }
                    }
        
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setFooter(client.footer)
                        .addFields({ name: 'Permissions 4', value: `\`\`\`yml\n${perm_4.length > 0 ? perm_4.join(", ") : "Aucune commande"}\`\`\``, inline: true });
        
                    await i.update({
                        embeds: [embed]
                    });
                    await updateEmbed();
                }
            }

            if (i.isStringSelectMenu() && i.customId.startsWith('command_perm5_select_')) {
                const [menuName, messageId, menuCounter] = i.customId.split('_').slice(2);
                if (messageId === message.id) {
                    const selectedPermissions = i.values;
                    for (const selectedCommand of selectedPermissions) {
                        const permissionKey = `perm_${selectedCommand}.${i.guild.id}`;
                        const existingPermission = await client.db.get(permissionKey);
        
                        if (existingPermission === '5') {
                            await client.db.delete(permissionKey);
                            const index = perm_5.indexOf(selectedCommand);
                            if (index !== -1) {
                                perm_5.splice(index, 1);
                            }
                        } else {
                            await client.db.set(permissionKey, '5');
                            perm_5.push(selectedCommand);
                        }
                    }
        
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setFooter(client.footer)
                        .addFields({ name: 'Permissions 5', value: `\`\`\`yml\n${perm_5.length > 0 ? perm_5.join(", ") : "Aucune commande"}\`\`\``, inline: true });
        
                    await i.update({
                        embeds: [embed]
                    });
                    await updateEmbed();
                }
            }
        } catch (err) {
            console.log(err)
        }
        });
    
        collector.on('end', () => {
            msg.delete()
        })
    }
}        