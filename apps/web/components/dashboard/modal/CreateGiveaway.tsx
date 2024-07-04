"use client";

import { axiosClient } from "@/lib/fetcher";
import {
  Button,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { DateValue } from "@internationalized/date";

export default function CreateGiveaway({
  giveaway,
  channels,
  isOpen,
  onOpenChange,
  guildId,
}: {
  giveaway: {
    name: string;
    description: string;
    winnerCount: number;
    channelId: string;
    endsAt: number;
  } | null;
  channels: { id: string; name: string }[];
  isOpen: boolean;
  onOpenChange: () => void;
  guildId: string;
}) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [winnerCount, setWinnerCount] = useState("");
  const [channelValue, setChannel] = useState("");
  const [endsAt, setEndsAt] = useState<DateValue | null>(null);

  const createGiveaway = useMutation({
    mutationKey: ["giveaway", guildId],
    mutationFn: (giveaway: any) => {
      return axiosClient.post(`/guilds/${guildId}/giveaways/new`, {
        giveaways: [giveaway],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giveaways", guildId] });
      toast.success("Giveaway created!");
    },
    onError: (error: any) => {
      toast.error(error.response.data.error[0]?.message);
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ base: "!bg-background" }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Create Giveaway
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={giveaway?.name || "Name"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={giveaway?.description || "Description"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <Input
              type="text"
              label="Number of winners"
              value={winnerCount}
              onChange={(event) => setWinnerCount(event.target.value)}
              placeholder={giveaway?.winnerCount.toString() || "1"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <DateInput
              label="Ends at"
              value={endsAt}
              onChange={(event) => setEndsAt(event)}
              placeholder={giveaway?.endsAt.toString() || "Ends at"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <Select
              label="Channel"
              placeholder={giveaway?.channelId || "Select a channel"}
              value={channelValue}
              onChange={(event) => setChannel(event.target.value)}
              classNames={{
                trigger: "!bg-modalForeground",
                popoverContent: "!bg-modalForeground",
              }}
            >
              {channels.map((channel: any) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              className="text-inherit w-fit uppercase"
              onClick={() => {
                createGiveaway.mutate({
                  name,
                  description,
                  winnerCount: parseInt(winnerCount),
                  channelId: channelValue,
                  endsAt,
                });

                onOpenChange();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
