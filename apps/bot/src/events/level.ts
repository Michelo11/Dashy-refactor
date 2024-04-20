import { prisma } from "@repo/database";
import { Discord, On, ArgsOf } from "discordx";
import { createEmbed } from "../utils/embeds";

@Discord()
class Level {
  @On({ event: "messageCreate" })
  async onMessage([message]: ArgsOf<"messageCreate">) {
    if (message.author.bot) return;

    const member = await prisma.guildMember.upsert({
      where: {
        userId_guildId: {
          userId: message.author.id,
          guildId: message.guild!.id,
        },
      },
      update: {
        xp: {
          increment: 1,
        },
      },
      create: {
        userId: message.author.id,
        guildId: message.guild!.id,
        xp: 1,
      },
      include: {
        level: true,
      },
    });

    const newLevel = await prisma.level.findFirst({
      where: {
        AND: [
          {
            xp: {
              lte: member.xp,
            },
          },
          {
            xp: {
              gt: member.level?.xp || -1,
            },
          },
        ],
      },
      orderBy: {
        xp: "desc",
      },
      include: {
        guild: {
          select: {
            levelEmbed: true,
          },
        },
      },
    });

    if (newLevel) {
      await prisma.guildMember.update({
        where: {
          userId_guildId: {
            userId: message.author.id,
            guildId: message.guild!.id,
          },
        },
        data: {
          levelId: newLevel.id,
        },
      });

      if (newLevel.role) message.member?.roles.add(newLevel.role);

      if (newLevel.guild.levelEmbed) {
        message.reply({
          embeds: [
            createEmbed(newLevel.guild.levelEmbed, {
              user: message.author.toString(),
              level: newLevel.name.toString(),
              role: "<@&" + newLevel.role + ">",
              xp: member.xp.toString(),
            }),
          ],
        });
      }
    }
  }
}