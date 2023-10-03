const { Astroia } = require("../../structures/client/index");
const Discord = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'Affiche le classement des membres en fonction du nombre de messages.',
    run: async (client, message, args, commandName) => {
        const guildId = message.guild.id;
        if (['message', 'msg', 'mess', 'messages'].includes(args[0])) {
            const leaderboard = [];

            message.guild.members.cache.forEach(member => {
                const userId = member.user.id;
                const messageCount = client.db.get(`message_${guildId}_${userId}`) || 0;

                leaderboard.push({ id: userId, messages: messageCount });
            });

            leaderboard.sort((a, b) => b.messages - a.messages);

            let leaderboardMessage = '';

            for (let i = 0; i < leaderboard.length && i < 20; i++) {
                const member = await client.users.fetch(leaderboard[i].id);
                leaderboardMessage += `[ ${i + 1} ] ${member.tag} - ${leaderboard[i].messages} messages\n`;
            }

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle('LeaderBoard Message')
                .setDescription('```yml\n' + leaderboardMessage + '```')
                .setFooter(client.footer);

            return message.channel.send({ embeds: [embed] });
        }
        if (['inv', 'invite', 'invites'].includes(args[0])) {
            const leaderboard = [];

            message.guild.members.cache.forEach(member => {
                const userId = member.user.id;
                const invitesData = client.db.get(`invites_${userId}_${guildId}`);
    
                if (invitesData) {
                    const totalInvites = invitesData.total || 0;
                    leaderboard.push({ id: userId, invites: totalInvites });
                }
            });
    
            leaderboard.sort((a, b) => b.invites - a.invites);
    
            let leaderboardMessage = '';
    
            for (let i = 0; i < leaderboard.length && i < 20; i++) {
                const member = await client.users.fetch(leaderboard[i].id);
                leaderboardMessage += `[ ${i + 1} ] ${member.tag} - ${leaderboard[i].invites} invitations\n`;
            }
    
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle('LeaderBoard Invitations')
                .setDescription('```yml\n' + (leaderboardMessage || "Aucune invitations") + '```')
                .setFooter(client.footer);
    
            return message.channel.send({ embeds: [embed] });
        }


        if (args[0] === 'vocal' || 'voc' || 'vocals') {

            const leaderboard = [];

            message.guild.members.cache.forEach(member => {
                const userId = member.user.id;
                const vocalTime = client.db.get(`vocal_${guildId}_${userId}`) || 0;
    
                leaderboard.push({ id: userId, vocal: vocalTime });
            });
    
            leaderboard.sort((a, b) => b.vocal - a.vocal);
    
            let leaderboardMessage = '';
    
            for (let i = 0; i < leaderboard.length && i < 20; i++) {
                const member = await client.users.fetch(leaderboard[i].id);
                leaderboardMessage += `[ ${i + 1} ] ${member.tag} - Vocal: ${formattemps(leaderboard[i].vocal)}\n`;
            }
    
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle('LeaderBoard Vocal')
                .setDescription('```yml\n' + leaderboardMessage + '```')
                .setFooter(client.footer);
    
                return message.channel.send({ embeds: [embed] });
            
            
            function formattemps(temps) {
                let time;
            
                if (temps < 60) {
                    time = `${temps} secondes`;
                } else if (temps < 3600) {
                    const minutes = Math.floor(temps / 60);
                    const seconds = temps % 60;
                    time = `${minutes} minute${minutes !== 1 ? 's' : ''} et ${seconds} seconde${seconds !== 1 ? 's' : ''}`;
                } else if (temps < 86400) {
                    const heures = Math.floor(temps / 3600);
                    const minutes = Math.floor((temps % 3600) / 60);
                    time = `${heures} heure${heures !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
                } else if (temps < 31536000) {
                    const jours = Math.floor(temps / 86400);
                    const heures = Math.floor((temps % 86400) / 3600);
                    time = `${jours} jour${jours !== 1 ? 's' : ''}, ${heures} heure${heures !== 1 ? 's' : ''}`;
                } else {
                    const années = Math.floor(temps / 31536000);
                    const jours = Math.floor((temps % 31536000) / 86400);
                    time = `${années} an${années !== 1 ? 's' : ''}, ${jours} jour${jours !== 1 ? 's' : ''}`;
                }
            
                return time;
            }
        }
    },
};
