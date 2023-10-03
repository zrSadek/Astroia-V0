const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        const db = client.db.get(`defautrole_${member.guild.id}`)
        if (!db) return;
        if (db.status === false) return;
        const rolesToAdd = db.role

        rolesToAdd.forEach(roleID => {
            const role = member.guild.roles.cache.get(roleID);
            if (role) {
                member.roles.add(role, { reason: 'Astroia | Defautrole' });
            }
        });
    }
}