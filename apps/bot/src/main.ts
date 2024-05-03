import { dirname, importx } from "@discordx/importer";
import { prisma } from "@repo/database";
import type { CommandInteraction, Interaction, Message } from "discord.js";
import { IntentsBitField, User } from "discord.js";
import { Client, GuardFunction } from "discordx";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

const { upgradeWebSocket: upgradeWebSocketFn, websocket } =
  createBunWebSocket();

export const upgradeWebSocket = upgradeWebSocketFn;

export const hono = new Hono<{ Variables: { user: User } }>();
hono.use(logger());
hono.use(prettyJSON());
hono.use(
  cors({
    origin: process.env.APP_URL || "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 600,
    credentials: true,
  })
);

const StatsCounter: GuardFunction<CommandInteraction> = async (
  interaction,
  _,
  next
) => {
  await next();

  try {
    if (!interaction.isCommand()) return;

    await prisma.statistic.upsert({
      where: {
        id: "commands",
      },
      create: {
        id: "commands",
        value: 1,
      },
      update: {
        value: {
          increment: 1,
        },
      },
    });
  } catch (e) {}
};

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],

  silent: process.env.NODE_ENV !== "development",

  simpleCommand: {
    prefix: "!",
  },

  guards: [StatsCounter],
});

bot.once("ready", async () => {
  await bot.initApplicationCommands();

  console.log("Bot started");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", async (message: Message) => {
  await bot.executeCommand(message);
});

async function run() {
  await importx(
    `${dirname(import.meta.url)}/{events,commands,interactions,api}/**/*.{ts,js}`
  );

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await bot.login(process.env.BOT_TOKEN);

  setInterval(
    async () => {
      await checkGiveaways();
    },
    1000 * 60 * 5
  );

  checkGiveaways();
}

async function checkGiveaways() {
  const giveaways = await prisma.giveaway.findMany({
    where: {
      endsAt: {
        lte: new Date(),
      },
    },
    include: {
      participants: true,
    },
  });

  for (const giveaway of giveaways) {
    const guild = await bot.guilds.fetch(giveaway.guildId);

    if (!guild) {
      continue;
    }
    const channel = guild.channels.cache.get(giveaway.channelId);

    if (!channel || !channel.isTextBased()) {
      continue;
    }

    const message = await channel.messages.fetch(giveaway.messageId!);

    if (!message) {
      continue;
    }

    const winners = giveaway.participants
      .sort(() => Math.random() - 0.5)
      .slice(0, giveaway.winnerCount);
    const winnersString =
      winners.length > 0
        ? winners.map((user) => `<@${user.userId}>`).join(", ")
        : "No one";

    await message.channel.send({
      content: `Congratulations to ${winnersString} for winning the giveaway: ${giveaway.title}!`,
    });

    await message.delete();

    await prisma.giveaway.delete({
      where: {
        id: giveaway.id,
      },
    });
  }
}

void run();

export default {
  port: process.env.PORT || 8000,
  fetch: hono.fetch,
  websocket,
};
