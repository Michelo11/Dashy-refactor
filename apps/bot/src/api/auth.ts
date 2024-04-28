import { prisma } from "@repo/database";
import DiscordOauth2 from "discord-oauth2";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { hono } from "../main.js";

const guilds = new Hono();

guilds.get("/login", async (ctx) => {
  return ctx.redirect(process.env.LOGIN_URL!);
});

guilds.get("/callback", async (ctx) => {
  const query = ctx.req.query();
  const oauth = new DiscordOauth2();
  const token = await oauth.tokenRequest({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,

    code: query.code,
    scope: "identify guilds email",
    grantType: "authorization_code",

    redirectUri: process.env.NEXT_PUBLIC_API_URL + "/auth/callback",
  });

  setCookie(ctx, "token", token.access_token, {
    maxAge: token.expires_in,
    httpOnly: true,
    sameSite: "Lax",
  });

  const user = await oauth.getUser(token.access_token);

  await prisma.user.upsert({
    where: {
      id: user.id,
    },
    create: {
      id: user.id,
      username: user.username,
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
      email: user.email!,
    },
    update: {
      username: user.username,
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
      email: user.email!,
    },
  });

  return ctx.redirect(process.env.APP_URL + "/dashboard");
});

guilds.get("/session", async (ctx) => {
  const token = getCookie(ctx, "token");
  if (!token) return ctx.json(null);

  const oauth = new DiscordOauth2();
  const user = await oauth.getUser(token);

  return ctx.json(user);
});

guilds.post("/logout", async (ctx) => {
  deleteCookie(ctx, "token");

  return ctx.json({ success: true });
});

hono.route("/auth", guilds);
export default guilds;
