import { EventType, prisma } from "@repo/database";
import { User } from "discord-oauth2";
import { Hono } from "hono";
import { bot, hono } from "../main.js";
import authorized from "../middlewares/authorized";
import { z } from "zod";
import { validator } from "hono/validator";

type Variables = {
  user: User;
};

const guilds = new Hono<{ Variables: Variables }>().basePath(
  "/guilds/:id/embeds"
);

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  color: z
    .string()
    .refine((value) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value))
    .optional(),
});

guilds.post(
  "/:embedId",
  authorized,
  validator("json", (value, ctx) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      ctx.status(400);
      return ctx.json({
        error: parsed.error.errors,
      });
    }

    return parsed.data;
  }),
  async (ctx) => {
    const id = ctx.req.param("id");
    const embedId = ctx.req.param("embedId");
    const body = await ctx.req.json();

    await prisma.embed.update({
      where: {
        id: embedId,
      },
      data: {
        ...body,
        guildId: id,
      },
    });

    return ctx.json({
      success: true,
    });
  }
);

guilds.get("/:embedId", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const embedId = ctx.req.param("embedId");

  const embed = await prisma.embed.findUnique({
    where: {
      id: embedId,
    },
  });

  return ctx.json(embed);
});

hono.route("/", guilds);
export default guilds;
