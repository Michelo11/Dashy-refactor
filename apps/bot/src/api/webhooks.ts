import { prisma, WebhookAction } from "@repo/database";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { bot, hono } from "../main.js";
import authorized from "../middlewares/authorized";

const guilds = new Hono().basePath("/guilds/:id/webhooks");
const schema = z.object({
  action: z.nativeEnum(WebhookAction),
  payload: z.string(),
});

guilds.get("/", authorized, async (ctx) => {
  const id = ctx.req.param("id");

  const guild = await prisma.guild.findFirst({
    where: {
      id,
    },
  });

  if (!guild) {
    ctx.status(404);
    return ctx.json({
      error: "Guild not found",
    });
  }

  const webhooks = await prisma.webhook.findMany({
    where: {
      guildId: id,
    },
  });

  return ctx.json(webhooks);
});

guilds.post(
  "/new",
  authorized,
  validator("json", (value, ctx) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      ctx.status(401);
      return ctx.json({
        error: parsed.error.errors,
      });
    }

    return parsed.data;
  }),
  async (ctx) => {
    const id = ctx.req.param("id");

    const guild = await prisma.guild.findFirst({
      where: {
        id,
      },
    });

    if (!guild) {
      ctx.status(404);
      return ctx.json({
        error: "Guild not found",
      });
    }

    const { action, payload } = ctx.req.valid("json");

    const webhook = await prisma.webhook.create({
      data: {
        action,
        payload,
        guildId: id,
      },
    });

    return ctx.json(webhook);
  }
);

guilds.post("/:token", async (ctx) => {
  const token = ctx.req.param("token");

  const webhook = await prisma.webhook.findUnique({
    where: {
      token,
    },
  });

  if (!webhook) {
    ctx.status(404);
    return ctx.json({
      error: "Webhook not found",
    });
  }

  switch (webhook.action) {
    case WebhookAction.ASSIGN_ROLE:
      const { userId } = await ctx.req.json();

      if (!userId) {
        ctx.status(401);
        return ctx.json({
          error: "User ID is required",
        });
      }

      const { roleId } = JSON.parse(webhook.payload);

      const guild = bot.guilds.cache.get(webhook.guildId);

      if (!guild) {
        ctx.status(404);
        return ctx.json({
          error: "Guild not found",
        });
      }

      const member = await guild.members.fetch(userId);

      member.roles.add(roleId);
      break;
  }

  return ctx.json({
    success: true,
  });
});

guilds.delete("/:token", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const token = ctx.req.param("token");

  await prisma.webhook.delete({
    where: {
      token,
      guildId: id,
    },
  });

  return ctx.json({
    success: true,
  });
});

hono.route("/", guilds);