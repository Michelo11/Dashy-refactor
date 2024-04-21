import { prisma } from "@repo/database";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { bot, hono } from "../main.js";
import authorized from "../middlewares/authorized";
import { createEmbed } from "../utils/embeds";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const guilds = new Hono().basePath("/guilds/:id/giveaways");

guilds.get("/", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const guildData = await prisma.guild.findUnique({
    where: {
      id,
    },
  });

  if (!guildData) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const giveaways = await prisma.giveaway.findMany({
    where: {
      guildId: id,
    },
  });

  return ctx.json(giveaways);
});

const schema = z.object({
  title: z.string(),
  description: z.string(),
  channelId: z.string(),
  winnerCount: z.number().min(1),
  endsAt: z.number(),
});

guilds.post(
  "/new",
  authorized,
  validator("json", (value, ctx) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      ctx.status(400);
      return ctx.json({
        error: parsed.error.errors,
      });
    }

    return parsed.data;
  }),
  async (ctx) => {
    const id = ctx.req.param("id");
    const body = ctx.req.valid("json");

    const guildData = await prisma.guild.findUnique({
      where: {
        id,
      },
      select: {
        giveawayEmbed: true,
      },
    });

    if (!guildData || !guildData.giveawayEmbed) {
      ctx.status(404);
      return ctx.json({
        error: "Guild not found",
      });
    }

    let giveaway = await prisma.giveaway.create({
      data: {
        guildId: id,
        title: body.title,
        description: body.description,
        channelId: body.channelId,
        winnerCount: body.winnerCount,
        endsAt: new Date(body.endsAt),
      },
    });

    const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));
    const channel =
      guild.channels.cache.get(body.channelId) ||
      (await guild.channels.fetch(body.channelId));

    if (!channel?.isTextBased()) {
      ctx.status(400);
      return ctx.json({
        error: "Channel is not a text channel",
      });
    }

    const message = await channel.send({
      embeds: [
        createEmbed(guildData.giveawayEmbed, {
          title: giveaway.title,
          description: giveaway.description,
          winnerCount: giveaway.winnerCount.toString(),
          endsAt: (giveaway.endsAt.getTime() / 1000).toString(),
        }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("giveaway_join")
            .setLabel("Join giveaway")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });

    giveaway = await prisma.giveaway.update({
      where: {
        id: giveaway.id,
      },
      data: {
        messageId: message.id,
      },
    });

    return ctx.json(giveaway);
  }
);

guilds.get("/:giveaway", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const giveawayId = ctx.req.param("giveaway");

  const guildData = await prisma.guild.findUnique({
    where: {
      id,
    },
  });

  if (!guildData) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const giveaway = await prisma.giveaway.findFirst({
    where: {
      id: parseInt(giveawayId),
    },
  });

  if (!giveaway) {
    ctx.status(404);
    return ctx.json({
      error: "Giveaway not found",
    });
  }

  return ctx.json(giveaway);
});

guilds.delete("/:giveaway", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const giveawayId = ctx.req.param("giveaway");

  const guildData = await prisma.guild.findUnique({
    where: {
      id,
    },
  });

  if (!guildData) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const giveaway = await prisma.giveaway.findFirst({
    where: {
      id: parseInt(giveawayId),
    },
  });

  if (!giveaway) {
    ctx.status(404);
    return ctx.json({
      error: "Giveaway not found",
    });
  }

  await prisma.giveaway.delete({
    where: {
      id: giveaway.id,
    },
  });

  return ctx.json({
    success: true,
  });
});

hono.route("/", guilds);
export default guilds;