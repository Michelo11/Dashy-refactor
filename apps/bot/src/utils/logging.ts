import { EventType, prisma } from "@repo/database";
import { Guild } from "discord.js";
import { createEmbed } from "./embeds";

export async function logAction(
  event: EventType,
  guild: Guild,
  placeholders: Record<string, string>
) {
  const settings = await prisma.eventLogConfig.findFirst({
    where: {
      guildId: guild.id,
      event: event,
    },
    include: {
      embed: true,
    },
  });

  if (!settings?.embed) return;

  const channel =
    guild.channels.cache.get(settings.channelId) ||
    (await guild.channels.fetch(settings.channelId));

  if (!channel?.isTextBased()) return;

  channel
    .send({
      embeds: [createEmbed(settings.embed, placeholders)],
    })
    .catch(() => {});
}