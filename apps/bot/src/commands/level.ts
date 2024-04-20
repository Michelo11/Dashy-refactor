import { prisma } from "@repo/database";
import {
    ApplicationCommandOptionType,
    CommandInteraction,
    User,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
class Level {
  @Slash({ description: "Get the level of a member", name: "level" })
  async level(
    @SlashOption({
      description: "The member or empty for yourself",
      name: "member",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    member: User | null,
    interaction: CommandInteraction
  ): Promise<void> {
    const user = await prisma.guildMember.findUnique({
      where: {
        userId_guildId: {
          guildId: interaction.guildId!,
          userId: member?.id || interaction.user.id,
        },
      },
      select: {
        xp: true,
        level: {
          select: {
            name: true,
          },
        },
      },
    });

    await interaction.reply({
      content: `The level of ${member?.toString() || interaction.user.toString()} is ${user?.level?.name || 0} (${user?.xp || 0})`,
      ephemeral: true,
    });
  }
}
