import { EventType, prisma } from "@repo/database";
import { TextChannel } from "discord.js";
import { logAction } from "./logging.js";

export async function saveTranscript(channel: TextChannel, ownerId: string) {
  const messages = await channel.messages.fetch();
  const json = messages.map((message) => ({
    content: message.content,
    author: {
      username: message.author.username,
      id: message.author.id,
      avatarUrl: message.author.displayAvatarURL(),
    },
    embeds: message.embeds,
    attachments: message.attachments.map((attachment) => ({
      name: attachment.name,
      url: attachment.url,
    })),
  }));

  const transcript = await prisma.ticketTranscript.create({
    data: {
      name: channel.name,
      owner: ownerId,
      id: channel.id,
      data: json,
      guildId: channel.guild.id,
    },
  });

  await logAction(EventType.TRANSCRIPT_CREATE, channel.guild, {
    channel: channel.name,
    id: transcript.id,
  });

  return transcript;
}
