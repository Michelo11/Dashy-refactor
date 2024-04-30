"use client";

import { axiosClient } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

export default function Page({
  params: { id, transcriptId },
}: {
  params: { id: string; transcriptId: string };
}) {
  const getTranscript = useQuery({
    queryKey: ["transcript", id],
    queryFn: async () => {
      const res = await axiosClient.get(
        `/guilds/${id}/transcripts/${transcriptId}`
      );
      return res.data;
    },
  });

  return (
    <div>
      {getTranscript.data?.data.map((transcript: any) => (
        <p key={transcript.id}>{transcript.content}</p>
      ))}
    </div>
  );
}
