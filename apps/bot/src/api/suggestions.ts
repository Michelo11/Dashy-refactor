import { prisma, Status } from "@repo/database";
import { Hono } from "hono";
import authorized from "../middlewares/authorized";
import { hono } from "../main";

const guilds = new Hono().basePath("/guilds/:id/suggestions");

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

  const suggestions = await prisma.suggestion.findMany({
    where: {
      guildId: id,
    },
  });

  return ctx.json(suggestions);
});

guilds.post("/:suggestion/accept", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const suggestionId = ctx.req.param("suggestion");

  const suggestion = await prisma.suggestion.findUnique({
    where: {
      id: parseInt(suggestionId),
      guildId: id,
    },
  });

  if (!suggestion) {
    ctx.status(404);
    return ctx.json({
      error: "Suggestion not found",
    });
  }

  await prisma.suggestion.update({
    where: {
      id: parseInt(suggestionId),
    },
    data: {
      status: Status.APPROVED,
    },
  });

  return ctx.json({
    message: "Suggestion accepted",
    success: true,
  });
});

guilds.post("/:suggestion/deny", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const suggestionId = ctx.req.param("suggestion");

  const suggestion = await prisma.suggestion.findUnique({
    where: {
      id: parseInt(suggestionId),
      guildId: id,
    },
  });

  if (!suggestion) {
    ctx.status(404);
    return ctx.json({
      error: "Suggestion not found",
    });
  }

  await prisma.suggestion.update({
    where: {
      id: parseInt(suggestionId),
    },
    data: {
      status: Status.DENIED,
    },
  });

  return ctx.json({
    message: "Suggestion denied",
    success: true,
  });
});

hono.route("/", guilds);
export default guilds;