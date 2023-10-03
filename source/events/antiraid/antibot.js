const { Astroia } = require('../../structures/client/index')
const Discord = require('discord.js')
const ms = require('ms')
module.exports = {
    name: 'guildMemberAdd',
    /**
     * 
     * @param {Astroia} client
     */
    run: async (client, member, config) => {
        let guild = member.guild

        if (!member.user.bot) return
        let antibot = client.db.get(`antibot_${guild.id}`)
        if(!antibot) return;

        

        let action = await guild.fetchAuditLogs({ limit: 1, type: 28}).then(async (audit) => audit.entries.first());
        let executor = action.executor
        let sanction = await client.db.get(`punish_${guild.id}.antibot`)
        if (executor.id === client.user.id) return;
        let perm;
        if (antibot.status === "on") perm = client.config.buyers.includes(executor.id) || client.staff.includes(executor.id) || client.db.get(`owner_${executor.id}`) === true || client.db.get(`wlmd_${guild.id}_${executor.id}`) === true
        if (antibot.status === "max") perm = client.config.buyers.includes(executor.id) || client.staff.includes(executor.id) || client.db.get(`owner_${executor.id}`) === true

        if (perm) return;
        if(!sanction)return;

        if (sanction === "derank") {
            member.kick()
            guild.members.cache.get(executor.id).roles.set([])
        } else if (sanction === "kick") {
            member.kick()
            guild.members.cache.get(executor.id).kick({ reason: "Astroia AntiBot" })
        } else if (sanction === "ban") {
            member.kick()
            guild.members.cache.get(executor.id).ban({ reason: "Astroia AntiBot" })
        } else if (sanction === "mute") {
         member.kick()
        await guild.members.cache.get(executor.id).roles.set([])
        await guild.members.cache.get(executor.id).timeout(ms('28d'), "Astroia AntiBot").catch(() => { });
        }

        let logsEmbed = new Discord.EmbedBuilder()
        .setColor(client.db.get(`color_${guild.id}`) || client.config.default_color)
        .setDescription(`${executor} ${await client.lang(`antibot.message7`)} \`${member.user.tag}\` sanction: \`${sanction || "derank"}\``)
        .setAuthor({name: `${executor.username} (${executor.id})`, iconURL: executor.displayAvatarURL()})

        let pingraid = client.db.get(`pingraid_${guild.id}`)
        let pingraid_role = client.db.get(`pingraid_role_${guild.id}`)
        if (!pingraid) return;
        if (pingraid === "everyone") pingraid = "@everyone"
        if (pingraid === "here") pingraid = "@here"
        if (pingraid === "role") pingraid = `<@&${pingraid_role}>`
        if (pingraid === "buyers") pingraid = `<@${client.config.buyers.join(", ")}>`
        if (pingraid === "owners") pingraid = `${client.db.get(`${client.user.id}.owner`)?.length > 0 ? client.db.get(`${client.user.id}.owner`).map(o => `<@${o}>`).join(", ") : "Aucun owner"}`
        
        guild.channels.cache.get(client.db.get(`raidlogs_${guild.id}`))?.send({ embeds: [logsEmbed], content: `${pingraid || "Aucun ping"}` })
        

    }
}