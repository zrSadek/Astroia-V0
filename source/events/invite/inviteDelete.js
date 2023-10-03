module.exports = {
    name: 'inviteDelete',
    run: async (client, invite) => {
      try {
        let guildInvites = client.db.get(`invite_${invite.guild.id}`, {}) || client.db.set(`invite_${invite.guild.id}`, {});
        
        if (guildInvites[invite.code]) {
          delete guildInvites[invite.code];
          client.db.set(`invite_${invite.guild.id}`, guildInvites);
        }
      } catch (error) {
        console.error(`Erreur lors de la mise à jour des invitations suite à la suppression pour le serveur ${invite.guild.name}:`, error);
      }
    }
  };
  