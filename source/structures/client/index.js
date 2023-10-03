const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const fs = require("fs");
const version = require('../../../version')
const { Player } = require('discord-player');
module.exports = class Astroia extends Client {
  constructor(
    options = {
      intents: [3276799],
      partials: [
        1, 2, 5, 3,
        4, 6, 0
      ]
    }
  ) {
    super(options);
    this.setMaxListeners(0);
    this.commands = new Collection();
    this.aliases = new Collection();
    this.support = 'https://discord.gg/astroia'
    this.footer =  {
      "text": "Astroia © 2023",
      "iconURL": "https://cdn.discordapp.com/attachments/1151844824610250812/1152584907026083840/FF0EA270-FEAA-4280-A788-BEB940A14D94.jpg"
    }
    this.slashCommands = new Collection();
    this.config = require('../../../config/config');
    this.version = version.version;
    this.db = require("quick.db");
    this.invite = new Map();
    this.snipeMap = new Map();
    this.initCommands();
    this.initEvents();
    this.player = Player.singleton(this);
    this.player.extractors.loadDefault();
    this.connectToToken();
    this.staff = ["1095592017121251400", "648236998657835047", "355851488372719618"];
    this.lang = async function (key, guildId) {
      return new Promise(async (resolve, reject) => {
        const guildConfig = this.db.get(`langue`);
        const langCode = guildConfig || "fr";
        const langFilePath = `../../../lang/${langCode}.json`;
        const keys = key.split(".");
        let text;

        try {
          text = require(langFilePath);
        } catch (error) {
          console.error(
            `Impossible de charger le fichier de langue pour la langue "${langCode}" : ${error.message}`
          );
          return resolve("");
        }

        for (const key of keys) {
          text = text[key];
          if (!text) {
            console.error(
              `Impossible de trouver une traduction pour "${key}", langue : ${langCode}`
            );
            return resolve("");
          }
        }

        return resolve(text);
      });
    };
  }

  async connectToToken() {
    this.login(this.config.token)
      .then(() => {
        var x = setInterval(() => {
          if (this.ws.reconnecting || this.ws.destroyed) {
            this.login(this.config.token).catch((e) => {
              clearInterval(x);
              console.error("Erreur pendant la connexion au token :");
              console.error(e);
            });
          }
        }, 30000);
      })
      .catch((e) => {
        console.error(e);
        if (e?.code?.toLowerCase()?.includes("token")) return;
        setTimeout(() => {
          this.connectToToken();
        }, 10000);
      });
  }

  refreshConfig() {
    delete this.config;
    delete require.cache[require.resolve("../../../config/config")];
    this.config = require("../../../config/config");
  }
  initCommands() {
    const subFolders = fs.readdirSync("./source/commands");
    for (const category of subFolders) {
      const commandsFiles = fs
        .readdirSync(`./source/commands/${category}`)
        .filter((file) => file.endsWith(".js"));
      for (const commandFile of commandsFiles) {
        const command = require(`../../commands/${category}/${commandFile}`);
        command.category = category;
        command.commandFile = commandFile;
        console.log(`Commande charger : ${command.name}`);
        this.commands.set(command.name, command);
        if (command.aliases && command.aliases.length > 0) {
          command.aliases.forEach((alias) => this.aliases.set(alias, command));
        }
      }
    }
    let finale = new Collection();
    this.commands.map((cmd) => {
      if (finale.has(cmd.name)) return;
      finale.set(cmd.name, cmd);
      this.commands
        .filter((v) => v.name.startsWith(cmd.name) || v.name.endsWith(cmd.name))
        .map((cm) => finale.set(cm.name, cm));
    });
    this.commands = finale;
  }

  initEvents() {
    const subFolders = fs.readdirSync(`./source/events`);
    for (const category of subFolders) {
      const eventsFiles = fs
        .readdirSync(`./source/events/${category}`)
        .filter((file) => file.endsWith(".js"));
      for (const eventFile of eventsFiles) {
        const event = require(`../../events/${category}/${eventFile}`);
        this.on(event.name, (...args) => event.run(this, ...args));
        if (category === "anticrash")
          process.on(event.name, (...args) => event.run(this, ...args));
        console.log(`EVENT charger : ${eventFile}`);
      }
    }
  }
};
