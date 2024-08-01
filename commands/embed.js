require("dotenv/config");

const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  ActionRowBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
  Colors
} = require("discord.js");

const { serverName, iconURL } = require("../config.json");

module.exports = {
  moderation: false,
  data: new SlashCommandBuilder()
    .setName("embed")
    .addChannelOption(channel =>
      channel.setName("channel")
        .addChannelTypes(ChannelType.GuildText)
        .setDescription("salon ou vous souhaitez envoyer l'embed")
        .setRequired(false)
    )
    .setDescription("Crée un embed personalisée dans le salon que vous souhaitez."),

  /** 
      @param {Client} client
      @param {CommandInteraction} interaction
  **/
  async execute(client, interaction) {
    const guild = await client.guilds.cache.get(process.env.APP_GUILD_ID);
    const channelToSend = interaction.options.getChannel("channel") ?? interaction.channel;

    const TitleInput = new ActionRowBuilder().addComponents(new TextInputBuilder()
      .setCustomId("Title")
      .setValue("")
      .setLabel("Titre de l'embed")
      .setPlaceholder("Présentation de ...")
      .setStyle("Short")
    );

    const ContentInput = new ActionRowBuilder().addComponents(new TextInputBuilder()
      .setCustomId("ContentText")
      .setLabel("Contenu texte")
      .setValue("@everyone")
      .setPlaceholder("texte au dessus de l'embed (@everyone ou autres...)")
      .setStyle("Short")
      .setRequired(false)
    );

    const DescriptionInput = new ActionRowBuilder().addComponents(new TextInputBuilder()
      .setCustomId("Description")
      .setLabel("Description")
      .setRequired(true)
      .setPlaceholder("description de l'embed")
      .setStyle("Paragraph")
    );

    const ThumbnailInput = new ActionRowBuilder().addComponents(new TextInputBuilder()
      .setCustomId("Thumbnail")
      .setLabel("URL du Thumbnail")
      .setValue("icon_base_url")
      .setMaxLength(300)
      .setPlaceholder("lien de l'icone en haut a droite de l'embed")
      .setStyle("Short")
      .setRequired(false)
    );

    const ImageInput = new ActionRowBuilder().addComponents(new TextInputBuilder()
      .setCustomId("Image")
      .setLabel("Lien d'image")
      .setMaxLength(300)
      .setPlaceholder("lien d'une image en bas de l'embed")
      .setStyle("Short")
      .setRequired(false)
    );

    const newModal = new ModalBuilder();
    newModal.setCustomId("formId");
    newModal.setTitle("Créateur Embed");
    newModal.addComponents(ContentInput, TitleInput, DescriptionInput, ThumbnailInput, ImageInput);

    await interaction.showModal(newModal);

    let response = await interaction.awaitModalSubmit({
      time: 300000,
      filter: i => i.user.id === interaction.user.id
    }).catch(error => {
      console.error("error modal Embed creator", error);
      return null
    });

    if (response) {
      let ContentText = response.fields.getTextInputValue("ContentText");
      let Title = response.fields.getTextInputValue("Title");
      let Description = response.fields.getTextInputValue("Description");
      let Thumbnail = response.fields.getTextInputValue("Thumbnail");
      let Image = response.fields.getTextInputValue("Image");

      const embedBuilder = new EmbedBuilder();
      embedBuilder.setTitle(Title || serverName);
      embedBuilder.setColor(Colors.Red);
      embedBuilder.setThumbnail(Thumbnail && Thumbnail === "icon_base_url" ? iconURL : Thumbnail || null);
      embedBuilder.setDescription(Description || null);
      embedBuilder.setImage(Image || null);
      embedBuilder.setFooter({ text: serverName });
      embedBuilder.setTimestamp();

      channelToSend.send(ContentText ? {
        content: ContentText,
        embeds: [embedBuilder]
      } : {
        embeds: [embedBuilder]
      }).then(async msg => {
        const msgLink = `https://discord.com/channels/${guild.id}/${channelToSend.id}/${msg.id}`;
        await response.reply({ content: `vous avez envoyé un embed dans le salon ${channelToSend}, Lien vers le message: ${msgLink}`, ephemeral: true });
      })
    }
  }
}