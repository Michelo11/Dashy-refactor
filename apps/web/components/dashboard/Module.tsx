"use client";

import { Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react";

export default function Module({
  title,
  description,
  link,
  id,
}: {
  title: string;
  description: string;
  link: string;
  id: string;
}) {
  return (
    <Card className="w-full bg-modal flex flex-col">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="font-semibold leading-none text-default-600">
              {title}
            </h4>
            <h5 className="paragraph-2 mt-3">{description}</h5>
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex flex-col gap-3">
        <Button
          as={Link}
          color="primary"
          href={id + "/" + link}
          className="uppercase"
        >
          View
        </Button>
      </CardBody>
    </Card>
  );
}
