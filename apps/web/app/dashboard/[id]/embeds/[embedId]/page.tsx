"use client";

import { axiosClient } from "@/lib/fetcher";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Page({
  params: { id, embedId },
}: {
  params: { id: string; embedId: string };
}) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");

  const getEmbed = useQuery({
    queryKey: ["embed", embedId],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${id}/embeds/${embedId}`);
      return res.data;
    },
  });

  const embed = useMutation({
    mutationKey: ["embed", embedId],
    mutationFn: ({
      title,
      description,
      color,
    }: {
      title: string;
      description: string;
      color: string;
    }) => {
      return axiosClient.post(`/guilds/${id}/embeds/${embedId}`, {
        title,
        description,
        color,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["embed", embedId] });
      toast.success("Embed updated!");
    },
    onError: (error: any) => {
      toast.error(error.response.data.error[0]?.message);
    },
  });

  return (
    <section className="flex flex-col gap-3">
      <h1 className="title w-1/3">Embed Customization</h1>
      <p className="paragraph w-1/2">
        Change the embed content to make it match your preferences.
      </p>

      <div className="flex flex-col gap-3">
        <Input
          type="text"
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={getEmbed.data?.title || "Enter a title"}
          classNames={{ inputWrapper: "!bg-modalForeground" }}
        />

        <Textarea
          type="text"
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={getEmbed.data?.description || "Enter a description"}
          classNames={{ inputWrapper: "!bg-modalForeground !h-[120px]" }}
        />

        <Input
          type="text"
          label="Color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          placeholder={getEmbed.data?.color || "Enter a color"}
          classNames={{ inputWrapper: "!bg-modalForeground" }}
        />

        <Button
          color="primary"
          className="uppercase"
          onClick={() => {
            if (title || description || color)
              embed.mutate({ title, description, color });
          }}
        >
          Save
        </Button>
      </div>
    </section>
  );
}
