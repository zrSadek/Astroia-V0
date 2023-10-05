const Discord = require('discord.js');
const fs = require('fs');
const {Astroia} = require('../../structures/client/index')
module.exports = {
    name: "help",
    description: "Affiche les commandes du bot",
    /**
     * 
     * @param {Astroia} client 
     * @param {Astroia} message 
     * @param {Astroia} args 
     * @param {Astroia} commandName 
     * @returns 
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
        let color = client.color;
        let footer = client.footer;
        let prefix = client.prefix;
        const help = client.db.get(`sethelp_${message.guild.id}`) || "onepage";
        if (args.length === 0) {
           
            if (help === 'onepage') {
                const commandFolders = fs.readdirSync('./source/commands');
                const formattedCategories = [];
        
                for (const folder of commandFolders) {
                    const commandFiles = fs.readdirSync(`./source/commands/${folder}`).filter(file => file.endsWith('.js'));
                    const categoryCommands = [];
        
                    for (const file of commandFiles) {
                        const command = require(`../${folder}/${file}`);
                        categoryCommands.push(`${command.name}`);
                    }
        
                    formattedCategories.push(`[\`${folder}\`](${client.support})\n\`${categoryCommands.join('\`, \`')}\``);
                }
        
                const embed = new Discord.EmbedBuilder()
                    .setColor(color)
                    .setTitle('Help')
                    .setDescription(formattedCategories.join('\n\n'))
                    .setFooter(footer);
        
                message.channel.send({ embeds: [embed] });
            } else if (help === 'select') {
                const commandFolders = fs.readdirSync('./source/commands');
                const selectMenuOptions = [];

                for (const folder of commandFolders) {
                    const commandFiles = fs.readdirSync(`./source/commands/${folder}`).filter(file => file.endsWith('.js'));
                    const options = [];

                    for (const file of commandFiles) {
                        const command = require(`../${folder}/${file}`);
                        options.push({
                            label: command.name,
                            description: command.description || 'Aucune description pour le moment',
                            value: command.name
                        });
                    }

                    selectMenuOptions.push({
                        label: folder,
                        value: folder,
                        options: options
                    });
                }

                const selectMenu = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('help-select-menu' + message.id)
                            .setPlaceholder('Choisir une catégorie')
                            .addOptions(selectMenuOptions)
                    );

                const embed = new Discord.EmbedBuilder()
                    .setColor(color)
                    .setDescription('Veuillez choisir une catégorie de commande ci-dessous.');

                const reply = await message.reply({ embeds: [embed], components: [selectMenu] });

                const filter = i => i.customId === 'help-select-menu' + message.id && i.user.id === message.author.id;
                const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

                collector.on('collect', async (interaction) => {
                    if (!interaction.isStringSelectMenu()) return;

                    const [folder] = interaction.values;
                    const commandFiles = fs.readdirSync(`./source/commands/${folder}`).filter(file => file.endsWith('.js'));

                    const commandsList = commandFiles.map(file => {
                        const command = require(`../${folder}/${file}`);
                        return `\`${prefix}${command.name}\`\n${command.description || "Aucune description pour le moment"}`;
                    }).join('\n');

                    const embed = new Discord.EmbedBuilder()
                        .setColor(color)
                        .setFooter(footer)
                        .setTitle(`${folder}`)
                        .setDescription(commandsList);

                    interaction.update({ embeds: [embed], components: [selectMenu] });
                });
            }
        }

        if (args.length !== 0) {
            const cmdname = args[0]
            console.log(client.commands.get(cmdname))
            const command = client.commands.get(cmdname) || client.commands.find((cmd) => cmd.aliases.includes(cmdname));
            if (!command) {
                return message.reply(`Cette commande n'existe pas. Utilisez \`${prefix}help\` pour voir la liste des commandes.`);
            }
            const perm = client.db.get(`perm_${commandName}.${message.guild.id}`)
            const permissions = await perms(perm)
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Information de \`${command.name}\``)
                .setColor(color)
                .setFooter(footer)
                .setDescription(`
            \`${prefix}${command.name}\`
            ┖ **Description :** \`${command.description || "Aucune description pour le moment"}\`
            ┖ **Utilisation :** \`${command.usage ? prefix + command.usage : "Aucun Usage."}\`
            ┖ **Aliase :** \`${command.aliases ? command.aliases.join("` / `") : "Aucune aliase"}\`
            ┖ **Permission :** \`${permissions}\``);

            message.channel.send({ embeds: [embed] });
        }
    }
}


async function perms(command) {
    switch (command) {
        case '1': return 'Permission 1'; 
        case '2': return 'Permission 2'; 
        case '3': return 'Permission 3'; 
        case '4': return 'Permission 4'; 
        case '5': return 'Permission 5'; 
        case 'ticket': return 'Permission Ticket'; 
        case 'Giveaway': return 'Permission Giveaway';
        default: return 'Aucune';
    }
}
