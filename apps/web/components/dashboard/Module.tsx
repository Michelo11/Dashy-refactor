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
    <Card className="w-full h-[130px] bg-modal">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="font-semibold leading-none text-default-600">
              {title}
            </h4>
          </div>
        </div>
        
        <Button
          as={Link}
          color="primary"
          href={id + "/" + link}
          className="uppercase"
        >
          View
        </Button>
      </CardHeader>

      <CardBody className="px-3 py-0 paragraph-2">
        <p>{description}</p>
      </CardBody>
    </Card>
  );
}
