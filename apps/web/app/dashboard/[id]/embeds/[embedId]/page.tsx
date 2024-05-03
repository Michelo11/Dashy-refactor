"use client";

import { axiosClient } from "@/lib/fetcher";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
          isInvalid={
            embed.isError &&
            (embed.error as any)?.response.data.error.find((error: any) =>
              error.path.includes("title")
            ) != null
          }
          errorMessage={
            (embed.error as any)?.response.data.error.find((error: any) =>
              error.path.includes("title")
            )?.message
          }
          placeholder={getEmbed.data?.title || "Enter a title"}
          description={title && embed.isSuccess ? "Title updated!" : undefined}
          classNames={{ inputWrapper: "!bg-modalForeground" }}
        />

        <Textarea
          type="text"
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          isInvalid={
            embed.isError &&
            (embed.error as any)?.response.data.error.find((error: any) =>
              error.path.includes("description")
            ) != null
          }
          errorMessage={
            (embed.error as any)?.response.data.error.find((error: any) =>
              error.path.includes("description")
            )?.message
          }
          placeholder={getEmbed.data?.description || "Enter a description"}
          description={
            description && embed.isSuccess ? "Description updated!" : undefined
          }
          classNames={{ inputWrapper: "!bg-modalForeground !h-[120px]" }}
        />

        <Input
          type="text"
          label="Color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          isInvalid={
            embed.isError &&
            (embed.error as any)?.response.data.error.find((error: any) =>
              error.path.includes("color")
            ) != null
          }
          errorMessage={
            (embed.error as any)?.response.data.error.find((error: any) =>
              error.path.includes("color")
            )?.message
          }
          placeholder={getEmbed.data?.color || "Enter a color"}
          description={color && embed.isSuccess ? "Color updated!" : undefined}
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
