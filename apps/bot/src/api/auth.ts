import { prisma } from "@repo/database";
import DiscordOauth2 from "discord-oauth2";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { hono } from "../main.js";

const auth = new Hono();

auth.get("/login", async (ctx) => {
  return ctx.redirect(process.env.LOGIN_URL!);
});

auth.get("/callback", async (ctx) => {
  const query = ctx.req.query();
  const oauth = new DiscordOauth2();
  const token = await oauth.tokenRequest({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,

    code: query.code,
    scope: "identify guilds email",
    grantType: "authorization_code",

    redirectUri: process.env.REDIRECT_URI,
  });

  setCookie(ctx, "token", token.access_token, {
    maxAge: token.expires_in,
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

  return ctx.redirect("/");
});

hono.route("/auth", auth);