"use client";

import { axiosClient } from "@/lib/fetcher";
import { Button, Link, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await axiosClient.get("/auth/session");
      return res.data;
    },
  });

  const router = useRouter();

  return (
    <nav className="w-full py-3 ">
      <div className="flex justify-between border-1 border-gray-800 p-4 rounded-lg">
        <div className="flex gap-3 items-center">
          <Image
            src="/logo.png"
            alt="Navbar Logo"
            width={35}
            height={35}
            draggable={false}
            priority
          />
          <p className="font-bold text-inherit uppercase text-lg">Dashy</p>
        </div>

        <ul className="gap-6 items-center hidden xl:flex">
          <li>
            <Link href="/" className="uppercase" color="foreground">
              Home
            </Link>
          </li>
          <li>
            <Link href="#whyus" className="uppercase" color="foreground">
              Why Us
            </Link>
          </li>
          <li>
            <Link href="#features" className="uppercase" color="foreground">
              Features
            </Link>
          </li>
          <li>
            <Link
              href="https://discord.gg/PrsTsQ8GdU"
              className="uppercase"
              color="foreground"
            >
              Support
            </Link>
          </li>
          <li>
            <Link href="#" className="uppercase" color="foreground">
              Docs
            </Link>
          </li>
        </ul>

        {!query.isLoading ? (
          query.data ? (
            <Button
              color="primary"
              onClick={async () => {
                await axiosClient.post("/auth/logout").then(() => {
                  queryClient.invalidateQueries({ queryKey: ["session"] });
                  router.push("/");
                });
              }}
              className="text-inherit uppercase"
            >
              Logout
            </Button>
          ) : (
            <Button
              as={Link}
              color="primary"
              href={process.env.NEXT_PUBLIC_API_URL + "/auth/login"}
              className="text-inherit uppercase"
            >
              Login
            </Button>
          )
        ) : (
          <Button
            as={Link}
            color="primary"
            href={"#"}
            className="text-inherit uppercase"
          >
            <Spinner color="white" size="sm" />
          </Button>
        )}
      </div>
    </nav>
  );
}
