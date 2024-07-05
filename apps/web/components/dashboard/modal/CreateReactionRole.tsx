"use client";

import { axiosClient } from "@/lib/fetcher";
import {
  Button,
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

export default function CreateReactionRole({
  reactionRole,
  roles,
  isOpen,
  onOpenChange,
  guildId,
}: {
  reactionRole: {
    name: string;
    description: string;
    role: string;
    emoji: string;
  } | null;
  roles: { id: string; name: string }[];
  isOpen: boolean;
  onOpenChange: () => void;
  guildId: string;
}) {
  // TODO: Fix the mutation
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roleValue, setRole] = useState("");
  const [emoji, setEmoji] = useState("");

  const createReactionRole = useMutation({
    mutationKey: ["reaction-role", guildId],
    mutationFn: (reactionRole: any) => {
      return axiosClient.post(`/guilds/${guildId}/reaction-roles/new`, {
        roles: [reactionRole],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reaction-roles", guildId] });
      toast.success("Reaction role created!");
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
            Create Reaction Role
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={reactionRole?.name || "Name"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={reactionRole?.description || "Description"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <Input
              type="text"
              label="Emoji"
              value={emoji}
              onChange={(event) => setEmoji(event.target.value)}
              placeholder={reactionRole?.emoji.toString() || "✨"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <Select
              label="Role"
              placeholder={reactionRole?.role || "Select a role"}
              value={roleValue}
              onChange={(event) => setRole(event.target.value)}
              classNames={{
                trigger: "!bg-modalForeground",
                popoverContent: "!bg-modalForeground",
              }}
            >
              {roles.map((role: any) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              className="text-inherit w-fit uppercase"
              onClick={() => {
                createReactionRole.mutate({
                  name,
                  description,
                  emoji,
                  role: roleValue,
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
