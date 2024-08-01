const { ChannelType, EmbedBuilder, PermissionFlagsBits, Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { Roles, iconURL } = require("../config.json");

module.exports = async (client, interaction, customId, checkCategory = false) => {
   const parentInfo = await client.Utils.getInfoTicket(customId, checkCategory);

   if (!parentInfo) return await interaction.reply({
      content: "❌ Les informations pour la création ce ticket n'ont pas été trouver, contactez le développeur du bot.",
      ephemeral: true
   })

   let cExist = interaction.guild.channels.cache.find(channels => channels.topic == interaction.user.id);
   if (cExist) return interaction.reply({ content: `❌ Vous avez déja un ticket d'ouvert, allez voir ici ${cExist}`, ephemeral: true });

   // const administrators = client.guild.members.cache.filter(member => member.has(PermissionFlagsBits.Administrator));

   const permissionsTicket = [
      {
         id: interaction.guild.id,
         deny: [PermissionFlagsBits.ViewChannel]
      },
      {
         id: interaction.guild.roles.cache.get(Roles.equipe_staff),
         allow: [PermissionFlagsBits.ViewChannel]
      },
      {
         id: interaction.user.id,
         allow: [PermissionFlagsBits.ViewChannel]
      },
   ];

 /*   if (administrators && typeof administrators === "object" && administrators.length > 0) {
      administrators.map(({ id }) => {
         permissionsTicket.push({
            id: id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Administrator]
         })
      })
   } */

   try {
      const channel = await interaction.guild.channels.create({
         name: `ticket-${interaction.user.username}`,
         type: ChannelType.GuildText,
         topic: interaction.user.id,
         parent: parentInfo.categoryId,
         permissionOverwrites: permissionsTicket
      });

      interaction.reply({
         content: `vous avez ouvert le ticket ${channel}`,
         ephemeral: true
      }).then(() => {
         const embed = new EmbedBuilder();
         embed.setAuthor({ name: parentInfo.embed.title });
         embed.setDescription(parentInfo.embed.description);
         parentInfo.embed.fields.map(item => embed.addFields(item));
         embed.setColor(Colors.Red);
         // embed.setImage(parentInfo.embed.image);
         embed.setThumbnail(iconURL);
         embed.setTimestamp();

         const closeBtn = new ButtonBuilder();
         closeBtn.setCustomId("close_ticket");
         closeBtn.setLabel("Cloturer");
         closeBtn.setStyle(ButtonStyle.Danger);

         const buttons = new ActionRowBuilder().addComponents(closeBtn);

         channel.send({
            content: `${interaction.user} Vous avez ouvert un ticket, veuillez renseigner votre demande.\n<@&${Roles.equipe_staff}> vous répondera dès qu'il seront disponible.`,
            embeds: [embed],
            components: [buttons]
         })
      })
   } catch (err) {
      console.error(err);

      await interaction.reply({
         content: "❌ La création du salon a échouez, veuillez contactez le développeur du bot.",
         ephemeral: true
      })
   }
}