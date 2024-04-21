import { prisma } from "@repo/database";
import { Hono } from "hono";
import { hono } from "../main.js";
import authorized from "../middlewares/authorized";

const guilds = new Hono().basePath("/guilds/:id/transcripts");

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

  const transcripts = await prisma.ticketTranscript.findMany({
    where: {
      guildId: id,
    },
  });

  return ctx.json(transcripts);
});

guilds.get("/:transcript", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const transcriptId = ctx.req.param("transcript");

  const transcript = await prisma.ticketTranscript.findUnique({
    where: {
      id: transcriptId,
      guildId: id,
    },
  });

  return ctx.json(transcript);
});

hono.route("/", guilds);
export default guilds;
