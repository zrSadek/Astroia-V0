const Discord = require('discord.js');
const ms = require("ms")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js")
const Badges = {
    'HypeSquadOnlineHouse1': "HypeSquad Bravery",
    'HypeSquadOnlineHouse2': "HypeSquad Brilliance",
    'HypeSquadOnlineHouse3': "HypeSquad Balance",
    'HypeSquadEvents': "HypeSquad Event",
    'ActiveDeveloper': 'Active Developer',
    'BugHunterLeve1': 'Bug Hunter Level 1',
    'EarlySupporter': 'Early Supporter',
    'VerifiedBotDeveloper': 'Verified Bot Developer',
    'EarlyVerifiedBotDeveloper': "Early Verified Bot Developer",
    'VerifiedBot': "Verified Bot",
    'PartneredServerOwner': "Partnered Server Owner",
    'Staff': "Discord Staff",
    'System': "Discord System",
    'BugHunterLevel2': 'Bug Hunter Level 2',
    'BugHunterLevel3': 'Bug Hunter Level 3',
};

module.exports = {
    name: "userinfo",
    aliases: ["ui"],
    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message
     * 
     **/
    description: "Permet d'obtenir des informations sur un utilisateur",
    usages: "userinfo <utilisateur>",
    run: async (client, message, args, commandName) => {

        let pass = false

        let staff = client.staff

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
}        let target;
        if (message.mentions.members.first()) {
            target = message.mentions.members.first();
        } else if (args[0]) {
            try {
                target = await message.guild.members.fetch(args[0]);
            } catch (error) {
                return message.channel.send(await client.lang(`userinfo.introuvable`));
            }
        } else {
            target = message.member;
        }

        const user = target.user;
        const member = target;

        let roles = member?.roles.cache.map(r => r.toString()).join(' ');
        if (roles && member.roles.cache.size > 5) {
            roles = await client.lang(`userinfo.message7`);
        }


        let rolebutton = member?.roles.cache.map(r => r.toString()).join(' ');

        const badges = user.flags.toArray();
        let hasBadges = false;
        let userBadges = [];

        for (const badge of badges) {
            if (Badges[badge]) {
                hasBadges = true;
                userBadges.push(Badges[badge]);
            }
        }

        if (user.avatar.startsWith('a_')) {
            hasBadges = true;
            userBadges.push('Nitro');
        }

        let status = member.presence.status;
        switch (status) { case 'online': status = '🟢 En ligne'; break; case 'idle': status = '🌙 Inactif'; break; case 'dnd': status = '⛔ Ne pas déranger'; break; default: status = '⚫ Hors ligne'; }
        let statusperso = member.presence.activities[0]?.state || await client.lang(`userinfo.message8`);
        if (statusperso === null) {
            statusperso = "Aucune activité";
        }

        const platforms = Object.keys(member.presence.clientStatus).filter(
            key => ['online', 'dnd', 'idle', 'offline'].includes(member.presence.clientStatus[key])
          );
      
          const platformString = platforms.map(platform => {
            if (platform === 'desktop') return '`🖥️ Computer`';
        if (platform === 'mobile') return '`📱 Phone`';
            return '`🌐 Web`';
          }).join(', ');
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Informations sur ${user.username}`)
            .setThumbnail(user.avatarURL())
            .addFields(
                { name: await client.lang(`userinfo.username`), value: '\`' + user.username + '\`', inline: false },

                { name: await client.lang(`userinfo.id`), value: '\`' + user.id + '\`', inline: false },

                { name: `${await client.lang(`userinfo.badge`)} [` + userBadges.length + "]", value: `\`${userBadges.join('\`, \`')}\`` || await client.lang(`userinfo.message10`), inline: false },

                { name: await client.lang(`userinfo.bot`), value: user.bot ? '\`✅\`' : '\`❌\`', inline: false },

                { name: await client.lang(`userinfo.usercreate`), value: `<t:${Math.floor(user.createdAt / 1000)}:F> (<t:${Math.floor(user.createdAt / 1000)}:R>)`, inline: false },

                { name: await client.lang(`userinfo.userjoin`), value: `<t:${Math.floor(member.joinedAt / 1000)}:F> (<t:${Math.floor(member.joinedAt / 1000)}:R>)`, inline: false },

                { name: await client.lang(`userinfo.message1`), value: `\`${statusperso}\``, inline: false },

                { name: await client.lang(`userinfo.message2`), value: `\`${status}\``, inline: false },

                { name: await client.lang(`userinfo.message3`), value: platformString, inline: false },

                { name: `${await client.lang(`userinfo.role`)} [${member.roles.cache.size}]`, value: roles ?? await client.lang(`userinfo.message9`), inline: false },

            )
            .setFooter(client.footer)
            .setImage(user.bannerURL({ format: 'png', size: 4096 }))
            .setTimestamp()


        const row = new ActionRowBuilder()
            .addComponents(
                (
                    new ButtonBuilder()
                        .setCustomId('userinfo_allrole_' + message.id)
                        .setLabel(await client.lang(`userinfo.message4`))
                        .setStyle(Discord.ButtonStyle.Primary)
                ),
                (
                    new ButtonBuilder()
                        .setCustomId('userinfo_badge_' + message.id)
                        .setLabel(await client.lang(`userinfo.message5`))
                        .setStyle(Discord.ButtonStyle.Success)
                ),
                (
                    new ButtonBuilder()
                        .setURL('https://discord.com/users/' + user.id)
                        .setLabel(await client.lang(`userinfo.message6`))
                        .setStyle(Discord.ButtonStyle.Link)
                )

            )

        let msg = await message.reply({ embeds: [embed], components: [row], ephemeral: false });

        let collectuser = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: ComponentType.Button, time: ms("2m") })

        client.on("interactionCreate", async (interaction) => {
            if (interaction.customId === `userinfo_allrole_${message.id}`) {
                if (message.author.id !== interaction.user.id) {
                    return interaction.reply({ content: await client.lang('noperminterac'), ephemeral: true });
                }
            }
        });

        collectuser.on("collect", async (i) => {
            if (i.customId === `userinfo_allrole_${message.id}`) {
                const embed = new EmbedBuilder()
                    .addFields({ name: `${await client.lang(`userinfo.role`)} [${member.roles.cache.size}]`, value: rolebutton ?? await client.lang(`userinfo.message9`) })
                    .setFooter(client.footer)
                    .setColor(client.color)
                i.reply({ embeds: [embed], ephemeral: true });
            }
            if (i.customId === `userinfo_badge_${message.id}`) {
                const embed = new EmbedBuilder()
                    .addFields({ name: `${await client.lang(`userinfo.badge`)} [` + userBadges.length + "]", value: `\`${userBadges.join(' , ')}\`` || await client.lang(`userinfo.message10`) },)
                    .setFooter(client.footer)
                    .setColor(client.color)
                i.reply({ embeds: [embed], ephemeral: true });
            }
        })

        collectuser.on('end', () => {
            msg.edit({ components: [] });
        });
    },
};