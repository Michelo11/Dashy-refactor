import { EventType, prisma } from "@repo/database";
import { User } from "discord-oauth2";
import { Hono } from "hono";
import { bot, hono } from "../main.js";
import authorized from "../middlewares/authorized";

type Variables = {
  user: User;
};

const guilds = new Hono<{ Variables: Variables }>().basePath(
  "/guilds/:id/events"
);

guilds.post("/:eventId", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const eventId = ctx.req.param("eventId");
  const body = await ctx.req.json();

  if (!body.channel) {
    ctx.status(400);
    return ctx.json({
      error: "Channel is required",
    });
  }

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));
  const channel = guild.channels.cache.get(body.channel);

  if (!channel || !channel.isTextBased()) {
    ctx.status(400);
    return ctx.json({
      error: "Channel not found",
    });
  }

  if (!Object.values(EventType).includes(eventId as any)) {
    ctx.status(400);
    return ctx.json({
      error: "Event not found",
    });
  }

  await prisma.eventLogConfig.upsert({
    where: {
      guildId_event: {
        guildId: id,
        event: eventId as EventType,
      },
    },
    update: {
      channelId: channel.id,
    },
    create: {
      guildId: id,
      event: eventId as EventType,
      channelId: channel.id,
    },
  });

  return ctx.json({ success: true });
});

guilds.get("/:eventId", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const eventId = ctx.req.param("eventId");

  if (!Object.values(EventType).includes(eventId as any)) {
    ctx.status(400);
    return ctx.json({
      error: "Event not found",
    });
  }

  const data = await prisma.eventLogConfig.findUnique({
    where: {
      guildId_event: {
        guildId: id,
        event: eventId as EventType,
      },
    },
    select: {
      channelId: true,
      embedId: true,
    },
  });

  return ctx.json(
    data || {
      channelId: null,
      embedId: null,
    }
  );
});

hono.route("/", guilds);
export default guilds;
