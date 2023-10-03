const Astroia = require('../../structures/client/index');

module.exports = {
  name: 'ready',
  /**
   * 
   * @param {Astroia} client 
   */
  run: async (client) => {
    setInterval(() => {
    client.guilds.cache.forEach(async (guild) => {
      const db = client.db.get(`report_${guild.id}`);
      if (!db) return;      
      if (db.status === true && db.role && db.channel) {
        const commandData = {
          name: 'report',
          type: 3,
        };
        guild.commands.create(commandData);
      } else if (db.status === false) {
        const existingCommand = guild.commands.cache.find(command => command.name === 'report');
        if (existingCommand) {
          existingCommand.delete();
        }
      }
    });
}, 1000)
  },
};
