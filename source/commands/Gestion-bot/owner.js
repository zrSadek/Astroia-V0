const Discord = require('discord.js');
const { Astroia } = require('../../structures/client');

module.exports = {
    name: "owner",
    description: "Permet de lister ou de gérer la liste des owners",
    usages: "owner <utilisateur/id>",
    /**
     * 
     * @param {Astroia} client 
     * @param {Astroia} message 
     * @param {Astroia} args 
     * @param {Astroia} commandName 
     * @returns 
     */
    run: async (client, message, args, commandName) => {
        if (!client.config.buyers.includes(message.author.id)) {
            return message.channel.send(await client.lang('owner.perm'));
        }
        if (!args[0]) {
            let data = await client.db.all();
            let ownerList = data.filter(data => data.ID.startsWith(`owner_`)).length > 0 ? data.filter(data => data.ID.startsWith(`owner_`)).map(entry => `<@${entry.ID.split('_')[1]}>`).join("\n") : "Aucun";

            let embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(await client.lang(`owner.titre`))
                .setDescription(ownerList)
                .setFooter(client.footer);

            message.channel.send({ embeds: [embed] });

        } else if (args[0] === "clear") {
            let data = await client.db.all();
            let ownerData = data.filter(data => data.ID.startsWith(`owner_`));

            message.channel.send(`${ownerData.length === undefined || null ? 0 : ownerData.length} ${ownerData.length > 1 ? await client.lang(`owner.personnes`) : await client.lang(`owner.personne`)} ${await client.lang(`owner.liste`)}`);

            for (let i = 0; i < ownerData.length; i++) {
                client.db.delete(ownerData[i].ID);
            }
        } else {
            if (message.mentions.members.size > 0 || client.users.cache.get(args[0])) {
                let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

                if (member) {
                    if (client.db.get(`owner_${member.id}`)) return message.channel.send(`${member.user.username} ${await client.lang(`owner.owner-deja`)}`);
                    client.db.set(`owner_${member.id}`, true);
                    message.channel.send(`\`${member.user.username}\`${await client.lang(`owner.owner-valide`)}`);
                } else {
                    message.channel.send(await client.lang("owner.erreur"));
                }
            } else {
                message.channel.send(await client.lang("owner.id"));
            }
        }
    }
};
