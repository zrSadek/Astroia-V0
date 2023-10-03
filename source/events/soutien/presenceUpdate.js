const Astroia = require("../../structures/client/index");

module.exports = {
    name: "presenceUpdate",
    run: async (client, oldPresence, newPresence) => {
        const guildID = newPresence.guild?.id;
        if (!guildID) return;
        const db = client.db.get(`soutien_${guildID}`);
        if (!db) return;
        if (db.status === false || db.name === null) return;
        const customStatus = newPresence.member?.presence?.activities[0]?.state;
        const rolesToAdd = db.role;
        const member = newPresence.member;
        if (db.status === true && customStatus) {
            if (customStatus.includes(db.name)) {
                if (rolesToAdd.length > 0) {
                    try {
                        await member.roles.add(rolesToAdd);
                    } catch (error) {
                    }
                }
            } else {
                const rolesToRemove = db.role;
                if (rolesToRemove.length > 0) {
                    try {
                        await member.roles.remove(rolesToRemove);
                    } catch (error) {
                    }
                }
            }
        }
    }
};