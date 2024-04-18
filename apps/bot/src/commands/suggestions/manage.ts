import { Status, prisma } from "database";
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  TextChannel,
} from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { createEmbed } from "../../utils/embeds";

@Discord()
@SlashGroup("suggestion")
class ManageSuggestion {
  @Slash({ description: "Accept a suggestion" })
  async accept(
    @SlashOption({
      name: "suggestion",
      description: "The suggestion id to accept",
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    id: number,
    interaction: CommandInteraction
  ) {
    if (await this.manageSuggestion(id, interaction, Status.APPROVED))
      interaction.reply({ content: "Suggestion accepted", ephemeral: true });
  }

  @Slash({ description: "Deny a suggestion" })
  async deny(
    @SlashOption({
      name: "suggestion",
      description: "The suggestion id to deny",
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    id: number,
    interaction: CommandInteraction
  ) {
    if (await this.manageSuggestion(id, interaction, Status.DENIED))
      interaction.reply({ content: "Suggestion denied", ephemeral: true });
  }

  private async manageSuggestion(
    id: number,
    interaction: CommandInteraction,
    status: Status
  ) {
    const suggestionId = await prisma.suggestion.findUnique({
      where: { id, guildId: interaction.guildId! },
    });

    if (!suggestionId) {
      interaction.reply({
        content: "Suggestion not found",
        ephemeral: true,
      });
      return false;
    }

    const suggestion = await prisma.suggestion.update({
      where: { id },
      data: { status },
      include: {
        guild: {
          select: {
            suggestionChannel: true,
            suggestionEmbed: true,
          },
        },
      },
    });

    if (!suggestion) {
      interaction.reply({
        content: "Suggestion not found",
        ephemeral: true,
      });
      return false;
    }

    if (
      !suggestion.guild.suggestionChannel ||
      !suggestion.guild.suggestionEmbed
    ) {
      interaction.reply({
        content: "No suggestion channel set up",
        ephemeral: true,
      });
      return false;
    }

    const channel = interaction.guild?.channels.cache.get(
      suggestion.guild.suggestionChannel
    ) as TextChannel;

    const message = await channel.messages.fetch(suggestion.messageId!);

    if (!message) {
      interaction.reply({
        content: "Suggestion message not found",
        ephemeral: true,
      });
      return false;
    }

    await message.edit({
      embeds: [
        createEmbed(suggestion.guild.suggestionEmbed, {
          description: suggestion.description,
          id: suggestion.id.toString(),
          user: interaction.user.toString(),
          status: suggestion.status,
        }),
      ],
    });

    return true;
  }
}