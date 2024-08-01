const { Client, GuildMember } = require("discord.js");
const { Channels } = require("../config.json");

module.exports = {
    name: "guildMemberRemove",
    description: "Lorsqu'un utilisateur quiite.",
    
    /** 
        *
        * @param {Client} client
        * @param {GuildMember} member
        *
    **/
    async execute(client, member) {
        const { guild } = member;

        const welcome_logs_channel = client.Utils.getChannel({id: Channels.arrivants_logs});
        const content = `❌ ${member.user} a quitter le serveur, nous sommes maintenant ${guild.memberCount} membres`;
        
        welcome_logs_channel?.send({content: content});
    }
}