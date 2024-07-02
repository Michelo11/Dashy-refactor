import { prisma } from "@repo/database";
import DiscordOauth2, { User } from "discord-oauth2";
import { ChannelType } from "discord.js";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { bot, hono } from "../main.js";
import authenticated from "../middlewares/authenticated";
import authorized from "../middlewares/authorized";

type Variables = {
  user: User;
};

const guilds = new Hono<{ Variables: Variables }>().basePath("/guilds/:id");

hono.get("/guilds", authenticated, async (ctx) => {
  const guilds = bot.guilds.cache
    .filter((guild) => guild.members.cache.has(ctx.get("user").id))
    .map((guild) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
    }));

  return ctx.json(guilds);
});

hono.get("/guilds/me", authenticated, async (ctx) => {
  const token = getCookie(ctx, "token");
  const oauth = new DiscordOauth2();
  const guilds = await oauth.getUserGuilds(token!);

  return ctx.json(
    guilds.map((guild) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      bot: bot.guilds.cache.has(guild.id),
      owner: guild.owner || false,
    }))
  );
});

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
  const member = guild.members.me || (await guild.members.fetch(bot.user!.id));

  await member.setNickname(body.name);

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

guilds.post("/prefix", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const body = await ctx.req.json();

  if (!body.prefix) {
    ctx.status(400);
    return ctx.json({
      error: "Prefix is required",
    });
  }

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  await prisma.guild.upsert({
    where: {
      id: guild.id,
    },
    create: {
      id: guild.id,
      prefix: body.prefix,
    },
    update: {
      prefix: body.prefix,
    },
  });

  await prisma.logRecord.create({
    data: {
      guildId: guild.id,
      message: `Prefix set to ${body.prefix}`,
      author: ctx.get("user").id,
    },
  });

  return ctx.json({
    success: true,
  });
});

guilds.get("/prefix", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const guild = await prisma.guild.findUnique({
    where: {
      id,
    },
  });

  return ctx.json(guild!.prefix);
});

guilds.get("/name", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));
  const member = guild.members.me || (await guild.members.fetch(bot.user!.id));

  return ctx.json(member?.nickname || member?.user.username);
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

  return ctx.json(
    guild.roles.cache.map((role) => ({
      id: role.id,
      name: role.name,
      color: role.color,
    }))
  );
});

guilds.get("/role", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const guild = await prisma.guild.findUnique({
    where: {
      id,
    },
  });

  return ctx.json(guild!.role);
});

guilds.get("/channels", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  return ctx.json(
    guild.channels.cache
      .filter((channel) => channel.type === ChannelType.GuildText)
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
      }))
  );
});

guilds.get("/logs", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const logs = await prisma.logRecord.findMany({
    where: {
      guildId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return ctx.json(logs);
});

hono.route("/", guilds);
export default guilds;
