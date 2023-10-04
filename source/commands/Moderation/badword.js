const Discord = require('discord.js');
const ms = require('ms')
module.exports = {
    name: "badword",
    description: "Config la badword",
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
        } else pass = true;

        if (pass === false) {
            if (client.noperm && client.noperm.trim() !== '') {
                return message.channel.send(client.noperm);
            } else {
                return;
            }
        }
        const originalmsg = await message.channel.send('Chargement en cours...');


        async function update() {
            const db = client.db.get(`badword_${message.guild.id}`) || client.db.set(`badword_${message.guild.id}`, {
                mots: []
            })
            const mot = db.mots.map((mot, index) => `${index + 1}. ${mot}`).join('\n');
           

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle('BadWord')
                .setDescription('```yml\n' + (mot || 'Aucun pour le moment') + '```')
                .setFooter(client.footer)

            const button = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('plus_' + message.id)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel('➕'),
                new Discord.ButtonBuilder()
                    .setCustomId('corbeil_' + message.id)
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('🗑'),
                new Discord.ButtonBuilder()
                    .setCustomId('moins_' + message.id)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel('➖')
            )
            originalmsg.edit({ content: null, components: [button], embeds: [embed] });
        }
        await update();
        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, time: ms("2m") })


        collector.on("collect", async (i) => {
            const db = client.db.get(`badword_${message.guild.id}`, {
                mots: []
            });
            if (i.customId === `plus_${message.id}`) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply('Quel mot faut-il ajouter à la BadWord ?');
                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const msgs = collected.first().content.trim();
                    db.mots.push(msgs);
                    client.db.set(`badword_${message.guild.id}`, db);
                        sentMessage.delete();
                        collected.first()?.delete();
                        await update();
                } catch (erreur) {
                    console.error(erreur);
                    sentMessage.delete();
                    collected.first()?.delete();
                    update();
                    message.reply('Une erreur est survenue.');
                }
            }
            if (i.customId === `moins_${message.id}`) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply('Quel mot faut-il retirer de la BadWord ?');
                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
                    const motARetirer = collected.first().content.trim();
                     const index = db.mots.indexOf(motARetirer);
                    if (index !== -1) {
                        db.mots.splice(index, 1);
                        client.db.set(`badword_${message.guild.id}`, db);
        
                        sentMessage.delete();
                        collected.first()?.delete();
                        await update();
                    } else {
                        sentMessage.delete();
                        collected.first()?.delete();
                        update();
                        message.reply('Ce mot n\'est pas dans la liste.');
                    }
                } catch (erreur) {
                    console.error(erreur);
                    sentMessage.delete();
                    collected.first()?.delete();
                    update();
                    message.reply('Une erreur est survenue.');
                }
            }
        
            if (i.customId === `corbeil_${message.id}`) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply('Êtes-vous sûr de vouloir vider complètement la liste des mots interdits ? Répondez avec "oui" pour confirmer ou "non" pour annuler.');
        
                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
                    const reponse = collected.first().content.trim().toLowerCase();
        
                    if (reponse === 'oui') {
                        db.mots = [];
                        client.db.set(`badword_${message.guild.id}`, db);
        
                        sentMessage.delete();
                        collected.first()?.delete();
                        await update();
        
                        message.reply('La liste des mots interdits a été vidée.');
                    } else {
                        sentMessage.delete();
                        collected.first()?.delete();
                        update();
                        message.reply('La liste des mots interdits n\'a pas été modifiée.');
                    }
                } catch (erreur) {
                    console.error(erreur);
                    sentMessage.delete();
                    collected.first()?.delete();
                    update();
                    message.reply('Une erreur est survenue.');
                }
            }

        })
    }
}