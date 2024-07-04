"use client";

import { axiosClient } from "@/lib/fetcher";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Page({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [prefixValue, setPrefix] = useState("");
  const [roleValue, setRole] = useState("");

  const getName = useQuery({
    queryKey: ["name", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${id}/name`);
      return res.data;
    },
  });
  const getPrefix = useQuery({
    queryKey: ["prefix", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${id}/prefix`);
      return res.data;
    },
  });
  const getRoles = useQuery({
    queryKey: ["roles", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${id}/roles`);
      return res.data;
    },
  });
  const getRole = useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${id}/role`);
      return res.data;
    },
  });

  const rename = useMutation({
    mutationKey: ["rename", id],
    mutationFn: (name: string) => {
      return axiosClient.post(`/guilds/${id}/rename`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["name", id] });
      toast.success("Name updated!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const prefix = useMutation({
    mutationKey: ["prefix", id],
    mutationFn: (prefix: string) => {
      return axiosClient.post(`/guilds/${id}/prefix`, { prefix });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prefix", id] });
      toast.success("Prefix updated!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const role = useMutation({
    mutationKey: ["role", id],
    mutationFn: (role: string) => {
      return axiosClient.post(`/guilds/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", id] });
      toast.success("Role updated!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <section className="flex flex-col gap-3">
      <h1 className="title w-1/3">Settings</h1>
      <p className="paragraph w-1/2">
        Customize all the settings for the bot and the dashboard.
      </p>

      <div className="flex gap-3">
        <Input
          type="text"
          label="Bot Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={getName.data}
          classNames={{ inputWrapper: "!bg-modalForeground" }}
        />

        <Input
          type="text"
          label="Prefix"
          value={prefixValue}
          onChange={(event) => setPrefix(event.target.value)}
          placeholder={getPrefix.data}
          classNames={{ inputWrapper: "!bg-modalForeground" }}
        />
      </div>

      <Select
        label="Admin Role"
        placeholder={
          getRoles.data?.find((role: any) => role.id === getRole.data)?.name ||
          "Select a role"
        }
        value={roleValue}
        onChange={(event) => setRole(event.target.value)}
        classNames={{
          trigger: "!bg-modalForeground",
          popoverContent: "!bg-modalForeground",
        }}
      >
        {getRoles.data?.map((role: any) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </Select>

      <Button
        color="primary"
        className="uppercase"
        onClick={() => {
          if (name) rename.mutate(name);
          if (prefixValue) prefix.mutate(prefixValue);
          if (roleValue) role.mutate(roleValue);
        }}
      >
        Save
      </Button>
    </section>
  );
}
