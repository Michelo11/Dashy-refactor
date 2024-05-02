import { axiosClient } from "@/lib/fetcher";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await axiosClient.get("/auth/session", {
    headers: { Cookie: cookies().toString() },
  });

  if (!session)
    return redirect(process.env.NEXT_PUBLIC_API_URL + "/auth/login");

  return <>{children}</>;
}