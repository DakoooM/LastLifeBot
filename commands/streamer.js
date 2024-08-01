require("dotenv/config");

const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ActionRowBuilder
} = require("discord.js");

const { Streamer } = require("../utils/Streamer");

const Stream = new Streamer();

const {
  Roles,
  serverName
} = require("../config.json");

module.exports = {
  moderation: true,
  data: new SlashCommandBuilder()
    .setName("streamer")
    .addSubcommand(subcmd =>
      subcmd.setName("add")
        .addStringOption(option =>
          option.setName("twitch")
            .setRequired(true)
            .setDescription("chaine twitch (exemple: 'https://www.twitch.tv/dakaum' OU 'dakaum')")
        )
        .addUserOption(option =>
          option.setName("user")
            .setRequired(true)
            .setDescription("utilisateur a ajouté a la liste des annonces")
        )
        .addBooleanOption(option =>
          option.setName("ephemeral")
            .setRequired(false)
            .setDescription("message de succès s'envoi localement")
        )
        .setDescription("ajouté un utilisateur dans la liste des streameurs")
    )
    .addSubcommand(subcmd =>
      subcmd.setName("remove")
        .addStringOption(option =>
          option.setName("twitch")
            .setRequired(true)
            .setDescription("chaine twitch (exemple: 'https://www.twitch.tv/dakaum' OU 'dakaum')")
        )
        .addBooleanOption(option =>
          option.setName("ephemeral")
            .setRequired(false)
            .setDescription("message de succès s'envoi localement")
        )
        .setDescription("retirer un utilisateur dans la liste des streameurs")
    )
    .addSubcommand(subcmd =>
      subcmd.setName("list")
        .setDescription("récuperer la liste des streamer ajouté.")
        .addBooleanOption(option =>
          option.setName("ephemeral")
            .setRequired(false)
            .setDescription("message de succès s'envoi localement")
        )
    )
    .setDescription(`intéraction concernant les streameur ${serverName}.`),


  /** 
      @param {Client} client
      @param {CommandInteraction} interaction
  **/
  async execute(client, interaction) {
    if (!interaction.options.getSubcommand()) return interaction.reply({ content: "Erreur, vous devez renseigner une sous commande." })

    switch (interaction.options.getSubcommand()) {
      case "add":
        const user = interaction.options.getUser("user");
        const twitch = interaction.options.getString("twitch");
        const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;
        const member = interaction.guild.members.cache.get(user.id);
        const [ error, message, user_name ] = Stream.formatUsername(twitch);

        if (error) {
          return await interaction.reply({
            content: message,
            ephemeral: true
          })
        }

        if (Stream.isStreamerExist(user_name)) return await interaction.reply({
          content: `Le streamer ${user_name} existe déja parmis la liste d'annonce!\nVeuillez vérifier la liste des streameurs avec la commande /streamer list`,
          ephemeral: true
        })

        if (!user || !member) return await interaction.reply({ content: "Une erreur est survenu, l'utilisateur n'a pas été trouver!" });

        try {
          await member.roles.add(Roles.streameur);
          await Stream.addStreamer(user.id, user_name);

          await interaction.reply({
            content: `${user} a été ajouter a la liste d'annonces des <@&${Roles.streameur}> avec la chaine twitch: ${user_name}!`,
            ephemeral: ephemeral
          });
        } catch (err) {
          console.error(`/streamer add → has error: ${err}.`);

          await interaction.reply({
            content: "Une erreur a été détecter, veuillez contactez le développeur du bot discord ou le fondateur!",
            ephemeral: true
          });
        }
        break;
      case "remove":
        const ephemeral_rmv = interaction.options.getBoolean("ephemeral") ?? false;
        const twitch_rmv = interaction.options.getString("twitch");
        const [ error_rmv, message_rmv, user_name_rmv ] = Stream.formatUsername(twitch_rmv);

        if (error_rmv) {
          return await interaction.reply({
            content: message_rmv,
            ephemeral: true
          });
        }

        const streamer_exist = Stream.isStreamerExist(user_name_rmv);
        if (!streamer_exist) return await interaction.reply({
          content: `Ce streameur n'existe pas dans la liste!`,
          ephemeral: true
        });

        try {
          const member_rmv = interaction.guild.members.cache.get(streamer_exist.userId);
          await member_rmv?.roles.remove(Roles.streameur);
          await Stream.removeStreamer(streamer_exist.name);

          await interaction.reply({
            content: `${member_rmv ?? streamer_exist.name} a été retiré de la liste d'annonces des <@&${Roles.streameur}> avec la chaine twitch: ${user_name_rmv}!`,
            ephemeral: ephemeral_rmv
          });
        } catch (err) {
          console.log(`/streamer remove → has error: ${err}.`);

          await interaction.reply({
            content: "Une erreur a été détecter, veuillez contactez le développeur du bot discord ou le fondateur!",
            ephemeral: true
          });
        }
        break;
      case "list":
        Stream.embedStreamersPagination(interaction);
        break;
    }
  }
}