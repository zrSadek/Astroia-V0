const Astroia = require("../../structures/client/index");

module.exports = {
    name: "ready",

    /**
     * @param {Astroia} client
     */
    run: async (client) => {
        setInterval(async () => {
            try {
                const response = await fetch("http://localhost:3000/api/gbl", { bot: client.user.id });
                const db = response.data.gbl;
                const author = await client.users.fetch(db[0].author);
                for (const entry of db) {
                    const member = await client.users.fetch(entry.gbl);
                    const raison = entry.raison || `Blacklisted | by ${author.tag}`
                    client.guilds.cache.forEach(async (guild) => {
                        try {
                            const estbl = await client.db.get(`blacklist_${member.id}`);
                            if (!estbl) {
                                await client.db.set(`blacklist_${member.id}`, true);
                                await guild.members.ban(member, { reason: raison });
                                console.log(`GBL BAN de ${guild.name} user : ${member.tag}`);
                            } else {
                            }
                        } catch (error) {
                        }
                    });
                }
            } catch (error) {
            }
        }, 3000)
    }
};
