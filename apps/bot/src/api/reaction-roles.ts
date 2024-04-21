import { prisma } from "@repo/database";
import { Hono } from "hono";
import { bot, hono } from "../main.js";
import authorized from "../middlewares/authorized";
import { validator } from "hono/validator";
import { z } from "zod";
import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

const guilds = new Hono().basePath("/guilds/:id/reaction-roles");

guilds.get("/", authorized, async (ctx) => {
  const id = ctx.req.param("id");
  const reactionRoles = await prisma.reactionRole.findMany({
    where: {
      guildId: id,
    },
  });

  return ctx.json(reactionRoles);
});

const schema = z.object({
  roles: z.array(
    z.object({
      emoji: z.string().optional(),
      roleId: z.string(),
      name: z.string(),
      description: z.string().optional(),
    })
  ),
  title: z.string(),
  description: z.string(),
  channelId: z.string(),
});

guilds.post(
  "/new",
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
    const data = ctx.req.valid("json");

    await prisma.reactionRole.create({
      data: {
        guildId: id,
        roles: {
          createMany: {
            data: data.roles,
          },
        },
        title: data.title,
        description: data.description,
      },
    });

    const guild = bot.guilds.cache.get(id) || (await bot.guilds.fetch(id));
    const channel = guild.channels.cache.get(data.channelId);

    if (!channel || !channel.isTextBased()) {
      ctx.status(404);
      return ctx.json({
        error: "Channel not found",
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(data.title)
      .setDescription(data.description);

    const menu = new StringSelectMenuBuilder()
      .addOptions(
        data.roles.map((role) =>
          new StringSelectMenuOptionBuilder()
            .setDescription(role.description || "")
            .setLabel(role.name)
            .setValue(role.roleId)
            .setEmoji(role.emoji || "")
        )
      )
      .setCustomId("reaction-role");

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        menu
      );

    channel.send({
      components: [row],
      embeds: [embed],
    });

    return ctx.json({
      success: true,
    });
  }
);

guilds.delete("/:roleId", authorized, async (ctx) => {
  const reactionRoleId = ctx.req.param("roleId");
  const guildId = ctx.req.param("id");

  await prisma.reactionRole.delete({
    where: {
      id: parseInt(reactionRoleId),
      guildId: guildId,
    },
  });

  return ctx.json({
    success: true,
  });
});

hono.route("/", guilds);
export default guilds;
