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
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ManageLevel({
  level,
  roles,
  isOpen,
  onOpenChange,
  guildId,
}: {
  level: { name: string; xp: number; role: string } | null;
  roles: { id: string; name: string }[];
  isOpen: boolean;
  onOpenChange: () => void;
  guildId: string;
}) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [xp, setXp] = useState("");
  const [roleValue, setRole] = useState("");

  const createLevel = useMutation({
    mutationKey: ["level", guildId],
    mutationFn: (level: any) => {
      return axiosClient.post(`/guilds/${guildId}/levels/new`, level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels", guildId] });
      toast.success("Level created!");
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
            Manage Level
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={level?.name || "Level Name"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <Input
              type="text"
              label="XP"
              value={xp}
              onChange={(event) => setXp(event.target.value)}
              placeholder={level?.xp.toString() || "0"}
              classNames={{ inputWrapper: "!bg-modalForeground" }}
            />

            <Select
              label="Admin Role"
              placeholder={level?.role || "Select a role"}
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
                createLevel.mutate({
                  name,
                  xp: parseInt(xp),
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
