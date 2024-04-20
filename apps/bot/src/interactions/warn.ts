import { EventType, prisma } from "@repo/database";
import {
  ActionRowBuilder,
  ApplicationCommandType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { Discord, ContextMenu } from "discordx";
import { createEmbed } from "../utils/embeds";
import { logAction } from "../utils/logging";

@Discord()
class Warn {
  @ContextMenu({
    name: "Warn",
    type: ApplicationCommandType.User,
  })
  async warn(interaction: UserContextMenuCommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setTitle("Warn a user")
      .setCustomId("warn")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("reason")
            .setPlaceholder("Reason")
            .setLabel("Reason")
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    interaction.showModal(modal);

    const reasonModal = await interaction.awaitModalSubmit({
      time: 60000,
    });

    if (!reasonModal) {
      return;
    }

    const reason = reasonModal.fields.getTextInputValue("reason");

    if (!reason) {
      return;
    }

    const user = interaction.targetUser;
    const guild = interaction.guild;

    if (!guild) {
      return;
    }

    const data = await prisma.warn.create({
      data: {
        guildId: guild.id,
        userId: user.id,
        reason: reason,
        moderator: interaction.user.id,
      },
      select: {
        guild: {
          select: {
            warnEmbed: true,
          },
        },
      },
    });

    if (!data.guild.warnEmbed) {
      await reasonModal.reply({
        content: "The warn embed is not set up",
        ephemeral: true,
      });
      return;
    }

    const warns = await prisma.warn.count({
      where: {
        guildId: guild.id,
        userId: user.id,
      },
    });

    const embed = createEmbed(data.guild.warnEmbed, {
      user: user.toString(),
      moderator: interaction.user.toString(),
      reason,
      warns: warns.toString(),
    });

    reasonModal.reply({
      content: "User has been warned",
      ephemeral: true,
    });

    user
      .send({
        embeds: [embed],
      })
      .catch(() => {});

    await logAction(EventType.GUILD_WARN_CREATE, interaction.guild, {
      user: user.toString(),
      moderator: interaction.user.toString(),
      reason,
      warns: warns.toString(),
    });
  }
}