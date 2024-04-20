import { Hono } from "hono";
import authorized from "../middlewares/authorized";
import { bot, hono } from "../main.js";
import { prisma } from "@repo/database";
import { User } from "discord-oauth2";

type Variables = {
  user: User;
};

const guilds = new Hono<{ Variables: Variables }>().basePath(
  "/guilds/:id"
);

guilds.post("/rename", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const body = await ctx.req.json();

  if (!body.name) {
    ctx.status(400);
    return ctx.json({
      error: "Name is required",
    });
  }

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  guild.members.me?.setNickname(body.name);

  await prisma.logRecord.create({
    data: {
      guildId: guild.id,
      message: `Renamed to ${body.name}`,
      author: ctx.get("user").id,
    },
  });

  return ctx.json({
    success: true,
  });
});

guilds.post("/role", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const body = await ctx.req.json();

  if (!body.role) {
    ctx.status(400);
    return ctx.json({
      error: "Role is required",
    });
  }

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  await prisma.guild.upsert({
    where: {
      id: guild.id,
    },
    create: {
      id: guild.id,
      role: body.role,
    },
    update: {
      role: body.role,
    },
  });

  await prisma.logRecord.create({
    data: {
      guildId: guild.id,
      message: `Role set to ${body.role}`,
      author: ctx.get("user").id,
    },
  });

  return ctx.json({
    success: true,
  });
});

guilds.get("/roles", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  return ctx.json({
    roles: guild.roles.cache.map((role) => ({
      id: role.id,
      name: role.name,
      color: role.color,
    })),
  });
});

hono.route("/", guilds);