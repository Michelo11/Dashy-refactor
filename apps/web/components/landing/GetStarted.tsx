"use client";

import { axiosClient } from "@/lib/fetcher";
import { Button, Card, CardBody, Link } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";

export default function GetStarted() {
  const query = useQuery({
    queryKey: ["stats-guilds"],
    queryFn: async () => {
      const res = await axiosClient.get("/stats/guilds");
      return res.data;
    },
  });

  return (
    <section>
      <Card className="bg-primary">
        <CardBody className="mx-3 mb-3 mt-3">
          <h2 className="title text-white w-1/2">
            Ready to enhance your discord server?
          </h2>
          <p className="paragraph !text-white uppercase mt-3">
            Join over <CountUp end={query.data || 0} duration={5} /> servers
            owners
          </p>
          <Button
            as={Link}
            color="secondary"
            href="/dashboard"
            className="text-inherit uppercase mt-3 w-fit bg-white text-black"
          >
            Get started
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
