"use client";

import { axiosClient } from "@/lib/fetcher";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Skeleton
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
            <Dropdown placement="bottom-end" className="bg-modalForeground">
              <DropdownTrigger>
                <Avatar
                  src={`https://cdn.discordapp.com/avatars/${query.data.id}/${query.data.avatar}.png`}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{query.data.username}</p>
                </DropdownItem>
                <DropdownItem href="/dashboard">My Guilds</DropdownItem>
                <DropdownItem
                  href={process.env.NEXT_PUBLIC_API_URL + "/stripe/portal"}
                >
                  Billing
                </DropdownItem>
                <DropdownItem
                  color="danger"
                  onClick={async () => {
                    await axiosClient.post("/auth/logout").then(() => {
                      queryClient.invalidateQueries({ queryKey: ["session"] });
                      router.push("/");
                    });
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
          <Skeleton className="flex rounded-full w-10 h-10 !bg-modal" />
        )}
      </div>
    </nav>
  );
}
