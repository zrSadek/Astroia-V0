const { Astroia } = require("../../structures/client/index");
const ms = require('ms');
const Discord = require('discord.js')
const spamMap = new Map();

module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        const guild = message.guild
        if (message.author.id === client.user.id) return;
        if (message.author.id === message.guild.ownerId) return;
        if (client.config.buyers.includes(message.author.id)) return;
        if (message.author.id === client.db.get(`owner_${message.author.id}`)) return;
        if (client.db.get(`owner_${message.author.id}`) === true) return;
        const db = client.db.get(`antispam_${message.guild.id}`);
        if (!db || db.status === 'off') return;

        const iwlpass = db.status === 'on';

        const spamThreshold = db?.message;
        const spamInterval = db?.temps;
        const user = message.author;
        const channel = message.channel;

        if (iwlpass) {
            const wl = client.db.get(`wl.${message.guild.id}`) || [guild.ownerId];
            const isWhitelisted = wl.includes(message.author.id);
            if (isWhitelisted) return;
        }

        if (!spamMap.has(user.id)) {
            spamMap.set(user.id, {
                count: 1,
                timestamp: Date.now()
            });
        } else {
            const userData = spamMap.get(user.id);
            const currentTime = Date.now();

            if (currentTime - userData.timestamp < spamInterval) {
                userData.count++;
                if (userData.count >= spamThreshold) {
                    const member = message.guild.members.cache.get(user.id);
                    if (!member) {
                        return;
                    }
                    
                        const punishData = client.db.get(`punish_${message.guild.id}.antispam`);
                        if (punishData) {
                            const reason = "Anti-Spam | Astroia"
                            console.log(punishData);
                           if (punishData === 'kick') {
                                 member.kick(reason).catch(console.error);
                            }  if (punishData === 'ban') {
                                await member.ban({ reason }).catch(console.error);
                            }  if (punishData === 'derank') {
                                await message.guild.members.cache.get(member.id).roles.set([]).catch(console.error);
                            } if (punishData === 'mute') {
                                member.timeout(ms('5s'), reason).catch(console.error);
                               } 

                            const messages = await channel.messages.fetch({ limit: 99 });
                            const userMessages = messages.filter(msg => msg.author.id === user.id);
                            await channel.bulkDelete(userMessages, true).catch(console.error);

                            channel.send(`${user}, merci d'arrêter de spammer !`)
                                .then(msg => {
                                    msg.delete({ timeout: 3000 }).catch(console.error);
                                });

                            spamMap.delete(user.id);
                      } else {
                        }
                 
                    }
                }
        }
    }
};