import { prisma } from "database";
import {
  ActionRowBuilder,
  CommandInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Discord, ModalComponent, Slash, SlashGroup } from "discordx";
import { createEmbed } from "../../utils/embeds";

@Discord()
@SlashGroup({ name: "suggestion", description: "Commands for suggestions" })
class Suggestion {
  @Slash({ description: "Make a new suggestion" })
  async suggest(interaction: CommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setTitle("Create a new suggestion")
      .setCustomId("suggest_modal");

    const suggestInputComponent = new TextInputBuilder()
      .setCustomId("content")
      .setLabel("Your suggestion:")
      .setStyle(TextInputStyle.Paragraph);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      suggestInputComponent
    );

    modal.addComponents(row);

    await interaction.showModal(modal);
  }

  @ModalComponent({ id: "suggest_modal" })
  async suggestForm(interaction: ModalSubmitInteraction): Promise<void> {
    const content = interaction.fields.getTextInputValue("content");
    const suggestion = await prisma.suggestion.create({
      data: {
        description: content,
        author: interaction.user.id,
        guildId: interaction.guildId!,
      },
      include: {
        guild: {
          select: {
            suggestionChannel: true,
            suggestionEmbed: true,
          },
        },
      },
    });

    if (
      !suggestion.guild.suggestionChannel ||
      !suggestion.guild.suggestionEmbed
    ) {
      interaction.reply({
        content: "Suggestion are not set up",
        ephemeral: true,
      });

      return;
    }

    const channel = interaction.guild?.channels.cache.get(
      suggestion.guild.suggestionChannel
    ) as TextChannel;

    if (!channel) {
      interaction.reply({
        content: "Suggestion channel not found",
        ephemeral: true,
      });

      return;
    }

    const message = await channel.send({
      embeds: [
        createEmbed(suggestion.guild.suggestionEmbed, {
          description: suggestion.description,
          id: suggestion.id.toString(),
          user: interaction.user.toString(),
          status: suggestion.status,
        }),
      ],
    });

    interaction.reply({
      content: "Suggestion sent!",
      ephemeral: true,
    });

    await prisma.suggestion.update({
      where: {
        id: suggestion.id,
      },
      data: {
        messageId: message.id,
      },
    });

    return;
  }
}
