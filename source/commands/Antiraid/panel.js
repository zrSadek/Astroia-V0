const Discord = require('discord.js');
const Astroia = require('../../structures/client');
let emoji = {
    on: "🟢",
    chargement: "⌛",
    off: "🔴",
    sanctionon: "❌",
    sanctionoff: "✔",
    moduleon: "🟢",
    moduleoff: "🔴",
}

module.exports = {
    name: "panel",
    description: "Affiche/Configure la sécurité du serveur.",
    /**
     * @param {Astroia} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */

    run: async (client, message, args) => {
        if(!client.staff.includes(message.author.id)){
        if (message.author.id !== message.guild.ownerId) {
            if (!client.owners.includes(message.author.id)) {
                message.reply("Vous n'avez aucune autorisation pour exécuter cette commande.");
                return;
            }
        }
    }
        const db = await client.db.get(`antiraid_${message.guild.id}`) || {
            antiban: {
                sensib: '1/j',
                sanction: [],
                status: false,
                wl: false,
                wlpers: [],
                logsstatus: false,
                logs: ''
            },
            antibot: {
                sanction: [],
                status: false,
                wl: false,
                wlpers: [],
                logs: ''
            },
            antispam: {
                sensib: '1/s',
                sanction: [],
                status: false,
                wl: false,
                wlpers: [],
                logsstatus: false,
                logs: ''
            },
            antilink: {
                sensib: '1/5s',
                sanction: [],
                status: false,
                wl: false,
                wlpers: [],
                logsstatus: false,
                logs: ''
            }
        };


        const msg = await message.channel.send('Merci de patienter...')
        let module = 'antilink'
        update(client, message, msg, module)

    const collector = msg.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: "Eh oh, tu n'es pas autorisé à interagir avec cette interaction !", flags: 64 })
            i.deferUpdate()

            if (i.customId.startsWith('selectwl_')) {
                const module = i.customId.split('_')[1];
                db[module].wl = !db[module].wl;
                await client.db.set(`antiraid_${message.guild.id}`, db);
                update(client, message, msg, module);
                return;
            }

            if (i.customId.startsWith('button_')) {
                const module = i.customId.split('_')[1];
                db[module].status = !db[module].status;
                await client.db.set(`antiraid_${message.guild.id}`, db);
                update(client, message, msg, module)
                return;
            }

            if (i.customId.startsWith('logsbut_')) {
                const module = i.customId.split('_')[1];
                msg.edit({
                    content: null,
                    embeds: [{
                        color: client.color,
                        footer: client.footer,
                        description: emoji.chargement + ' Merci de choisir un channel dans le select menu ci-dessous'
                    }],
                    components: [{
                        type: 1,
                        components: [{
                            type: 8,
                            custom_id: 'selectchannel_' + module,
                            channel_types: [0]
                        }]
                    }]
                })
                return;
            }

            if (i.customId.startsWith('selectchannel_')) {
                const module = i.customId.split('_')[1];
                db[module].logs = i.values[0]
                await client.db.set(`antiraid_${message.guild.id}`, db);
                update(client, message, msg, module)
                return;
            }

            if (i.customId.startsWith('logs_')) {
                const module = i.customId.split('_')[1];
                db[module].logsstatus = !db[module].logsstatus;
                await client.db.set(`antiraid_${message.guild.id}`, db);
                update(client, message, msg, module)
                return;
            }

            const selectedModuleId = i.values[0];

            if (i.customId === 'moduleSelect_' + message.id) {
                const value = db[selectedModuleId].status;
                db[selectedModuleId].status = value;
                update(client, message, msg, selectedModuleId)
      
            } else if (i.customId === 'sensibSelect') {
                const value = i.values[0];
                const module = value.split('_')[1];
                const nom = value.split('_')[0];
                const dbModule = db[module];
                
                if (dbModule) {

                    if(nom === 'Aucune') {
                        dbModule.sanction = [];
                        await client.db.set(`antiraid_${message.guild.id}`, db);
                        update(client, message, msg, module);
                        return;
                    }
                    dbModule.sanction = [];
                    dbModule.sanction.push(nom);
                    
                    await client.db.set(`antiraid_${message.guild.id}`, db);
                    update(client, message, msg, module);
                }
            }})            


            collector.on('end', async (collected) => {
              await msg.edit({ components: [] });
            })
            
            
            
            
    }
};


async function update(client, message, msg, module) {
    const db = await client.db.get(`antiraid_${message.guild.id}`) || {
        antilink: {
            sensib: '1/5s',
            sanction: [],
            status: false,
            wl: false,
            wlpers: [],
            logs: ''
        },
        antibot: {
            sanction: [],
            status: false,
            wl: false,
            wlpers: [],
            logs: ''
        },
        antiban: {
            sensib: '1/j',
            sanction: [],
            status: false,
            wl: false,
            wlpers: [],
            logs: ''
        },
        antispam: {
            sensib: '1/s',
            sanction: [],
            status: false,
            wl: false,
            wlpers: [],
            logsstatus: false,
            logs: ''
        },
    };
    const selectedModuleInfo = db[module];
    let modulename;
    switch (module) {
        case 'antiban':
            modulename = 'AntiBan';
            break;
            case 'antibot':
                modulename = 'AntiBot';
                break;
        case 'antilink':
            modulename = 'AntiLink';
            break;
        case 'antispam':
            modulename = 'AntiSpam';
            break;
        default:
            modulename = 'Erreur...';
            break;
    }

    const status = selectedModuleInfo?.status === true ? `${emoji.on}` : `${emoji.off}`;
    const etat = selectedModuleInfo?.status === true ? `🟢` : `❌`;
    const statuslogs = selectedModuleInfo?.logsstatus === true ? `🟢` : `❌`;
    const moduleOptions = Object.keys(db).map(module => {
        const modules = db[module];
        const etat = modules.status === true ? emoji.moduleon : emoji.moduleoff;
        return {
            label: module,
            value: module,
            emoji: etat,
            description: 'Paramètre le module  ' + module,
            customId: `module_${module}`,
        };
    });

    const moduleSelect = new Discord.StringSelectMenuBuilder()
        .setCustomId('moduleSelect_' + message.id)
        .setMaxValues(1)
        .setDisabled(false)
        .setPlaceholder('Sélectionnez un module')
        .addOptions(moduleOptions);

        const selectwl = new Discord.StringSelectMenuBuilder()
        .setCustomId('selectwl_' + module)
        .setPlaceholder('Sélectionnez une action')
        .setMaxValues(1)
        .setDisabled(false)
        .addOptions(
            {
                label: 'Sytème de Wl du bot',
                emoji: selectedModuleInfo?.wl === true ? emoji.moduleon : emoji.moduleoff,
                value: 'sytemewl_' + module
            }
        );

    const sensibOptions = ['Ban', 'Kick', 'Mute', 'Derank', "Aucune"];

    const sensibSelect = new Discord.StringSelectMenuBuilder()
        .setCustomId('sensibSelect')
        .setPlaceholder('Sélectionnez une sanction')
        .setMaxValues(1)
        .setDisabled(false)
        .addOptions(
            sensibOptions.map((option) => ({
                label: option,
                value: option + '_' + module,
                emoji: selectedModuleInfo.sanction.includes(option) ? emoji.sanctionoff : emoji.sanctionon,
            }))
        );

    const buttonpower = new Discord.ButtonBuilder()
        .setCustomId('button_' + module)
        .setEmoji(status)
        .setDisabled(false)
        .setStyle(selectedModuleInfo?.status === true ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger)

    const logs = new Discord.ButtonBuilder()
        .setCustomId('logs_' + module)
        .setLabel('Logs')
        .setDisabled(false)
        .setStyle(Discord.ButtonStyle.Secondary)


    const button = new Discord.ActionRowBuilder().addComponents(buttonpower, logs)
    if (selectedModuleInfo.logsstatus) {
        const logsbutton = new Discord.ButtonBuilder()
            .setCustomId('logsbut_' + module)
            .setLabel('Salon')
            .setDisabled(false)
            .setStyle(Discord.ButtonStyle.Primary);

        button.addComponents(logsbutton);
    }

    const embed = new Discord.EmbedBuilder()
    .setColor(client.color)
    .setTitle(status + ' ' + modulename)
    .setFooter(client.footer)
    .addFields(
        { name: 'Configurations', value: `\`\`\`js\nEtat : ${etat}\nLogs Etat : ${statuslogs}\`\`\`` },
        { name: 'White List', value: `\`\`\`js\nSystème de White List : ${selectedModuleInfo.wl ? '🟢' : "❌"}\`\`\`` }
    )

if (await selectedModuleInfo.logsstatus) {
    const channel = message.guild.channels.cache.get(selectedModuleInfo.logs);
    embed.addFields(
        { name: 'Logs', value: `\`\`\`yml\n${channel ? channel.name : "Aucun Assosier"} - (${channel ? channel.id : "Aucun Assosier"})\`\`\`` }
    )
}

if (selectedModuleInfo.sanction && selectedModuleInfo.sanction.length > 0) {
    embed.addFields(
        { name: 'Sanction', value: `\`\`\`yml\n${selectedModuleInfo.sanction.join(', ')}\`\`\`` }
    );

}

    const row1 = new Discord.ActionRowBuilder().addComponents(moduleSelect);
    const row2 = new Discord.ActionRowBuilder().addComponents(selectwl);
    const row3 = new Discord.ActionRowBuilder().addComponents(sensibSelect);
    await msg.edit({ content: null, embeds: [embed], components: [row1, row2, row3, button] });
}