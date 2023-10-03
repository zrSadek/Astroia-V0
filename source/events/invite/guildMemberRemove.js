const { Events } = require("discord.js");

module.exports = {
    name: 'guildMemberRemove',
    run: async (client, member) => {
        if (member.partial) member = await member.fetch();
        
        const db = client.db.get(`leavesettings_${member.guild.id}`)
        if (!db) return;
        if (db.status === false) return;
        let goodbyeChannel = client.channels.cache.get(db.channel);
        
        if (member.user.bot && goodbyeChannel) {
            return goodbyeChannel.send(`Le bot ${member.toString()} a quitté le serveur.`).catch(err => { });
        }

        const inviterId = await client.db.get(`invitedby_${member.guild.id}_${member.id}`);
        if (inviterId) {
            const invitesOfUser = await client.db.get(`invites_${inviterId}_${member.guild.id}`);
            if (invitesOfUser) {
                let inviter = member.guild.members.cache.get(inviterId);
                if (inviter) {
                    let joinmessage = db.message;

                    let toSend = joinmessage
                        .replaceAll('{user.id}', member.user.id)
                        .replaceAll('{user.tag}', member.user.tag)
                        .replaceAll('{user.username}', member.user.tag)
                        .replaceAll('{user}', member.user)
                        .replaceAll('{inviter.id}', inviter.user.id)
                        .replaceAll('{inviter.username}', inviter.user.username)
                        .replaceAll('{inviter.tag}', inviter.user.tag)
                        .replaceAll('{inviter.total}', invitesOfUser.total)
                        .replaceAll('{inviter.valid}', invitesOfUser.valid)
                        .replaceAll('{inviter.invalide}', invitesOfUser.left)
                        .replaceAll('{inviter.bonus}', invitesOfUser.bonus)
                        .replaceAll('{guild.name}', member.guild.name)
                        .replaceAll('{guild.id}', member.guild.id)
                        .replaceAll('{guild.count}', member.guild.memberCount);

                    if (goodbyeChannel) {
                        goodbyeChannel.send(toSend);
                    }
                }
            }
        }
    }
};
