"use client";

import { axiosClient } from "@/lib/fetcher";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const getTranscripts = useQuery({
    queryKey: ["transcripts", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/guilds/${id}/transcripts`);
      return res.data;
    },
  });

  return (
    <section className="flex flex-col gap-3">
      <h1 className="title w-1/3">Transcripts</h1>
      <p className="paragraph w-1/2">
        Check the transcripts of archived tickets to never forget anything.
      </p>

      <div>
        {getTranscripts.data?.length === 0 && (
          <p className="paragraph">
            There are no transcripts available for this guild.
          </p>
        )}

        <Listbox aria-label="Actions" emptyContent={false}>
          {getTranscripts.data?.map((transcript: any) => (
            <ListboxItem
              key={transcript.id}
              className="hover:!bg-modalForeground"
              href={`transcripts/${transcript.id}`}
            >
              <p className="p-1">{transcript.name}</p>
            </ListboxItem>
          ))}
        </Listbox>
      </div>
    </section>
  );
}
