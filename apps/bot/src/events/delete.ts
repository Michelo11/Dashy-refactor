import { prisma } from "@repo/database";
import { ArgsOf, Discord, On } from "discordx";

@Discord()
class Delete {
  @On({ event: "guildDelete" })
  async onDelete([guild]: ArgsOf<"guildDelete">) {
    await prisma.guild.delete({
      where: {
        id: guild.id,
      },
    });
  }
}