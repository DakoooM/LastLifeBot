require("dotenv/config");

const {  Client, GuildMember, EmbedBuilder, PresenceStatus, Events } = require("discord.js");
const { Channels, serverName } = require("../config.json");

module.exports = {
    name: Events.GuildMemberUpdate,
    description: "Lorsqu'un utilisateur change des informations concernant le serveur.",
    
    /** 
      * @param {Client} client
      * @param {GuildMember} oldMember
      * @param {GuildMember} newMember
    **/
    async execute(client, oldMember, newMember) {      
      // console.log("oldMember", oldMember.presence, "newMember", newMember.presence);
      
      if (!oldMember?.premiumSince && newMember?.premiumSince) {
        const guild = await client.guilds.cache.get(process.env.APP_GUILD_ID);
        const boostChannel = client.Utils.getChannel({ id: Channels.booster_salon });

        const embed = new EmbedBuilder();
        embed.setTitle("🚀 Nouveau boost !");
        embed.setDescription(`${newMember.user} vient de booster le serveur !\n**${serverName}** est maintenant au niveau${guild.premiumTier > 1 ? "x" : ""} ${guild.premiumTier} avec ${guild.premiumSubscriptionCount} boost${guild.premiumSubscriptionCount > 1 ? "s" : ""} !`)
        embed.setTimestamp();
        
        boostChannel?.send({ embeds: [embed] });
      }
    
      if (oldMember?.premiumSince && !newMember?.premiumSince) {
        // quand un membre enleve sont boost
      }
    }
}