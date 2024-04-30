"use client";

import { axiosClient } from "@/lib/fetcher";
import { Button, Card, CardBody, Link } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

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
            Join over {query.data || 0} servers owners
          </p>
          <Button
            as={Link}
            href={process.env.NEXT_PUBLIC_BOT_URL}
            className="text-inherit uppercase mt-3 w-fit bg-white text-black"
          >
            Add to discord
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
