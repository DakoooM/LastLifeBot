require("dotenv/config");

const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  CommandInteraction,
  ButtonBuilder,
  Colors,
  ActionRowBuilder
} = require("discord.js");

const {
  iconURL,
  linksEmbedUtils,
  serverName,
  TouchesEnJeuEmbed
} = require("../config.json");

module.exports = {
  moderation: true,
  data: new SlashCommandBuilder()
    .setName("info")
    .addSubcommand(subcmd =>
      subcmd.setName("ip")
        .setDescription("avoir l'adresse ip du serveur")
    )
    .addSubcommand(subcmd =>
      subcmd.setName("wl")
        .setDescription("avoir des informations sur les whitelist")
    )
    .addSubcommand(subcmd =>
      subcmd.setName("boutique")
        .setDescription("avoir des informations sur la boutique")
    )
    .addSubcommand(subcmd =>
      subcmd.setName("touches")
        .setDescription("avoir des informations sur les touches en jeu")
    )
    .addSubcommand(subcmd =>
      subcmd.setName("links")
        .setDescription("avoir les liens utiles du serveur")
    )
    .addSubcommand(subcmd =>
      subcmd.setName("heberg")
        .setDescription("avoir les informations sur l'hébergeur du serveur")
    )
    .setDescription("avoir des informations concernant le serveur."),


  /** 
      @param {Client} client
      @param {CommandInteraction} interaction
  **/
  async execute(client, interaction) {
    if (!interaction.options.getSubcommand()) return interaction.reply({ content: "Erreur, vous devez renseigner une sous commande." })

    switch (interaction.options.getSubcommand()) {
      case "ip":
        const ipEmbed = new EmbedBuilder();
        ipEmbed.setTitle("Envie de se connecter au serveur ?");
        ipEmbed.setColor(Colors.Red);
        ipEmbed.setDescription("Rien de plus simple ! Il suffit de suivre ce lien :point_right: https://cfx.re/join/5q69dr ou de cliquer sur le boutton ci-dessous");
        ipEmbed.setThumbnail(iconURL ?? null);
        ipEmbed.setTimestamp();

        const joinLink = new ButtonBuilder();
        joinLink.setLabel("Se connecter");
        joinLink.setStyle("Link");
        joinLink.setURL("https://cfx.re/join/5q69dr");

        const buttons = new ActionRowBuilder().addComponents(joinLink);

        await interaction.reply({ embeds: [ipEmbed], components: [buttons] });
        break;
      case "wl":
        const wlUrl = "https://lastlife.gitbook.io/lastlife-wiki/tutoriels#comment-passer-sa-wl";
        const wlEmbed = new EmbedBuilder();
        wlEmbed.setTitle("WhiteList sur LastLife RP");
        wlEmbed.setColor(Colors.Red);
        wlEmbed.setDescription("Pour le moment, LastLife RP est en semi-wl, ce qui signifie que le simple fait d'être sur ce Discord te permet de te connecter au serveur. Les entretiens pour passer les whitelist ont tout de même commencé afin de prendre un peu d'avance.");
        wlEmbed.addFields({ name: "Retrouve toutes les informations nécessaires sur notre wiki", value: `[Cliquez ici](${wlUrl})` })
        wlEmbed.setThumbnail(iconURL ?? null);
        wlEmbed.setTimestamp();

        const btnWl = new ButtonBuilder();
        btnWl.setLabel("Voir les informations");
        btnWl.setStyle("Link");
        btnWl.setURL(wlUrl);

        const btnsWl = new ActionRowBuilder().addComponents(btnWl);

        await interaction.reply({ embeds: [wlEmbed], components: [btnsWl] });
        break;
      case "boutique":
        const BoutiqueUrl = "https://lastlife-store.tebex.io/";
        const BoutiqueEmbed = new EmbedBuilder();
        BoutiqueEmbed.setAuthor({ name: `Informations de la Boutique ${serverName}`, url: BoutiqueUrl });
        BoutiqueEmbed.setColor(Colors.Red);
        BoutiqueEmbed.setDescription(`
          Voici la procédure à suivre pour faire un achat via la boutique :

          - Lien du compte CFX avec FiveM
          - CFX : Lien sur le bouton "CFX"
          - Sur FIVEM connectez-vous avec votre compte CFX\n
          - Puis en jeu, appuyez sur F4 pour accéder à la boutique en jeu.
          - Vous recevrez ensuite vos points boutique directement IG.\n
          :information_source: Vous devrez attendre environ 20min avant que vos achats soient confirmés. En cas de problème, n'hésitez pas à ouvrir un ticket sur ce serveur !
        `);

        BoutiqueEmbed.addFields({ name: "Lien de la boutique", value: `[Cliquez ici](${BoutiqueUrl})` })
        BoutiqueEmbed.setThumbnail(iconURL ?? null);
        BoutiqueEmbed.setTimestamp();

        const btnBoutique = new ButtonBuilder();
        btnBoutique.setLabel("Accèdez a la Boutique");
        btnBoutique.setStyle("Link");
        btnBoutique.setURL(BoutiqueUrl);

        const btnsBoutique = new ActionRowBuilder().addComponents(btnBoutique);

        await interaction.reply({ embeds: [BoutiqueEmbed], components: [btnsBoutique] });
        break;
      case "touches":
        const allKeys = Object.keys(TouchesEnJeuEmbed).map((val, key) => {
          console.log( val, TouchesEnJeuEmbed[val] );

          return {
            name: val,
            value: "`" + TouchesEnJeuEmbed[val] + "`",
            inline: false
          }
        });

        const keysEmbed = new EmbedBuilder();
        keysEmbed.setTitle("Les Touches en jeu");
        keysEmbed.setColor(Colors.Red);
        keysEmbed.setDescription("Voici les différentes touches de jeu sur le serveur LastLife RP :");
        keysEmbed.addFields(allKeys);
        keysEmbed.setThumbnail(iconURL ?? null);
        keysEmbed.setTimestamp();

        await interaction.reply({ embeds: [keysEmbed] });
        break;
      case "links":

        const LinksEmbed = new EmbedBuilder();
        LinksEmbed.setTitle(`Liens utiles concernant ${serverName}`);
        LinksEmbed.setColor(Colors.Red);
        LinksEmbed.setDescription("Ces liens vous permettront d'accéder à des informations importantes pour le serveur.");
        LinksEmbed.addFields(
          linksEmbedUtils.map(resp => {
            return {
              name: `${resp.emoji} ${resp.name}`,
              value: resp.value
            }
          })
        );

        LinksEmbed.setThumbnail(iconURL ?? null);
        LinksEmbed.setTimestamp();

        const buttonsLinks = [];
        linksEmbedUtils.map(info => {
          const btnLink = new ButtonBuilder();
          btnLink.setLabel(info.name);
          btnLink.setStyle("Link");
          btnLink.setEmoji({ name: info.emoji });
          btnLink.setURL(info.link);

          buttonsLinks.push(btnLink);
        })

        const btnsLinks = new ActionRowBuilder().addComponents(buttonsLinks);

        await interaction.reply({ embeds: [LinksEmbed], components: [btnsLinks] });
        break;
      case "heberg":
        const HebergUrl = "https://discord.gg/KvqvpuzgQq";

        const HebergEmbed = new EmbedBuilder();
        HebergEmbed.setTitle("Notre hébergeur");
        HebergEmbed.setColor(Colors.Red);
        HebergEmbed.setDescription("Nous avons fait le choix d'utiliser Senaheberg pour l’hébergement du serveur LastLife RP. Grâce à eux, nous pouvons avoir une machine nous permettant de vous fournir la meilleur qualité de jeu possible.");
        HebergEmbed.addFields({ 
          name: "Leur discord", 
          value: `Et vous savez quoi ? Senaheberg possède même un serveur Discord sur lequel vous pouvez vous rendre dès maintenant :point_right: [Lien discord](${HebergUrl})`
        });

        HebergEmbed.setThumbnail(iconURL ?? null);
        HebergEmbed.setTimestamp();

        const btnHeberg = new ButtonBuilder();
        btnHeberg.setLabel("Rejoindre leur Discord");
        btnHeberg.setStyle("Link");
        btnHeberg.setURL(HebergUrl);

        const btnsHeberg = new ActionRowBuilder().addComponents(btnHeberg);

        await interaction.reply({ embeds: [HebergEmbed], components: [btnsHeberg] });
        break;
    }
  }
}