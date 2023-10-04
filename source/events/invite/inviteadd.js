const Discord = require('discord.js')
module.exports = {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        if (member.partial) member = await member.fetch();
        const newInvites = await member.guild.invites.fetch();
        if (member.guild.vanityURLCode) {
            newInvites.set(member.guild.vanityURLCode, await member.guild.fetchVanityData());
        }

        let usedInvite = newInvites.find(i =>
            (client.db.has(`invite_${member.guild.id}.${i.code}`) &&
                client.db.get(`invite_${member.guild.id}.${i.code}.uses`) < i.uses) ||
            (client.db.get(`url_${member.guild.id}.url`) === i.code)
        );

        if (usedInvite) {
            if (usedInvite.code === member.guild.vanityURLCode) {
                await client.db.set(`invitedby_${member.guild.id}_${member.id}`, "vanity");
            } else {
                const inviterId = usedInvite.inviter.id;
                const invitesOfUser = await client.db.get(`invites_${inviterId}_${member.guild.id}`) || {
                    total: 0,
                    valid: 0,
                    left: 0,
                    bonus: 0
                };

                invitesOfUser.total++;
                invitesOfUser.valid++;

                await client.db.set(`invites_${inviterId}_${member.guild.id}`, invitesOfUser);
                await client.db.set(`invitedby_${member.guild.id}_${member.id}`, inviterId);
                await client.db.set(`invite_${member.guild.id}.${usedInvite.code}.uses`, usedInvite.uses);

            }
        }


        const color = client.db.get(`color_${member.guild.id}`) || client.config.default_color;
        let channel = await client.db.get(`joinsleave_${member.guild.id}`);

        if (channel) {
            let logChannel = member.guild.channels.cache.get(channel);
            if (logChannel) {
                const inviterpar = await client.db.get(`invitedby_${member.guild.id}_${member.id}`);
                const url = await client.db.get(`url_${member.guild.id}`);
                let joinMessage = "";
                if (inviterpar === "vanity") {
                    joinMessage = `${member} (\`${member.id}\`) a rejoint le serveur, invité par une l'url personnalisée, utilisations de l'url : \`${member.guild.vanityURLUses || (url ? url.uses : 0)}\``;
                } else if (inviterpar !== "vanity") {
                    const inviter = member.guild.members.cache.get(inviterpar);
                    if (member.user.bot) {
                        joinMessage = `${member} (\`${member.id}\`) a rejoint le serveur, invité par ***l'API OAuth2***`;
                    }
                    else if (inviter) {
                        joinMessage = `${member} (\`${member.id}\`) a rejoint le serveur, invité par ${inviter} (\`${inviter.id}\`)`;
                    } else {
                        joinMessage = `${member} (\`${member.id}\`) a rejoint le serveur, mais je ne peux pas dire qui l'a invité.`;
                    }
                }

                const joinEmbed = new Discord.EmbedBuilder()
                    .setColor(color)
                    .setDescription(joinMessage)
                    .setFooter({ text: `Nous sommes maintenant : ${member.guild.memberCount}` });

                logChannel.send({ embeds: [joinEmbed] });
            }
        }

        if (member.partial) member = await member.fetch();
        const db = client.db.get(`joinsettings_${member.guild.id}`);
        if (!db) return;
        if (db.status === false) return;
        let welcomeChannel = client.channels.cache.get(db.channel);



        if (!usedInvite) return;

        let iv2 = usedInvite.inviter;

        let joinmessage = db.message;

        const intterrr = await client.db.get(`invitedby_${member.guild.id}_${member.id}`);
        const invitesOfUser = await client.db.get(`invites_${intterrr}_${member.guild.id}`)

        let toSend = joinmessage
            .replaceAll('{user.id}', member.user.id)
            .replaceAll('{user.tag}', member.user.tag)
            .replaceAll('{user.username}', member.user.tag)
            .replaceAll('{user}', member.user)
            .replaceAll('{inviter.id}', iv2.id)
            .replaceAll('{inviter.username}', iv2.username)
            .replaceAll('{inviter.tag}', iv2.tag)
            .replaceAll('{inviter}', iv2)
            .replaceAll('{inviter.total}', invitesOfUser.total)
            .replaceAll('{inviter.valid}', invitesOfUser.valid)
            .replaceAll('{inviter.invalide}', invitesOfUser.left)
            .replaceAll('{inviter.bonus}', invitesOfUser.bonus)
            .replaceAll('{guild.name}', member.guild.name)
            .replaceAll('{guild.id}', member.guild.id)
            .replaceAll('{guild.count}', member.guild.memberCount);

        if (welcomeChannel) {
            welcomeChannel.send(toSend);
        }

    }
};
