require("dotenv/config");

const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    Colors, 
    EmbedBuilder, 
    Client,
    PermissionFlagsBits, 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    CommandInteraction
} = require("discord.js");

const { 
    tickets, 
    ticket_embed_fields, 
    iconURL,
    websiteURL,
    bannerURL,
    serverName
} = require("../config.json");

module.exports = {
    moderation: true,
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Ajouter le message pour que les utilisateur puissent ouvrir des tickets")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /** 
        @param {Client} client
        @param {CommandInteraction} interaction
    **/
    async execute(client, interaction) {
        const guild = await client.guilds.cache.get(process.env.APP_GUILD_ID);

        const interactOptions = [];
        const selectMenu = new StringSelectMenuBuilder();
        selectMenu.setCustomId("customTicket");
        selectMenu.setPlaceholder("Choisir le type de ticket a ouvrir.");

        tickets.forEach(item => {
            if (!item.url) {
                const opt = new StringSelectMenuOptionBuilder();
                opt.setLabel(item.label);
                opt.setEmoji(item.emoji);
                opt.setValue(item.customId);

                interactOptions.push(opt);
            }
        })

        selectMenu.addOptions(interactOptions)

        const selectsMenu = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder();
        embed.setAuthor({ name: serverName, iconURL: iconURL, url: websiteURL });
        embed.addFields(ticket_embed_fields);
        embed.setColor(Colors.Red);
        embed.setThumbnail(iconURL);
        embed.setImage(bannerURL?.ticket ? bannerURL.ticket : null);
        embed.setTimestamp();

        tickets.map(item => {
            embed.addFields({ name: `${item.emoji || ""} ${item.label}`, value: item.description, inline: item.inline });
        })

        const msg = await interaction.channel.send({
            embeds: [embed],
            components: [selectsMenu]
        })

        await interaction.reply({
            content: `le message https://discord.com/channels/${guild.id}/${interaction.channel.id}/${msg.id} a été mis a jour`,
            ephemeral: true
        })
    }
}