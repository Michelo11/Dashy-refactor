import { prisma } from "@repo/database";
import { User } from "discord-oauth2";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { hono } from "../main.js";
import authorized from "../middlewares/authorized";

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
    .optional()
    .refine(
      (value) => !value || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
      "Color must be an hex (e.g. #000000)"
    ),
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
    const embedId = ctx.req.param("embedId");
    const body = await ctx.req.json();

    await prisma.embed.update({
      where: {
        id: embedId,
      },
      data: {
        title: body.title || undefined,
        description: body.description || undefined,
        color: body.color || undefined,
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
