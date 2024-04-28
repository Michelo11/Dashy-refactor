import { Context, Next } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import DiscordOauth2 from "discord-oauth2";

const oauth = new DiscordOauth2();

export default async function authenticated(ctx: Context, next: Next) {
  if (process.env.NODE_ENV === "test") return await next();

  const token = getCookie(ctx, "token");

  if (!token) {
    ctx.status(401);
    return ctx.json({
      error: "Unauthorized",
    });
  }

  try {
    const user = await oauth.getUser(token);

    ctx.set("user", user);

    return await next();
  } catch (error) {
    console.log(error)
    deleteCookie(ctx, "token");

    ctx.status(401);
    return ctx.json({
      error: "Unauthorized",
    });
  }
}
