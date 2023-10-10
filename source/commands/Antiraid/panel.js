const Discord = require('discord.js');
const Astroia = require('../../structures/client');
let emoji = {
    on: '<:on:1161248347659702312>',
    off: '<:off:1161248292533981274>',
    sanctionon: '<:1127800357897121872:1161342748595585024>',
    sanctionoff: '<:sanctionoff:1161296156433842317>',

    moduleon: '<:sanctionon:1161296281797415024>',
    moduleoff: '<:sanctionoff:1161296156433842317>',
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
        const db = await client.db.get(`antiraid_${message.guild.id}`) || {
            antiban: {
                sensib: '1/j',
                sanction: [],
                status: false,
                wl: 'off',
                wlpers: [],
                logsstatus: false,
                logs: ''
            },
            antispam: {
                sensib: '1/s',
                sanction: [],
                status: false,
                wl: 'off',
                wlpers: [],
                logsstatus: false,
                logs: ''
            },
            antilink: {
                sensib: '1/5s',
                sanction: [],
                status: false,
                wl: 'off',
                wlpers: [],
                logsstatus: false,
                logs: ''
            }
        };


        const msg = await message.channel.send('Attend pd !')
        let module = 'antilink'
        update(client, message, msg, module)


        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };

        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId.startsWith('button_')) {
                const module = i.customId.split('_')[1];
                db[module].status = !db[module].status;
                await client.db.set(`antiraid_${message.guild.id}`, db);
                update(client, message, msg, module)
                return;
            }

            if (i.customId.startsWith('button_')) {
                const module = i.customId.split('_')[1];
                db[module].status = !db[module].status;
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

            if (i.customId.startsWith('logsbutton_')) {
                const module = i.customId.split('_')[1];
                db[module].logsstatus = !db[module].logsstatus;
                await client.db.set(`antiraid_${message.guild.id}`, db);
                update(client, message, msg, module)
                return;
            }

            const selectedModuleId = i.values[0];
            const selectedValue = i.customId === `sensibSelect_${message.id}` ? i.values[0] : null;

            if (i.customId === 'moduleSelect_' + message.id) {
                const value = db[selectedModuleId].status;
                db[selectedModuleId].status = value;
                update(client, message, msg, selectedModuleId)
            } else if (i.customId === 'sensibSelect_' + message.id && selectedValue) {
                const dbModule = db[selectedModuleId];
                if (dbModule) {
                    const index = dbModule.sanction.indexOf(selectedValue);
                    if (index === -1) {
                        dbModule.sanction.push(selectedValue);
                    } else {
                        dbModule.sanction.splice(index, 1);
                    }
                    await client.db.set(`antiraid_${message.guild.id}`, db);
                    update(client, message, msg, dbModule)

                }
            }
        });

        collector.on('end', collected => {
            msg.edit({
                components: []
            })
        });
    }
};


async function update(client, message, msg, module) {
    const db = await client.db.get(`antiraid_${message.guild.id}`) || {
        antiban: {
            sensib: '1/j',
            sanction: [],
            status: false,
            wl: 'off',
            wlpers: [],
            logs: ''
        },
        antispam: {
            sensib: '1/s',
            sanction: [],
            status: false,
            wl: 'off',
            wlpers: [],
            logsstatus: false,
            logs: ''
        },
        antilink: {
            sensib: '1/5s',
            sanction: [],
            status: false,
            wl: 'off',
            wlpers: [],
            logs: ''
        }
    };
    const selectedModuleInfo = db[module];
    console.log(selectedModuleInfo)

    let modulename;
    switch (module) {
        case 'antiban':
            modulename = 'Anti-Ban';
            break;
        case 'antilink':
            modulename = 'Anti-Link';
            break;
        case 'antispam':
            modulename = 'Anti-Spam';
            break;
        default:
            modulename = 'Erreur...';
            break;
    }

    const status = selectedModuleInfo?.status === true ? `${emoji.on}` : `${emoji.off}`;
    const etat = selectedModuleInfo?.status === true ? `🟢` : `❌`;

    const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle(status + ' ' + modulename)
        .setDescription(`- Configurations\n\`\`\`js\nEtat : ${etat}\`\`\``)
        .setFooter(client.footer)
    const moduleOptions = Object.keys(db).map(module => {
        const modules = db[module];
        const etat = modules.status === true ? emoji.moduleon : emoji.moduleoff;
        return {
            label: module.substring(0, 10),
            value: module,
            emoji: etat,
            description: 'Paramètre le module  ' + module,
            customId: `module_${module}`,
        };
    });

    const moduleSelect = new Discord.StringSelectMenuBuilder()
        .setCustomId('moduleSelect_' + message.id)
        .setMaxValues(1)
        .setPlaceholder('Sélectionnez un module')
        .addOptions(moduleOptions);

    const sensibOptions = ['ban', 'kick', 'mute', 'derank', "Aucune"];

    const sensibSelect = new Discord.StringSelectMenuBuilder()
        .setCustomId('sensibSelect_' + message.id)
        .setPlaceholder('Sélectionnez une sanction')
        .setMaxValues(1)
        .addOptions(
            sensibOptions.map((option) => ({

                label: option,
                value: option,
                emoji: option.includes(selectedModuleInfo.sanction) ? emoji.sanctionon : emoji.sanctionoff,
            }))
        );

    const buttonpower = new Discord.ButtonBuilder()
        .setCustomId('button_' + module)
        .setEmoji(status)
        .setStyle(selectedModuleInfo?.status === true ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger)

    const logs = new Discord.ButtonBuilder()
        .setCustomId('logs_' + module)
        .setLabel('Logs')
        .setStyle(Discord.ButtonStyle.Secondary)


    const button = new Discord.ActionRowBuilder().addComponents(buttonpower, logs)
    if (selectedModuleInfo.logsstatus) {
        const logsbutton = new Discord.ButtonBuilder()
            .setCustomId('logsbutton_' + module)
            .setLabel('Salon')
            .setStyle(Discord.ButtonStyle.Primary);

        button.addComponents(logsbutton);
    }
    const row1 = new Discord.ActionRowBuilder().addComponents(moduleSelect);
    const row2 = new Discord.ActionRowBuilder().addComponents(sensibSelect);
    await msg.edit({ content: null, embeds: [embed], components: [row1, row2, button] });
}
