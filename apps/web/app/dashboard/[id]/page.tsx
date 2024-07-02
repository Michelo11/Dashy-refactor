"use client";

import Module from "@/components/dashboard/Module";

const modules = [
  {
    title: "Settings",
    description: "Customize all the settings for the bot and the dashboard.",
    link: "settings",
  },
  {
    title: "Logs",
    description: "View what happened on the dashboard and who did what.",
    link: "logs",
  },
  {
    title: "Events",
    description:
      "Send messages for everything that happens on the server such as join, leave and bans.",
    link: "events",
  },
  {
    title: "Reaction Roles",
    description: "Let your members choose roles based on a dropdown menu.",
    link: "reaction-roles",
  },
  {
    title: "Moderation",
    description: "Manage bans, warns and other moderation actions with ease.",
    link: "moderation",
  },
  {
    title: "Levels",
    description:
      "Create levels to reward your members by chatting in your server.",
    link: "levels",
  },
  {
    title: "Tickets",
    description:
      "Configure a ticket system and reply to your users directly from our dashboard.",
    link: "tickets",
  },
  {
    title: "Transcripts",
    description:
      "Check the transcripts of archived tickets to never forget anything.",
    link: "transcripts",
  },
  {
    title: "Custom Commands",
    description: "Create custom commands for a full world of customization.",
    link: "custom-commands",
  },
  {
    title: "Embed Messages",
    description: "Create embeds and send them in a selected channel",
    link: "embed-messages",
  },
  {
    title: "Polls",
    description:
      "Not sure about something? Ask your users to vote with an amazing poll.",
    link: "polls",
  },
  {
    title: "Giveaways",
    description:
      "Create amazing giveaways to give users the chance to win something.",
    link: "giveaways",
  },
  {
    title: "Webhooks",
    description:
      "Run specific actions based on an URL trigger you can invoke externally.",
    link: "webhooks",
  },
  {
    title: "Socials",
    description: "Send an alert when a post is publishied in a social network.",
    link: "socials",
  },
  {
    title: "AI Chat",
    description:
      "Use our amazing AI chat bot to let him customize every aspect of the bot for you.",
    link: "ai-chat",
  },
];

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="title w-1/3">Modules:</h1>
      <p className="paragraph w-1/2">
        Select a module and start customizing your Discord server.
      </p>

      <div className="2xl:grid flex flex-col gap-3 grid-cols-4 w-full">
        {modules.map((module) => {
          return <Module key={module.title} {...module} id={id} />;
        })}
      </div>
    </section>
  );
}
