const colors = require("colors");
const ticketInteraction = require("../utils/ticketInteract");

const { 
    SlashCommandBuilder, 
    Client,
    CommandInteraction,
    ChannelType
} = require("discord.js");

module.exports = {
    moderation: false,
    data: new SlashCommandBuilder()
        .setName("createticket")
        .addChannelOption(channel => 
          channel.setName("category")
          .addChannelTypes(ChannelType.GuildCategory)
          .setDescription("category dans laquel vous souhaitez crée un ticket!")
          .setRequired(true)
        )
        .setDescription("Crée un ticket avec la category que vous souhaitez."),

    /** 
        @param {Client} client
        @param {CommandInteraction} interaction
    **/
    async execute(client, interaction) {
        const channel = interaction.options.getChannel("category");
        if (!channel) return interaction.reply({content: "Une erreur est survenu, le salon n'a pas été trouver!"});

        console.log(colors.red("paaaarsing", channel.id));

        ticketInteraction(client, interaction, channel.id, true);
    }
}