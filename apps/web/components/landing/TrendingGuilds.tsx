"use client";

import { useQuery } from "@tanstack/react-query";
import Guild from "./Guild";
import { axiosClient } from "@/lib/fetcher";

export default function TrendingGuilds() {
  const getGuilds = useQuery({
    queryKey: ["guilds"],
    queryFn: async () => {
      const res = await axiosClient.get("/stats/guilds");
      return res.data;
    },
  });
  const getTrending = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const res = await axiosClient.get("/stats/trending");
      return res.data;
    },
  });

  return (
    <section>
      <p className="paragraph uppercase text-center">
        Trusted by over {getGuilds.data || 0} communities
      </p>

      <div
        className={
          "w-full mx-auto flex gap-6 mt-3 flex-wrap 2xl:items-center justify-center " +
          (getTrending.data?.length == 5 ? "2xl:justify-between" : "")
        }
      >
        {getTrending.data?.map((guild: any) => (
          <Guild key={guild.id} {...guild} />
        ))}
      </div>
    </section>
  );
}
