require("dotenv/config");

const { PermissionFlagsBits, Client, VoiceState, ChannelType } = require("discord.js");
const { Channels, Roles, utilisateurMaximumEnBDA } = require("../config.json");

module.exports = {
    name: "voiceStateUpdate",
    description: "Lorsqu'un utilisateur change de salon ou de status micro ect...",

    /** 
     * @param {Client} client 
     * @param {VoiceState} oldVoice
     * @param {VoiceState} newVoice 
    */
    async execute(client, oldVoice, newVoice) {
        let oldChannel = oldVoice.channel;
        let newChannel = newVoice.channel;
        let user = newVoice.guild.members.cache.get(newVoice.id).user || oldChannel.guild.members.cache.get(oldChannel.id).user;
        
        if (newChannel?.id === Channels.creation_salon_bda) { /* salon a se connecter pour crée le salon temporaire */
            const guild = await client.guilds.cache.get(process.env.APP_GUILD_ID);
            let cPerms = [
                {
                    id: guild.id, 
                    deny: [PermissionFlagsBits.ViewChannel],
                    allow: [
                        PermissionFlagsBits.Speak,
                    ]
                },
                {
                    id: user.id, 
                    deny: [
                        PermissionFlagsBits.CreateInstantInvite,
                        PermissionFlagsBits.ViewAuditLog
                    ],
                    allow: [
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.MuteMembers,
                        PermissionFlagsBits.ModerateMembers
                    ]
                }
            ];

            const staffRole = guild.roles.cache.get(Roles.equipe_staff);
            if (staffRole && staffRole?.id) {
                cPerms.push({
                    id: staffRole.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.MoveMembers,
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.MuteMembers,
                        PermissionFlagsBits.Speak,
                        PermissionFlagsBits.ModerateMembers
                    ]
                })
            }

            try {
                const channel = await newChannel.guild.channels.create({
                    name: `⏳ BDA ${client.bdaOpen}`,
                    type: ChannelType.GuildVoice,
                    parent: Channels.creation_salon_bda_categorie,
                    // userLimit: utilisateurMaximumEnBDA || 10,
                    permissionOverwrites: cPerms
                });
    
                newVoice?.guild.members.cache.get(newVoice.id).voice.setChannel(channel);
                client.bdaOpen++;
            } catch (err) {
                console.error("error on voiceStateUpdate", err);
            }
        }

        if (oldChannel?.parentId === Channels.creation_salon_bda_categorie && oldChannel?.id !== Channels.creation_salon_bda) {
            if (oldChannel?.members.size <= 0) {
                let oldChannel = oldVoice.channel;

                oldChannel?.delete();
                client.bdaOpen--;
            }
        }
    }
}