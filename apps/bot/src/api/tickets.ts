import { prisma } from "@repo/database";
import { MessageCollector, TextBasedChannel, TextChannel } from "discord.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bot, hono, upgradeWebSocket } from "../main.js";
import authorized from "../middlewares/authorized";
import { saveTranscript } from "../utils/tickets.js";

const guilds = new Hono().basePath("/guilds/:id/tickets");

guilds.get(
  "/:ticket/ws",
  cors({
    origin: "*",
    allowHeaders: ["Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
  authorized,
  upgradeWebSocket((ctx) => {
    let textChannel: TextBasedChannel | undefined;
    let collector: MessageCollector | undefined;

    return {
      onOpen(_, ws) {
        const id = ctx.req.param("id");
        const ticketId = ctx.req.param("ticket");

        const ticket = prisma.ticket.findUnique({
          where: {
            id: ticketId,
            guildId: id,
          },
        });

        if (!ticket) {
          ws.close(404, "Ticket not found");
          return;
        }

        const channel = bot.guilds.cache.get(id)?.channels.cache.get(ticketId);

        if (!channel || !channel.isTextBased()) {
          ws.close(404, "Channel not found");
          return;
        }

        textChannel = channel;

        collector = channel.createMessageCollector();

        collector.on("collect", (message) => {
          ws.send(
            JSON.stringify({
              id: message.id,
              content: message.content,
              author: {
                id: message.author.id,
                username: message.author.username,
                avatar: message.author.avatarURL(),
              },
            })
          );
        });

        collector.on("end", () => {
          ws.close();
        });
      },

      async onMessage(event) {
        if (event.data.toString() === "/close") {
          await textChannel?.delete();

          if (textChannel)
            await prisma.ticket.delete({
              where: { id: textChannel.id },
            });

          return;
        }

        textChannel?.send(event.data.toString());
      },

      onClose() {
        collector?.stop();
      },
    };
  })
);

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

  return ctx.json(tickets);
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

  return ctx.json(
    messages.map((message) => ({
      id: message.id,
      content: message.content,
      author: {
        id: message.author.id,
        username: message.author.username,
        avatar: message.author.avatarURL(),
      },
    }))
  );
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

  await saveTranscript(channel as TextChannel, ticket.owner);

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

guilds.patch("/:ticket/edit/:message", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const ticketId = ctx.req.param("ticket");
  const messageId = ctx.req.param("message");

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

  const message = await channel.messages.fetch(messageId);

  if (!message || !message.editable) {
    ctx.status(404);
    return ctx.json({
      error: "Message not found or not editable",
    });
  }

  const { content } = await ctx.req.json();

  await message.edit(content);

  return ctx.json({
    success: true,
  });
});

guilds.delete("/:ticket/delete/:message", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const ticketId = ctx.req.param("ticket");
  const messageId = ctx.req.param("message");

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

  const message = await channel.messages.fetch(messageId);

  if (!message || !message.deletable) {
    ctx.status(404);
    return ctx.json({
      error: "Message not found or not deletable",
    });
  }

  await message.delete();

  return ctx.json({
    success: true,
  });
});

guilds.post("/:ticket/reply", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const ticketId = ctx.req.param("ticket");
  const messageId = ctx.req.query("message");

  if (!messageId) {
    ctx.status(400);
    return ctx.json({
      error: "Message query parameter is required",
    });
  }

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

  const message = await channel.messages.fetch(messageId);

  if (!message) {
    ctx.status(404);
    return ctx.json({
      error: "Message not found",
    });
  }

  const { content } = await ctx.req.json();

  await message.reply(content);

  return ctx.json({
    success: true,
  });
});

hono.route("/", guilds);
export default guilds;