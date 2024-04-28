"use client";

import { useFetcher } from "@/lib/fetcher.client";
import { Button, Card, CardFooter, Link } from "@nextui-org/react";
import Image from "next/image";

export default function Page() {
  const { data: guilds } = useFetcher("/guilds/me");

  return (
    <section className="mt-20 flex flex-col gap-3 mb-3">
      <h1 className="title w-1/3">Your Guilds</h1>
      <p className="paragraph w-1/2">
        Select the guild you want to manage or chose a new one to add our bot
        to.
      </p>

      <div className="flex flex-col flex-wrap items-center md:flex-row gap-3">
        {guilds
          ?.filter((guild: any) => guild.owner)
          .map((guild: any) => (
            <Card
              isFooterBlurred
              radius="lg"
              className="border-none bg-modal w-fit"
              key={guild.id}
            >
              <Image
                alt="Guild icon"
                className="object-cover"
                height={200}
                src={
                  guild.icon
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                    : "/logo.png"
                }
                width={200}
                draggable={false}
              />
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">{guild.name}</p>
                <Button
                  as={Link}
                  className="text-tiny text-white bg-black/20"
                  variant="flat"
                  color="default"
                  radius="lg"
                  size="sm"
                  href={
                    guild.bot
                      ? `/dashboard/${guild.id}`
                      : process.env.NEXT_PUBLIC_BOT_URL + guild.id
                  }
                >
                  {guild.bot ? "Manage" : "Invite"}
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </section>
  );
}
