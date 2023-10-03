module.exports = {
    name: 'inviteCreate',
    run: async (client, invite) => {

      try {
        let inviteData = {
          code: invite.code,
          createur: invite.inviterId,
          maxage: invite.maxAge,
          uses: invite.uses
        };

        let urlserveur = {
            url: invite.guild.vanityURLCode || null,
            uses: invite.guild.vanityURLUses || 0
        }

        let guildInvites = client.db.get(`invite_${invite.guild.id}`) || {};
        guildInvites[invite.code] = inviteData;
        
        client.db.set(`invite_${invite.guild.id}`, guildInvites);
        client.db.set(`url_${invite.guild.id}`, urlserveur);

      } catch (error) {
        console.error(`Erreur lors de la mise à jour des invitations pour le serveur ${invite.guild.name}:`, error);
      }
    }
};
