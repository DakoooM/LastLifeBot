const { EmbedBuilder, Client, GuildMember } = require("discord.js");
const { Channels, Roles } = require("../config.json");

module.exports = {
    name: "guildMemberAdd",
    description: "Lorsqu'un utilisateur rejoint.",
    
    /** 
        * @param {Client} client
        * @param {GuildMember} member
    **/
    async execute(client, member) {
        const { guild } = member;

        let memberAvatar = member.user.avatarURL();
        const welcome_channel = client.Utils.getChannel({id: Channels.salon_bienvenue});
        const welcome_logs_channel = client.Utils.getChannel({id: Channels.arrivants_logs});

        const welcome_msg = new EmbedBuilder();
        welcome_msg.setTitle("Nouveau Survivant");
        welcome_msg.setColor("Red");
        welcome_msg.setThumbnail(memberAvatar ? memberAvatar : null);
        welcome_msg.setDescription(`**${member.user}** vient de nous rejoindre. Son compte a été créé <t:${parseInt(member.user.createdTimestamp / 1000)}:R>. Nous sommes maintenant ${guild.memberCount} membres.`)
        welcome_msg.setTimestamp();
        
        welcome_logs_channel?.send({content: `✅ ${member.user} a rejoint le serveur, nous sommes maintenant ${guild.memberCount} membres`});
        welcome_channel?.send({
            content: `Bienvenue ${member.user}, survivant de l'apocalypse.`, 
            embeds: [welcome_msg]
        });

        try {
            await member.roles.add(Roles.nouveau_arrivants);
        } catch (err) {
            console.error(`Event: '${this.name}' has error: ${err.message}.`);
        }
    }
}