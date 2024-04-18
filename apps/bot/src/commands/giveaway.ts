import { prisma } from "database";
import { ButtonInteraction } from "discord.js";
import { Discord, ButtonComponent } from "discordx";

@Discord()
class Giveaway {
  @ButtonComponent({ id: "giveaway_join" })
  async giveawayJoin(interaction: ButtonInteraction): Promise<void> {
    await prisma.giveawayParticipant.create({
      data: {
        giveaway: {
          connect: {
            messageId: interaction.message.id,
          },
        },
        userId: interaction.user.id,
      },
    });

    await interaction.reply({
      content: "You have joined the giveaway!",
      ephemeral: true,
    });
  }
}