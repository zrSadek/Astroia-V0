const ms = require('ms');
const Discord = require('discord.js')
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuComponent } = require('discord.js');

module.exports = {
    name: 'leavesettings',
    description: 'Permet de configurer le syteme de leave du bot',
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
        const originalmsg = await message.channel.send('Chargement en cours...');

        async function updateEmbed() {
            const db = client.db.get(`leavesettings_${message.guild.id}`) || client.db.set(`leavesettings_${message.guild.id}`,
                {
                    channel: null,
                    message: null,
                    status: false
                })     
            const status = db?.status === true ? '✅ Activer' : "❌ Désactiver";
            const channel = message.guild.channels.cache.get(db.channel);
            const channels = `${db.channel ? channel.name : "Aucun channel"} - ID ${db.channel ? channel.name : "Aucun channel"}`
            const messages = db?.message || "Aucune message";
            const embed = new EmbedBuilder()
                .setTitle(`Panel Leave Settings`)
                .setColor(client.color)
                .setFooter(client.footer)
                .addFields(
                    { name: "Statut :", value: `\`\`\`yml\n${status}\`\`\`` },
                    { name: "Salon :", value: ` \`\`\`yml\n${channels || "Aucun channel"}\`\`\`` },
                    { name: "Message :", value: `\`\`\`yml\n${messages}\`\`\`` }
                )


            const select = new StringSelectMenuBuilder()
                .setCustomId(`leave_setup_` + message.id)
                .setMaxValues(1)
                .addOptions([
                    {
                        label: 'Status',
                        value: 'status_' + message.id,
                    },
                    {
                        label: 'Salon',
                        value: 'salon_' + message.id,
                    },
                    {
                        label: 'Message',
                        value: 'message_' + message.id,
                    },
                  
                ])

            const roworig = new ActionRowBuilder()
                .addComponents(select);
            originalmsg.edit({ content: null, components: [roworig], embeds: [embed] });
        }
        await updateEmbed();

        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect || Discord.ComponentType.Button, time: ms("2m") })

        collector.on("collect", async (i) => {
            const db = client.db.get(`leavesettings_${message.guild.id}`)
            if(i.values[0] === `status_${message.id}`) {
                let missingOptions = [];

                if (!db) {
                    missingOptions.push("erreur");
                } else {
                    if (db.channel === null) {
                        missingOptions.push("Le channel");
                    }
                    if (db.message === null) {
                        missingOptions.push("le message");
                    }
                    if (missingOptions.length === 0) {
                        if (db.hasOwnProperty('status')) {
                            const currentStatus = db.status;
                            const newStatus = !currentStatus;
                            db.status = newStatus;
                            client.db.set(`leavesettings_${message.guild.id}`, db);
                            const status = db?.status === true ? 'Le joinsettings a été activé avec succès' : 'Le joinsettings a été désactivé avec succès';
                    
                            const reply = await i.reply({ content: status, ephemeral: true });
                            setTimeout(async () => {
                                await reply.delete();
                            }, 2000); 
                            
                            await updateEmbed();
                        }                                          
                        
                    }  else {
                    const missingOptionsString = missingOptions.map(option => `- \`${option}\``).join('\n');
                    i.reply({ embeds: [], components: [], content: `Le paramétrage du joinsettings n'est pas fini. Voici ce qu'il reste à configurer :\n${missingOptionsString}`, ephemeral: true });
                }
                }
        } else if (i.values[0] === `salon_${message.id}`) {
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ChannelSelectMenuBuilder()
                    .setChannelTypes(0)
                    .setMinValues(1)
                        .setCustomId('leave_setup_salon_' + message.id)
                )
                i.reply({ embeds: [], content: 'Merci de choisir votre channel !', components: [salonrow] })

            } else if (i.values[0] === 'message_' + message.id) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply(`Quel sera le message de bienvenue ? (Variable \`${client.prefix}variable\`)`);

                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const msg = collected.first().content.trim();
                    if (db.hasOwnProperty('message')) {
                        db.message = msg;
                        client.db.set(`leavesettings_${message.guild.id}`, db);
                        await updateEmbed();


                        sentMessage.delete();
                        collected.first().delete();
                    } else {
                        message.reply('Une erreur vient de se produire')
                        sentMessage.delete();
                        collected.first().delete();
                    }
                } catch (error) {
                    sentMessage.delete();
                    console.log(error)
                    message.channel.send("Temps de réponse expiré ou une erreur s'est produite.");
                }
            }
        })

        client.on('interactionCreate', async (i) => {
            if (message.author.id === i.user.id) {
                const db = client.db.get(`leavesettings_${message.guild.id}`)
      
                if (i.customId === `leave_setup_salon_${message.id}`) {
                    const salon = i.values[0];
                    if (db.hasOwnProperty('channel')) {
                        db.channel = salon
                        client.db.set(`leavesettings_${message.guild.id}`, db);
                    } else {
                        client.db.set(`leavesettings_${message.guild.id}`, db);
                    }
                    await updateEmbed()
                    i.message.delete()
                }
            }

        })
    }
}


