import { dirname, importx } from "@discordx/importer";
import { serve } from "@hono/node-server";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

export const hono = new Hono();
hono.use(logger());
hono.use(prettyJSON());

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],

  silent: false,

  simpleCommand: {
    prefix: "!",
  },
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
    `${dirname(import.meta.url)}/{events,commands,api}/**/*.{ts,js}`
  );

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await bot.login(process.env.BOT_TOKEN);

  const port = process.env.PORT || 8000;

  serve(hono).listen(port);
}

void run();
