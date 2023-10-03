const ms = require('ms');
const Discord = require('discord.js')
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuComponent } = require('discord.js');

module.exports = {
    name: 'soutien',
    description: 'Permet de configurer le syteme de soutien',
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

        const originalmsg = await message.channel.send(await client.lang('soutien.chargement'));

        async function updateEmbed() {
            const db = client.db.get(`soutien_${message.guild.id}`) || client.db.set(`soutien_${message.guild.id}`,
                {
                    name: null,
                    role: [],
                    status: false
                })
            const status = db?.status === true ? await client.lang('soutien.embed.actif') : await client.lang('soutien.embed.desact');
            let namesoutien = db.name
            const role = db?.role;
            const rolename = role
            ? await Promise.all(role.map(async (roleId) => (await message.guild.roles.fetch(roleId))?.name || await client.lang('soutien.inconnue.inconnue')))
            : [];
        
            const embed = new EmbedBuilder()
                .setTitle(await client.lang('soutien.embed.titre'))
                .setColor(client.color)
                .setFooter(client.footer)
                .addFields(
                    { name: await client.lang('soutien.embed.status'), value: `\`\`\`yml\n${status}\`\`\`` },
                    { name: await client.lang('soutien.embed.statusperso'), value: ` \`\`\`yml\n${namesoutien || await client.lang('soutien.inconnue.nostatus')}\`\`\`` },
                    { name: await client.lang('soutien.embed.role'), value: `\`\`\`yml\n${rolename.join(', ') || await client.lang('soutien.inconnue.norole')}\`\`\`` }

                )

            const buttonreset = new Discord.ButtonBuilder()
                .setCustomId('soutien_reset_' + message.id)
                .setLabel(await client.lang('soutien.embed.reset'))
                .setEmoji('⚠️')
                .setStyle(Discord.ButtonStyle.Danger)

            const select = new StringSelectMenuBuilder()
                .setCustomId(`soutien_setup_` + message.id)
                .setMaxValues(1)
                .addOptions([
                    {
                        label: await client.lang('soutien.embed.select.status'),
                        value: 'status_' + message.id,
                    },
                    {
                        label: await client.lang('soutien.embed.select.statusperso'),
                        value: 'statusperso_' + message.id,
                    },
                    {
                        label: await client.lang('soutien.embed.select.role'),
                        value: 'role_' + message.id,
                    },

                ])

            const roworig = new ActionRowBuilder()
                .addComponents(select);


            const rowbutton = new ActionRowBuilder()
                .addComponents(buttonreset);

            originalmsg.edit({ content: null, components: [roworig, rowbutton], embeds: [embed] });
        }
        await updateEmbed();

        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect || Discord.ComponentType.Button, time: ms("2m") })

        collector.on("collect", async (i) => {
            const db = client.db.get(`soutien_${message.guild.id}`)
            if (i.values[0] === `status_${message.id}`) {
                let missingOptions = [];

                if (!db) {
                    missingOptions.push(await client.lang('soutien.collector.status.nostatus'));
                } else {
                    if (db.role === null) {
                        missingOptions.push(await client.lang('soutien.collector.status.role'));
                    }
                    if (db.name === null) {
                        missingOptions.push(await client.lang('soutien.collector.status.perso'));
                    }
                    if (missingOptions.length === 0) {
                        if (db.hasOwnProperty('status')) {
                            const currentStatus = db.status;
                            const newStatus = !currentStatus;
                            db.status = newStatus;
                            client.db.set(`soutien_${message.guild.id}`, db);
                            const status = db?.status === true ? await client.lang('soutien.collector.status.actif') : await client.lang('soutien.collector.status.desact');

                            const reply = await i.reply({ content: status, ephemeral: true });
                            setTimeout(async () => {
                                await reply.delete();
                            }, 2000);

                            await updateEmbed();
                        }

                    } else {
                        const missingOptionsString = missingOptions.map(option => `- \`${option}\``).join('\n');
                        i.reply({ embeds: [], components: [], content: `${await client.lang('soutien.collector.status.personalise')}\n${missingOptionsString}`, ephemeral: true });
                    }
                }
            } else if (i.values[0] === `role_${message.id}`) {
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.RoleSelectMenuBuilder()
                        .setCustomId('soutien_setup_role_' + message.id)
                        .setMaxValues(25)
                )
                i.reply({ embeds: [], content: await client.lang('soutien.collector.role.selectcontent'), components: [salonrow] })

            } else if (i.values[0] === 'statusperso_' + message.id) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply(await client.lang('soutien.collector.statusperso.question'));

                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const msg = collected.first().content.trim();
                    if (db.hasOwnProperty('name')) {
                        db.name = msg;
                        client.db.set(`soutien_${message.guild.id}`, db);
                        await updateEmbed();


                        sentMessage.delete();
                        collected.first().delete();
                    } else {
                        message.reply(await client.lang('soutien.collector.statusperso.erreur'))
                        sentMessage.delete();
                        collected.first().delete();
                    }
                } catch (error) {
                    sentMessage.delete();
                    console.log(error)
                    message.channel.send(await client.lang('soutien.collector.statusperso.temps'));
                }
            }
        })

        client.on('interactionCreate', async (i) => {
            if (message.author.id === i.user.id) {
                const db = client.db.get(`soutien_${message.guild.id}`)
                if (i.customId === `soutien_reset_${message.id}`) {
                    client.db.delete(`soutien_${message.guild.id}`)
                    i.reply({ embeds: [], content: await client.lang('soutien.reset'), ephemeral: true })
                    await updateEmbed()

                }
                if (i.customId === `soutien_setup_role_${message.id}`) {
                    const rolee = i.values;
                    if (db.hasOwnProperty('role')) {
                        db.role = rolee
                        client.db.set(`soutien_${message.guild.id}`, db);
                    } else {
                        client.db.set(`soutien_${message.guild.id}`, db);
                    }
                    await updateEmbed()
                    i.message.delete()
                }
            }

        })
    }
}


