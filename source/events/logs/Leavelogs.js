const { Astroia } = require('../../structures/client');
const Discord = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    /**
     * @param {Astroia} client 
     * @param {Astroia} member 
     * @returns 
     */
    run: async (client, member) => {
        const color = client.db.get(`color_${member.guild.id}`) || client.config.default_color;
        let channel =  await client.db.get(`joinsleave_${member.guild.id}`); 

        if (channel) {
            let logChannel = member.guild.channels.cache.get(channel);
            if (logChannel) {
                const inviterpar = await client.db.get(`invitedby_${member.guild.id}_${member.id}`);
                const url = await client.db.get(`url_${member.guild.id}`);
                let leaveMessage = `${member} (\`${member.id}\`) a quitté le serveur.`;

                if (inviterpar === "vanity") {
                    leaveMessage += ` Ils étaient invités par l'url personnalisée.`;
                } else if (inviterpar !== "vanity" && inviterpar !== null) {
                    const inviter = member.guild.members.cache.get(inviterpar);
                    if (inviter) {
                        leaveMessage += ` Il à était invité par ${inviter} (\`${inviter.id}\`).`;
                    } else {
                        leaveMessage += ` L'invitant est inconnu (\`${inviterpar}\`).`;
                    }
                }

                const roles = member.roles.cache.map(role => role.name).join(', ');
                if (roles) {
                    const embed = new Discord.EmbedBuilder()
                        .setColor(color)
                        .setDescription(leaveMessage)
                        .addFields({name: 'Rôles', value: '```yml\n' + roles + '```'})
                        .setFooter({text: `Nous sommes maintenant : ${member.guild.memberCount}`});

                    logChannel.send({ embeds: [embed] });
                } else {
                    const embed = new Discord.EmbedBuilder()
                        .setColor(color)
                        .setDescription(leaveMessage)
                        .addFields({name: 'Rôles', value: '```yml\n' + 'Aucun rôle' + '```'})
                        .setFooter({text: `Nous sommes maintenant : ${member.guild.memberCount}`});

                    logChannel.send({ embeds: [embed] });
                }
            }
        }
    }
};
