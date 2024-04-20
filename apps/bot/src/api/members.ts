import { EventType, prisma } from "@repo/database";
import { Hono } from "hono";
import { bot, hono } from "../main.js";
import authorized from "../middlewares/authorized";
import { logAction } from "../utils/logging.js";

const guilds = new Hono().basePath("/guilds/:id/members");

guilds.get("/bans", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  if (!guild) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const bans = await guild.bans.fetch();

  return ctx.json({
    bans: bans.map((ban) => ({
      user: {
        id: ban.user.id,
        username: ban.user.username,
        avatar: ban.user.displayAvatarURL(),
      },
      reason: ban.reason,
    })),
  });
});

guilds.post("/:member/unban", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const memberId = ctx.req.param("member");

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  if (!guild) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const member = await guild.members.unban(memberId);

  if (!member) {
    ctx.status(404);
    return ctx.json({
      error: "Member not found",
    });
  }

  return ctx.json({
    member: {
      id: member.id,
      username: member.username,
      avatar: member.displayAvatarURL(),
    },
  });
});

guilds.get("/warns", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  if (!guild) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const warns = await prisma.warn.findMany({
    where: {
      guildId: id,
    },
  });

  return ctx.json({
    warns,
  });
});

guilds.post("/:member/unwarn", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const memberId = ctx.req.param("member");

  const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));

  if (!guild) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const member = await guild.members.fetch(memberId);

  if (!member) {
    ctx.status(404);
    return ctx.json({
      error: "Member not found",
    });
  }

  await prisma.warn.deleteMany({
    where: {
      guildId: id,
      userId: member.id,
    },
  });

  const warns = await prisma.warn.count({
    where: {
      guildId: id,
      userId: member.id,
    },
  });

  await logAction(EventType.GUILD_WARN_DELETE, guild, {
    user: member.toString(),
    warns: warns.toString(),
  });

  return ctx.json({
    success: true,
  });
});

hono.route("/", guilds);