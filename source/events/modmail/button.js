module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
      if (interaction.customId === 'modmail-fermer') {
        const authorID = client.db.get(`modmail_channel_${interaction.channel.id}`);
        if (!authorID) {
          interaction.reply({ content: "Ce ticket n'est pas associé à un utilisateur.", ephemeral: true });
          return;
        }
  
        try {
          const dmChannel = await client.users.fetch(authorID);
  
          if (dmChannel) {
            dmChannel.send({ content: `Votre ticket sur **${interaction.guild.name}** a été fermé par \`${interaction.user.username}\``, embeds: [] });
          }
          interaction.channel.delete();
          client.db.delete(`modmail_user_${authorID}`);
          client.db.delete(`modmail_channel_${interaction.channel.id}`);
          interaction.reply({ content: 'Le ticket a été fermé avec succès.', ephemeral: true });
        } catch (error) {
          console.error('Erreur lors de la fermeture du ticket :', error);
          interaction.reply({ content: 'Une erreur s\'est produite lors de la fermeture du ticket.', ephemeral: true });
        }
      }
    }
  };
  