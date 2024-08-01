const { ButtonStyle, CommandInteraction, ButtonBuilder, ActionRowBuilder, EmbedBuilder, Colors } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");

const {
  iconURL,
  serverName,
  maximumStreamersShowList
} = require("../config.json");

class Streamer {
  constructor() {
    this.baseUrl = "./db/streamer.json";
    this.endPagination = maximumStreamersShowList || 6;
  }

  /**
   * @param {Boolean} allDatas récuperer toutes les informations concernant le streamer
   * @returns {Object} Liste permanentes des streameurs twitch
  */
  getStreamers(allDatas = false) {
    const data = readFileSync(this.baseUrl, "utf-8");
    const streamers = data ? JSON.parse(data) : null;
    
    if (!allDatas) {
      return streamers;
    } else {
      const userStreamers = [];
      Object.keys(streamers).map(streamer => userStreamers.push({
        name: streamer, 
        userId: streamers[streamer]
      }))

      return userStreamers;
    }
  }

  /** 
   * @param {String} streamer Twitch link or username
  */
  formatUsername(streamer) {
    if ((streamer.includes("http://") || streamer.includes("https://")) && !streamer.includes("twitch.tv/")) {
      return [
        true,
        "Le lien n'inclu pas `twitch.tv`, il n'est donc pas possible de proccédez au actions demandé.",
        null
      ];
    }

    if (streamer.includes("twitch.tv/")) {
      const splitted = streamer.split("twitch.tv/")[1];

      return [
        false,
        null,
        splitted
      ];
    }

    return [
      false,
      null,
      streamer
    ];
  }

  /** 
   * @param { String } username Nom d'utilisateur ou lien twitch de la chaine a retirer
  */
  isStreamerExist(username = "dakaum") {
    const Streamers = this.getStreamers(true);
    let streamerExist = false;

    for (let i = 0; i < Streamers.length; i++) {
      const user = Streamers[i];
      
      if (user.name === username) {
        streamerExist = user;
        break;
      }
    }

    return streamerExist;
  }

  /** 
   * @param {String} userId id de l'utilisateur liée au compte twitch
   * @param {String} streamerName nom du streamer
  */
  async addStreamer(userId, streamerName) {
    const streamers = this.getStreamers();
    streamers[streamerName] = userId;

    const formatted = JSON.stringify(streamers, null, 4);
    await writeFileSync(this.baseUrl, formatted);
  }

  /** 
   * @param {String} streamerName nom du streamer
  */
  async removeStreamer(streamerName) {
    const streamers = this.getStreamers();
    streamers[streamerName] = undefined;

    const formatted = JSON.stringify(streamers, null, 4);
    await writeFileSync(this.baseUrl, formatted);
  }

  /** 
   * @param {Object} streamers object des Streamers
   * @return {Number} Nombres de pages a afficher
  */
  getPages(streamers) {
    return Math.ceil(streamers.length / this.endPagination);
  }

  /** 
   * @param {CommandInteraction} interaction object d'interaction
  */
  async embedStreamersPagination(interaction) {
    const ephemeral_list = interaction.options.getBoolean("ephemeral") ?? false;
    const Streamers = this.getStreamers(true);
    const numberOfPages = this.getPages(Streamers);
    console.log("numberOfPages", numberOfPages);

    const EmbedFields = [];
    const LimitShow = Streamers.length > this.endPagination ? this.endPagination : Streamers.length;
    
    for (let i = 0; i < LimitShow; i++) {
      const streamer = Streamers[i];

      EmbedFields.push({
        name: `${streamer.name}`,
        value: `<@${streamer.userId}> → [**Twitch**](https://twitch.tv/${streamer.name})`,
        inline: true
      });
    }
    
    const embedFooterText = Streamers.length > this.endPagination ? `${this.endPagination}/${Streamers.length}` : Streamers.length;
    const listEmbed = new EmbedBuilder();
    listEmbed.setTitle(`Liste des streameurs ${serverName} (${Streamers.length})`);
    listEmbed.setColor(Colors.Red);
    listEmbed.setDescription(`Cette liste de streameur est celle qui appartient a notre serveur ${serverName}`);
    listEmbed.addFields(EmbedFields);
    listEmbed.setThumbnail(iconURL ?? null);
    listEmbed.setTimestamp();
    listEmbed.setFooter({ 
      text: `${embedFooterText} Streameur(s) affiché`,
      iconURL: iconURL
    })

    if (Streamers.length > this.endPagination) {
      const button_prec = new ButtonBuilder();
      button_prec.setCustomId("backward_streamer");
      button_prec.setLabel("Précédent");
      button_prec.setDisabled(true);
      button_prec.setStyle(ButtonStyle.Secondary);
      button_prec.setEmoji("◀")

      const button_suiv = new ButtonBuilder();
      button_suiv.setCustomId("forward_streamer");
      button_suiv.setLabel("Suivant");
      button_suiv.setStyle(ButtonStyle.Secondary);
      button_suiv.setEmoji("▶")

      const buttons_list = new ActionRowBuilder().addComponents(button_prec, button_suiv);

      await interaction.reply({ 
        embeds: [listEmbed], 
        components: [buttons_list], 
        ephemeral: ephemeral_list
      });
    } else {
      await interaction.reply({ 
        embeds: [listEmbed], 
        ephemeral: ephemeral_list
      });
    }
  }
}

module.exports = {
  Streamer: Streamer
};