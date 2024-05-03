import { Embed } from "@repo/database";
import { ColorResolvable, EmbedBuilder } from "discord.js";

export function createEmbed(
  embedData: Embed,
  placeholders: Record<string, string>
) {
  let title = embedData.title;
  let description = embedData.description;

  for (const [key, value] of Object.entries(placeholders)) {
    if (title) title = title.replace(`{${key}}`, value);
    if (description) description = description.replace(`{${key}}`, value);
  }

  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description ? description.replaceAll("\\n", "\n") : null)
    .setColor(embedData.color as ColorResolvable || "#1D4ED8")
    .setTimestamp()
    .setFooter({
      text: "Dashy",
      iconURL: "https://i.imgur.com/v3RMOan.png",
    });
}