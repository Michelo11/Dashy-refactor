import { Hono } from "hono";
import authorized from "../middlewares/authorized";
import { bot, hono } from "../main.js";
import { prisma } from "@repo/database";
import { validator } from "hono/validator";
import { z } from "zod";

const guilds = new Hono().basePath("/guilds/:id/levels");

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

  const levels = await prisma.level.findMany({
    where: {
      guildId: id,
    },
  });

  return ctx.json({
    levels,
  });
});

const schema = z.object({
  level: z.number().min(0),
  role: z.string(),
  xp: z.number().min(0),
  name: z.string(),
});

guilds.post(
  "/new",
  authorized,
  validator("json", (value, ctx) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      ctx.status(401);
      return ctx.json({
        error: parsed.error.errors,
      });
    }

    return parsed.data;
  }),
  async (ctx) => {
    const id = ctx.req.param("id");
    const body = ctx.req.valid("json");
    const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

    await prisma.level.create({
      data: {
        guildId: guild.id,
        level: body.level,
        role: body.role,
        xp: body.xp,
        name: body.name,
      },
    });

    return ctx.json({
      success: true,
    });
  }
);

guilds.delete("/:level", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const level = ctx.req.param("level");

  await prisma.level.delete({
    where: {
      guildId: id,
      id: parseInt(level),
    },
  });

  return ctx.json({
    success: true,
  });
});

hono.route("/", guilds);