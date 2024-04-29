"use client";

import { useFetcher } from "@/lib/fetcher.client";
import Guild from "./Guild";

export default function TrendingGuilds() {
  const { data: guilds } = useFetcher("/stats/guilds");
  const { data: trending } = useFetcher<any[]>("/stats/trending");

  return (
    <section>
      <p className="paragraph uppercase text-center">
        Trusted by over {guilds || 0} communities
      </p>

      <div
        className={
          "w-full mx-auto flex gap-6 mt-3 flex-wrap 2xl:items-center justify-center " +
          (trending?.length == 5 ? "2xl:justify-between" : "")
        }
      >
        {trending?.map((guild: any) => <Guild key={guild.id} {...guild} />)}
      </div>
    </section>
  );
}
