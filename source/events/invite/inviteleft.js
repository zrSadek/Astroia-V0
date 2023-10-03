const { Events } = require("discord.js");

module.exports = {
    name: 'guildMemberRemove',
    run: async (client, member) => {
        if (member.partial) member = await member.fetch();
        
        const inviterId = await client.db.get(`invitedby_${member.guild.id}_${member.id}`);
        if (inviterId) {
            const invitesOfUser = await client.db.get(`invites_${inviterId}_${member.guild.id}`);
            if (invitesOfUser) {
                invitesOfUser.valid--;
                invitesOfUser.left++;

                await client.db.set(`invites_${inviterId}_${member.guild.id}`, invitesOfUser);
            }
        }
    }
};
