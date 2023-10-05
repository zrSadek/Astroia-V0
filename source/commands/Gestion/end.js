module.exports = {
    name: "end",
    aliases: ["gwend", "giveawayend"],
    run: async (client, message, args, commandName) => {
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
        }
        const uniqueIdentifier = args[0];
        if (!uniqueIdentifier) {
            return message.reply(`Utilisation incorrecte.`);
        }
        const giveawayKeys = client.db.all().filter(entry => entry.ID.startsWith(`giveaway`));
        let giveawayData = null;
        let gwkey = null;
        giveawayKeys.forEach(entry => {
            const datas = entry.data;
            const data = JSON.parse(datas)
            if (data.messageid === uniqueIdentifier) {
                giveawayData = data;
                gwkey = entry.ID
            }
        });
        if (!giveawayData) {
            return message.reply("Ce giveaway n'existe pas.");
        }

        if (giveawayData.ended) {
            return message.reply("Ce giveaway est déjà terminé.");
        }

        giveawayData.temps = Date.now() + 1000;
        client.db.set(`${gwkey}`, giveawayData);

        return message.channel.send(`Le giveaway (ID: ${uniqueIdentifier}) a été terminé. Félicitations aux gagnants !`);
    }
};