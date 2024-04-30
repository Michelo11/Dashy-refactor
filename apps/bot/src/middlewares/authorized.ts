import { Context, Next } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import DiscordOauth2 from "discord-oauth2";
import { bot } from "../main.js";
import { prisma } from "@repo/database";

const oauth = new DiscordOauth2();

export default async function authorized(ctx: Context, next: Next) {
  if (process.env.NODE_ENV === "test") {
    ctx.set("user", {
      id: "-1",
      username: "test-agent",
    });
    return await next();
  }

  const token = getCookie(ctx, "token");

  if (!token) {
    ctx.status(401);
    return ctx.json({
      error: "Unauthorized",
    });
  }

  try {
    const user = await oauth.getUser(token);
    const guildId = ctx.req.param("id");

    ctx.set("user", user);

    const discordGuild = await bot.guilds.fetch(guildId);

    if (!discordGuild) {
      ctx.status(404);
      return ctx.json({
        error: "Guild not found",
      });
    }

    const guildData = await prisma.guild.findUnique({
      where: {
        id: guildId,
      },
    });

    if (!guildData)
      await prisma.guild.create({
        data: {
          id: guildId,
        },
      });

    if (discordGuild.ownerId === user.id) return await next();

    const member = await discordGuild.members.fetch(user.id);

    if (!member) {
      ctx.status(403);
      return ctx.json({
        error: "Forbidden",
      });
    }

    if (!guildData) {
      ctx.status(404);
      return ctx.json({
        error: "Guild not found",
      });
    }

    if (guildData.role && member.roles.cache.has(guildData.role))
      return await next();

    ctx.status(403);
    return ctx.json({
      error: "Forbidden",
    });
  } catch (error) {
    console.log(error);
    deleteCookie(ctx, "token");

    ctx.status(401);
    return ctx.json({
      error: "Unauthorized",
    });
  }
}
