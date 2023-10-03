const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: "rolereact",
    description: "Attribuer un rôle à partir d'une réaction ou d'un bouton personnalisé.",
        /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message 
     * @param {Array} args
     * 
     **/
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
        message.channel.send('Commande en maintenance.')
        /*
        
        const originalmsg = await message.channel.send('Chargement en cours...');

        async function Update() {
            const embed = new Discord.EmbedBuilder()
            .setTitle('Reactrole')
            .setFields(
                {name: "Message ID", value: `\`Aucun\``, inline: false},
                {name: "Type", value: `\`button\``, inline: false},
                {name: "Emoji", value: `\`Aucun\``},
                {name: "Texte (si bouton)", value: `\`Aucun\``},
            )
            .setColor(client.color);


            const roworig = new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId(`reactrole_` + message.id)
                    .addOptions([
                        {
                            label: 'Message ID',
                            value: 'message_' + message.id,
                        },
                        {
                            label: 'Type',
                            value: 'type_' + message.id,
                        },
                        {
                            label: 'Emoji',
                            value: 'emoji_' + message.id,
                        },
                    ])
            );

        
        }

        message.channel.send({embeds: [embed], components: [roworig]})

        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect, time: ms("2m") })

        collector.on("collect", async (interaction) => {
            if(interaction.value[0] === 'message_' + message.id) {
                interaction.reply(`Quel est l'identifiant du message auquel il doit y avoir le react-role ?`)
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    collected.first().delete();
                    interaction.deleteReply();
                    embed.setTitle(collected.first().content)
                    msgembed.edit({ embeds: [embed] });
                }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
            }
        })

        collector.on('end', () => {
            originalmsg.edit({ components: []});
        });*/
    }
}