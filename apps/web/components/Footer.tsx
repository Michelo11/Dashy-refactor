import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="bg-[#111520] mt-[-100px]">
      <div className="gap-6 flex-col items-center justify-center flex pt-[126px] p-3">
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
              href="#"
              className="uppercase flex items-center gap-3"
              color="foreground"
            >
              <span className="w-4 h-1 bg-primary rounded-full" />
              Pricing
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
          <li>
            <Link
              href="#"
              className="uppercase flex items-center gap-3"
              color="foreground"
            >
              <span className="w-4 h-1 bg-primary rounded-full" />
              Contact
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

        <p className="paragraph mt-3 mb-3">
          © 2024 All rights reserved. Made with ❤️ by{" "}
          <Link href="https://michelemanna.me">
            <span className="text-primary">Michele</span>
          </Link>
        </p>
      </div>
    </footer>
  );
}
