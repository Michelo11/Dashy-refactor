import { Button, Link } from "@nextui-org/react";

export default function Header() {
  return (
    <header className="mt-20 flex flex-col gap-3">
      <h1 className="title w-1/3">Customize Your Discord Experience</h1>
      <p className="paragraph w-1/2">
        Our bot offers a wide range of customizable features to enhance your
        Discord server.
      </p>

      <div className="flex gap-3">
        <Button
          as={Link}
          color="primary"
          href={process.env.NEXT_PUBLIC_BOT_URL}
          className="text-inherit w-fit uppercase"
        >
          Add to discord
        </Button>
        <Button
          as={Link}
          color="secondary"
          href="/dashboard"
          variant="flat"
          className="text-inherit w-fit uppercase"
        >
          Get started
        </Button>
      </div>
    </header>
  );
}
