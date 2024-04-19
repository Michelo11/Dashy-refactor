import { Hono } from "hono";
import authorized from "../middlewares/authorized";
import { prisma } from "database";
import { bot, hono } from "../main.js";

const guilds = new Hono().basePath("/guilds/:id/tickets");

guilds.get("/", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const guild = await prisma.guild.findFirst({
    where: {
      id,
    },
  });

  if (!guild) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      guildId: id,
    },
  });

  return ctx.json({
    tickets,
  });
});

guilds.get("/:ticket", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const ticketId = ctx.req.param("ticket");
  const { limit } = ctx.req.query();

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
      guildId: id,
    },
  });

  if (!ticket) {
    ctx.status(404);
    return ctx.json({
      error: "Ticket not found",
    });
  }

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  if (!guild) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const channel =
    guild.channels.cache.get(ticket.id) ||
    (await guild.channels.fetch(ticket.id));

  if (!channel || !channel.isTextBased()) {
    ctx.status(404);
    return ctx.json({
      error: "Channel not found",
    });
  }

  const messages = await channel.messages.fetch({
    limit: limit ? parseInt(limit) : 50,
  });

  return ctx.json({
    messages: messages.map((message) => ({
      id: message.id,
      content: message.content,
      author: {
        id: message.author.id,
        username: message.author.username,
        avatar: message.author.avatarURL(),
      },
    })),
  });
});

guilds.delete("/:ticket", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const ticketId = ctx.req.param("ticket");

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
      guildId: id,
    },
  });

  if (!ticket) {
    ctx.status(404);
    return ctx.json({
      error: "Ticket not found",
    });
  }

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  if (!guild) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const channel =
    guild.channels.cache.get(ticket.id) ||
    (await guild.channels.fetch(ticket.id));

  if (!channel || !channel.isTextBased()) {
    ctx.status(404);
    return ctx.json({
      error: "Channel not found",
    });
  }

  await channel.delete();

  await prisma.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return ctx.json({
    success: true,
  });
});

hono.route("/", guilds);