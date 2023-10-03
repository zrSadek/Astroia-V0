const ms = require('ms');
const Discord = require('discord.js')
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuComponent, ComponentType } = require('discord.js');

module.exports = {
    name: 'variable',
    aliases: ['variables'],
    description: 'Permet de voir les variable du bot !',
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
        const embed = new EmbedBuilder()
            .setTitle(`Variable`)
            .setColor(client.color)
            .setFooter(client.footer)
            .addFields({ name: '`Invite`', value: 'joins settings / leave settings' })
        const select = new StringSelectMenuBuilder()
            .setCustomId(`variable_` + message.id)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Invite',
                    value: 'invite_' + message.id,
                },

            ])

        const roworig = new ActionRowBuilder()
            .addComponents(select);

        message.channel.send({ content: null, components: [roworig], embeds: [embed] });


        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: ComponentType.StringSelect || ComponentType.Button, time: ms("2m") })

        collector.on("collect", async (i) => {
            if (i.values[0] === `invite_${message.id}`) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('Variable Invite')
                    .setFooter(client.footer)
                    .addFields(
                        { name: '`{user.id}`', value: 'L\'ID du membre qui a rejoint le serveur.', inline: false },
                        { name: '`{user.tag}`', value: 'Le tag du membre qui a rejoint le serveur.', inline: false },
                        { name: '`{user.username}`', value: 'Le username du membre qui a rejoint le serveur.', inline: false },
                        { name: '`{user}`', value: 'Mention du membre qui a rejoint le serveur.', inline: false },
                        { name: '`{inviter.id}`', value: 'L\'ID du membre qui a invité le membre.', inline: false },
                        { name: '`{inviter.username}`', value: 'Le username du membre qui a invité le membre.', inline: false },
                        { name: '`{inviter.tag}`', value: 'Le tag du membre qui a invité le membre.', inline: false },
                        { name: '`{inviter}`', value: 'Mention du membre qui a invité le membre.', inline: false },
                        { name: '`{inviter.total}`', value: 'Le nombre total d\'invitations de l\'inviteur.', inline: false },
                        { name: '`{inviter.valid}`', value: 'Le nombre d\'invitations valides de l\'inviteur.', inline: false },
                        { name: '`{inviter.invalide}`', value: 'Le nombre d\'invitations invalide de l\'inviteur.', inline: false },
                        { name: '`{inviter.bonus}`', value: 'Le nombre d\'invitations bannus de l\'inviteur.', inline: false },
                        { name: '`{guild.name}`', value: 'Le nom du serveur.', inline: false },
                        { name: '`{guild.id}`', value: 'L\'ID du serveur.', inline: false },
                        { name: '`{guild.count}`', value: 'Le nombre total de membres sur le serveur.', inline: false }
                    );
                i.update({ embeds: [embed] })

            }
        })
    }
}


