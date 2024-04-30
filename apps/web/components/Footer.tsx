"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

export default function Footer() {
  const route = usePathname();

  return (
    <footer
      className={"bg-modalForeground " + (route === "/" ? "mt-[-100px]" : "mt-auto")}
    >
      <div
        className={
          "gap-6 flex-col items-center justify-center flex p-3 " +
          (route === "/" ? "pt-[126px]" : "pt-6")
        }
      >
        <ul className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <li>
            <Link
              href="#"
              className="uppercase flex items-center gap-3"
              color="foreground"
            >
              <span className="w-4 h-1 bg-primary rounded-full" />
              TOS
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="uppercase flex items-center gap-3"
              color="foreground"
            >
              <span className="w-4 h-1 bg-primary rounded-full" />
              Privacy policy
            </Link>
          </li>
          <li>
            <Link
              href="#pricing"
              className="uppercase flex items-center gap-3"
              color="foreground"
            >
              <span className="w-4 h-1 bg-primary rounded-full" />
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href="https://discord.gg/PrsTsQ8GdU"
              className="uppercase flex items-center gap-3"
              color="foreground"
            >
              <span className="w-4 h-1 bg-primary rounded-full" />
              Support
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="uppercase flex items-center gap-3"
              color="foreground"
            >
              <span className="w-4 h-1 bg-primary rounded-full" />
              Docs
            </Link>
          </li>
        </ul>
        <div className="flex gap-6">
          <Link href="/">
            <BsTwitterX className="w-6 h-6" />
          </Link>
          <Link href="/">
            <FaDiscord className="w-6 h-6" />
          </Link>

          <Link href="/">
            <FaGithub className="w-6 h-6" />
          </Link>

          <Link href="/">
            <IoIosMail className="w-6 h-6" />
          </Link>
        </div>

        <p className="paragraph-2 mt-3 mb-3">
          © 2024 All rights reserved. Made with ❤️ by{" "}
          <Link href="https://michelemanna.me">
            <span className="text-primary">Michele</span>
          </Link>
        </p>
      </div>
    </footer>
  );
}
