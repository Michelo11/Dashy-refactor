import { Button, Link } from "@nextui-org/react";
import Image from "next/image";

export default function App() {
  return (
    <nav className="w-full py-3 ">
      <div className="flex justify-between border-1 border-gray-800 p-4 rounded-lg">
        <div className="flex gap-3 items-center">
          <Image
            src="https://dashy.michelemanna.me/icon.svg"
            alt="Navbar Logo"
            width={35}
            height={35}
            draggable={false}
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
            <Link href="#" className="uppercase" color="foreground">
              Support
            </Link>
          </li>
          <li>
            <Link href="#" className="uppercase" color="foreground">
              Docs
            </Link>
          </li>
          <li>
            <Link href="#" className="uppercase" color="foreground">
              Donate
            </Link>
          </li>
        </ul>

        <Button
          as={Link}
          color="primary"
          href="#"
          className="text-inherit uppercase"
        >
          Login
        </Button>
      </div>
    </nav>
  );
}
