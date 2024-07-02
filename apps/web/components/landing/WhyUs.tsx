"use client";

import { axiosClient } from "@/lib/fetcher";
import { Card, CardBody, user } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";

export default function WhyUs() {
  const guilds = useQuery({
    queryKey: ["stats-guilds"],
    queryFn: async () => {
      const res = await axiosClient.get("/stats/guilds");
      return res.data;
    },
  });

  const commands = useQuery({
    queryKey: ["stats-commands"],
    queryFn: async () => {
      const res = await axiosClient.get("/stats/commands");
      return res.data;
    },
  });

  const users = useQuery({
    queryKey: ["stats-users"],
    queryFn: async () => {
      const res = await axiosClient.get("/stats/users");
      return res.data;
    },
  });

  return (
    <section id="whyus" className="lg:flex w-full items-center gap-3">
      <div className="w-1/2">
        <h2 className="title">Why us?</h2>
        <p className="paragraph mt-3">
          Our bot is designed to enhance your server's functionality and user
          experience. With all our features being customizable, you can feel the
          bot as your custom one.
        </p>

        <div className="mt-3 flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 block bg-primary rounded-full" />
            Warns
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-1 block bg-primary rounded-full" />
            Tickets
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-1 block bg-primary rounded-full" />
            Logging
          </div>
        </div>
      </div>

      <div className="xl:w-1/2 w-full flex gap-3 xl:mt-0 mt-3">
        <Card className="w-1/3 h-36 bg-modal">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <h1 className="title text-primary">
              <CountUp end={commands.data || 0} duration={5} />
            </h1>
            <p className="paragraph text-center">Command executed</p>
          </CardBody>
        </Card>

        <Card className="w-1/3 h-36 bg-modal overflow-none">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <h1 className="title text-primary">
              <CountUp end={guilds.data || 0} duration={5} />
            </h1>
            <p className="paragraph text-center">Community guilds</p>
          </CardBody>
        </Card>

        <Card className="w-1/3 h-36 bg-modal">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <h1 className="title text-primary">
              <CountUp end={users.data || 0} duration={5} />
            </h1>
            <p className="paragraph text-center">Active users</p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
