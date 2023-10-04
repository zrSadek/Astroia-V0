const lineCounter = require('../../structures/client/countLines.js');
const getNow = () => {
  return {
    time: new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  };
};
const Astroia = require('../../structures/client/index');
module.exports = {
  name: 'ready',
  /**
* 
* @param {Astroia} client 
* 
*/
  run: async (client) => {
    client.db.get(`langue`) || client.db.set(`langue`, 'fr');
    const tag = client.user.tag;
    const id = client.user.id;

    const channel = client.channels.cache.size
    const userbot = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()
    console.clear();
    console.log(`[BOT]      : ${tag} (${id}) est connecté à ${getNow().time}`);
    console.log(`[VERSION]  : ${client.version}`)
    console.log(`[COMMANDS] : ${client.commands.size}`)
    console.log(`[GUILDS]   : ${client.guilds.cache.size}`);
    console.log(`[CHANNELS] : ${channel}`);
    console.log(`[USERS]    : ${userbot}`);
    console.log(`[Ligne]    : ${lineCounter.ligne().toLocaleString()}`);
    console.log('Astroia est prêt');
    console.log("-------------------------------");
  },
};