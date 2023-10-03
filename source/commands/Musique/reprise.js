const { useQueue, useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require('discord.js');
const { Astroia } = require('../../structures/client/index');

module.exports = {
    name: "reprise",
    aliases: ['resume', "reprendre"],
    description: "Relance la musique.",
    /**
     * 
     * @param {Astroia} client 
     * @param {Astroia} message 
     * @param {Astroia} args 
     * @returns 
     */
    run: async (client, message, args) => {
        let pass = false
        let staff = client.staff
        if(!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true){
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true; 
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;   
        } else pass = true;
        
        if (pass === false) {
        if (client.noperm && client.noperm.trim() !== '') {
            return message.channel.send(client.noperm);
        } else {
            return; 
        }
    }
        const queue = useQueue(message.guild.id)
        if (!queue) {
            const embed = new EmbedBuilder()
                .setDescription("Il n'y a pas de musique en cours de lecture !")
                .setColor(client.color)
                .setFooter(client.footer)

            return message.reply({ embeds: [embed] });
        }


        const channel = message.member.voice.channel;
        if (!channel) {
            const embed = new EmbedBuilder()
                .setDescription("Vous n'êtes pas connecté à un salon vocal !")
                .setColor(client.color)
                .setFooter(client.footer)

            return message.reply({ embeds: [embed] });
        }


        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
            const embed = new EmbedBuilder()
                .setDescription("Je suis déjà dans un autre salon vocal !")
                .setColor(client.color)
                .setFooter(client.footer)

            return message.reply({ embeds: [embed] });
        }


        if (!message.guild.members.me.voice) {
            const embed = new EmbedBuilder()
                .setDescription("Aucune musique n'est stoppée sur ce serveur !")
                .setColor(client.color)
                .setFooter(client.footer)

            return message.reply({ embeds: [embed] });
        }



        if (queue.node.isPlaying()) {
            const embed = new EmbedBuilder()
                .setDescription("La musique n'est pas arrêtée, merci de l'arrêter avant d'exécuter la commande !")
                .setColor(client.color)
                .setFooter(client.footer)

            return message.reply({ embeds: [embed] });
        }

        queue.node.resume();

        const embed = new EmbedBuilder()
            .setDescription("La musique reprend donc, bonne écoute !")
            .setColor(client.color)
            .setFooter(client.footer)

        return message.reply({ embeds: [embed] });
    }
}
