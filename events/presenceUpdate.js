require("dotenv/config");

const { Client, Presence, Events } = require("discord.js");
const { Channels } = require("../config.json");

module.exports = {
    name: Events.PresenceUpdate,
    description: "Lorsque le présence de l'utilisateur change",

    /** 
     * @param {Client} client 
     * @param {Presence} oldPresence
     * @param {Presence} newPresence 
    */
    async execute(client, oldPresence, newPresence) {
      if (client.user.bot) return;

      // console.log("old presence", oldPresence, "new presence", newPresence);
    }
}