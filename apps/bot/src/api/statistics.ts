import { prisma } from "@repo/database";
import { Hono } from "hono";
import { bot, hono } from "../main";

const guilds = new Hono().basePath("/stats");

guilds.use(async (ctx, next) => {
  ctx.header("Cache-Control", "public, max-age=60");

  await next();
});

guilds.get("/guilds", async (ctx) => {
  const guilds = bot.guilds.cache.size;

  return ctx.json(guilds || 0);
});

guilds.get("/commands", async (ctx) => {
  const commands = await prisma.statistic.findFirst({
    where: {
      id: "commands",
    },
  });

  return ctx.json(commands?.value || 0);
});

guilds.get("/users", async (ctx) => {
  const users = await prisma.user.count();

  return ctx.json(users || 0);
});

guilds.get("/trending", async (ctx) => {
  const guilds = bot.guilds.cache
    .filter((guild) => guild.features.includes("COMMUNITY"))
    .sort((a, b) => b.memberCount - a.memberCount);

  return ctx.json(
    Array.from(guilds.values())
      .slice(0, 5)
      .map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        members: guild.memberCount,
      }))
  );
});

hono.route("/", guilds);
export default guilds;
