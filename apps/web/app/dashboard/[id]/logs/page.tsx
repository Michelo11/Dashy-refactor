"use client";

import { axiosClient } from "@/lib/fetcher";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const getLogs = useQuery({
    queryKey: ["logs", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${id}/logs`);
      return res.data;
    },
  });

  return (
    <section className="flex flex-col gap-3">
      <h1 className="title w-1/3">Logs</h1>
      <p className="paragraph w-1/2">
        View what happened on the dashboard and who did what.
      </p>

      <Table
        classNames={{ wrapper: "bg-modal", th: "bg-modalForeground" }}
        aria-label="Logs Table"
      >
        <TableHeader className="!w-full">
          <TableColumn className="w-1/3">AUTHOR</TableColumn>
          <TableColumn className="w-1/3">MESSAGE</TableColumn>
          <TableColumn className="w-1/3">CREATED AT</TableColumn>
        </TableHeader>
        <TableBody>
          {getLogs.data?.length === 0 && (
            <TableRow>
              <TableCell>No logs found</TableCell>
              <TableCell>
                <p></p>
              </TableCell>
              <TableCell>
                <p></p>
              </TableCell>
            </TableRow>
          )}

          {getLogs.isLoading && (
            <TableRow>
              <TableCell>
                <Skeleton className="xl:w-1/3 w-full h-3 rounded-lg !bg-modal"></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton className="xl:w-1/3 w-full h-3 rounded-lg !bg-modal"></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton className="xl:w-1/3 w-full h-3 rounded-lg !bg-modal"></Skeleton>
              </TableCell>
            </TableRow>
          )}

          {getLogs.data?.map((log: any) => (
            <TableRow key={log.id}>
              <TableCell className="w-1/3">{log.author}</TableCell>
              <TableCell className="w-1/3">{log.message}</TableCell>
              <TableCell className="w-1/3">
                {moment(log.createdAt).format("DD/mm/yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
