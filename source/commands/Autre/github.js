const fetch = require('node-fetch');
const Discord = require('discord.js');
const moment = require('moment')
module.exports = {
    name: 'github',
    description: 'Affiche les informations d\'un utilisateur Github.',
    usage: 'github <nom d\'utilisateur>',
    run: async (client, message, args, commandName) => {
        let pass = false;
        let staff = client.staff;
        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
        } else {
            pass = true;
        }

        if (pass === false) {
            if (client.noperm && client.noperm.trim() !== '') {
                return message.channel.send(client.noperm);
            } else {
                return;
            }
        }
      const githubUsername = args.join('-');
      const githubApiUrl = `https://api.github.com/users/${githubUsername}`;
  
      try {
        const response = await fetch(githubApiUrl);
        const body = await response.json();
  
        if (body.message) {
          return message.channel.send(`Utilisateur inconnu, merci de fournir un nom d'utilisateur valide !`);
        }
  
        const { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = body;

        const embed = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setThumbnail(avatar_url)
          .setDescription(`**Profil GitHub de ${login}**\n\n` +
            `**Nom d'utilisateur :** \`${login}\`\n` +
            `**ID :** \`${id}\`\n` +
            `**Bio :** \`${bio || "Aucune bio disponible"}\`\n` +
            `**Repositories publics :** \`${public_repos || "Aucun"}\`\n` +
            `**Followers :** \`${followers}\`\n` +
            `**Following :** \`${following}\`\n` +
            `**Localisation :** \`${location || "Aucune localisation spécifiée"}\`\n` +
            `**Compte créé le :** <t:${Math.floor(new Date(created_at).getTime() / 1000)}:D> (<t:${Math.floor(new Date(created_at).getTime() / 1000)}:R>)\n` +
            `**Lien vers le profil GitHub :** [\`${login}\`](${html_url})`
          )
          .setFooter(client.footer);
  
        message.channel.send({
            embeds: [embed]
        });
      } catch (error) {
        console.error(error);
        message.channel.send(`Une erreur est survenue`);
      }
    }
};
