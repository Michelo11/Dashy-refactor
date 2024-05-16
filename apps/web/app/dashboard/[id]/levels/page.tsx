"use client";

import ManageLevel from "@/components/dashboard/modal/ManageLevel";
import { axiosClient } from "@/lib/fetcher";
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editing, setEditing] = useState<{
    name: string;
    xp: number;
    role: string;
  } | null>(null);

  const getLevels = useQuery({
    queryKey: ["levels", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${id}/levels`);
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

  return (
    <section className="flex flex-col gap-3">
      <h1 className="title w-1/3">Levels</h1>
      <p className="paragraph w-1/2">
        Create levels to reward your members by chatting in your server.
      </p>

      <Table
        classNames={{ wrapper: "bg-modal", th: "bg-modalForeground" }}
        aria-label="Logs table"
      >
        <TableHeader className="!w-full">
          <TableColumn className="w-1/4">NAME</TableColumn>
          <TableColumn className="w-1/4">XP</TableColumn>
          <TableColumn className="w-1/4">ROLE</TableColumn>
          <TableColumn className="w-1/4">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {getLevels.data?.length === 0 && (
            <TableRow>
              <TableCell>No levels found</TableCell>
              <TableCell>
                <p></p>
              </TableCell>
              <TableCell>
                <p></p>
              </TableCell>
              <TableCell>
                <p></p>
              </TableCell>
            </TableRow>
          )}

          {getLevels.isLoading && (
            <TableRow>
              <TableCell>
                <Skeleton className="xl:w-1/4 w-full h-3 rounded-lg !bg-modal"></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton className="xl:w-1/4 w-full h-3 rounded-lg !bg-modal"></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton className="xl:w-1/4 w-full h-3 rounded-lg !bg-modal"></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton className="w-20 h-10 rounded-lg !bg-modal"></Skeleton>
              </TableCell>
            </TableRow>
          )}

          {getLevels.data?.map((level: any) => (
            <TableRow key={level.id}>
              <TableCell className="w-1/4">{level.name}</TableCell>
              <TableCell className="w-1/4">{level.xp}</TableCell>
              <TableCell className="whitespace-nowrap text-ellipsis overflow-hidden max-w-14">
                {getRoles.data?.find((role: any) => role.id == level.role).name}
              </TableCell>
              <TableCell className="w-1/4">
                <Button
                  color="danger"
                  variant="flat"
                  className="uppercase"
                  onClick={async () => {
                    await axiosClient.delete(
                      `/guilds/${id}/levels/${level.id}`
                    );
                    queryClient.invalidateQueries({
                      queryKey: ["level", id],
                    });

                    location.reload();
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        color="secondary"
        onPress={onOpen}
        className="text-inherit w-fit uppercase"
      >
        Create level
      </Button>

      <ManageLevel
        level={editing}
        roles={getRoles.data || []}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        guildId={id}
      />
    </section>
  );
}
