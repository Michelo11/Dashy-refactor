import { prisma } from "@repo/database";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";
import { createEmbed } from "../utils/embeds";
import { saveTranscript } from "../utils/tickets.js";

@Discord()
class Ticket {
  @ButtonComponent({ id: "ticket_create" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    const guild = await prisma.guild.findFirst({
      where: { id: interaction.guildId! },
      select: {
        ticketCategory: true,
        ticketEmbed: true,
      },
    });

    if (!guild || !guild.ticketCategory || !guild.ticketEmbed) {
      interaction.reply({
        content: "Ticket system is not set up",
        ephemeral: true,
      });

      return;
    }

    const channel = await interaction.guild?.channels.create({
      name: "ticket-" + interaction.user.username,
      parent: guild.ticketCategory,
      permissionOverwrites: [
        {
          id: interaction.guildId!,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });

    if (!channel) {
      interaction.reply({
        content: "Failed to create a ticket channel",
        ephemeral: true,
      });

      return;
    }

    await channel.send({
      embeds: [
        createEmbed(guild.ticketEmbed, {
          user: interaction.user.toString(),
          channel: channel.toString(),
        }),
      ],
    });

    await prisma.ticket.create({
      data: {
        owner: interaction.user.id,
        id: channel.id,
        guildId: interaction.guildId!,
      },
    });

    interaction.reply({
      content: "Ticket created",
      ephemeral: true,
    });
  }

  @Slash({ description: "Send ticket panel message", name: "panel" })
  async panel(interaction: CommandInteraction): Promise<void> {
    const guild = await prisma.guild.findFirst({
      where: { id: interaction.guildId! },
      select: {
        ticketPanelEmbed: true,
      },
    });

    if (!guild || !guild.ticketPanelEmbed) {
      interaction.reply({
        content: "Ticket system is not set up",
        ephemeral: true,
      });

      return;
    }

    await interaction.reply({
      embeds: [createEmbed(guild.ticketPanelEmbed, {})],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket_create")
            .setLabel("Create a ticket")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  }

  @Slash({ description: "Close a ticket channel", name: "close" })
  async close(interaction: CommandInteraction): Promise<void> {
    const guild = await prisma.guild.findFirst({
      where: { id: interaction.guildId! },
      select: {
        ticketCategory: true,
      },
    });

    if (!guild || !guild.ticketCategory) {
      interaction.reply({
        content: "Ticket system is not set up",
        ephemeral: true,
      });

      return;
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id: interaction.channelId!,
        guildId: interaction.guildId!,
      },
    });

    if (!ticket || ticket.owner !== interaction.user.id) {
      interaction.reply({
        content: "You are not the owner of this ticket",
        ephemeral: true,
      });

      return;
    }

    const channel = interaction.channel as TextChannel;

    await saveTranscript(channel, ticket.owner);

    await channel.delete();

    await prisma.ticket.delete({
      where: { id: interaction.channelId! },
    });

    interaction.reply({
      content: "Ticket closed",
      ephemeral: true,
    });
  }
}