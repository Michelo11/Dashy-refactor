"use client";

import { axiosClient } from "@/lib/fetcher";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function Event({
  guildId,
  id,
  name,
  description,
}: {
  guildId: string;
  id: string;
  name: string;
  description: string;
}) {
  const queryClient = useQueryClient();

  const getChannels = useQuery({
    queryKey: ["channels", guildId],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${guildId}/channels`);
      return res.data;
    },
  });

  const getEvent = useQuery({
    queryKey: ["event", guildId, id],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${guildId}/events/${id}`);
      return res.data;
    },
  });

  const channel = useMutation({
    mutationKey: ["event", guildId, id],
    mutationFn: (channel: string) => {
      return axiosClient.post(`/guilds/${guildId}/events/${id}`, { channel });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", guildId, id] });
    },
  });

  return (
    <Card className="w-full bg-modal flex flex-col">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="font-semibold leading-none text-default-600">
              {name}
            </h4>
            <h5 className="paragraph-2 mt-3">{description}</h5>
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex flex-col gap-3">
        <Select
          label="Channel"
          placeholder={
            getChannels.data?.find(
              (channel: any) => channel.id === getEvent.data?.channelId
            )?.name || "Select a channel"
          }
          value={getEvent.data?.channelId}
          onChange={(event) => {
            channel.mutate(event.target.value);
          }}
          errorMessage={(channel.error as any)?.response.data.error}
          isInvalid={channel.isError}
          description={channel.isSuccess ? "Channel updated!" : undefined}
          classNames={{
            trigger: "!bg-modalForeground",
            popoverContent: "!bg-modalForeground",
          }}
          className="mt-auto"
        >
          {getChannels.data?.map((channel: any) => (
            <SelectItem key={channel.id} value={channel.id}>
              {channel.name}
            </SelectItem>
          ))}
        </Select>

        <Button
          as={Link}
          color="primary"
          href={`embeds/${getEvent.data?.embedId}`}
          className="uppercase"
        >
          Edit Embed
        </Button>

        <Button
          color="danger"
          variant="flat"
          className="uppercase"
          onClick={async () => {
            await axiosClient.delete(`/guilds/${guildId}/events/${id}`);
            queryClient.invalidateQueries({ queryKey: ["event", guildId, id] });

            location.reload();
          }}
        >
          Delete
        </Button>
      </CardBody>
    </Card>
  );
}
