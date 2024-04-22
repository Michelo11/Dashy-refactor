import { Button, Card, CardBody, Divider, Link } from "@nextui-org/react";
import { TiTick } from "react-icons/ti";

export default function Plans() {
  return (
    <section>
      <h2 className="title text-center">Our Plans</h2>
      <p className="paragraph text-center">
        We offer two plans for simplicity.
      </p>

      <div className="mt-6 flex gap-6 xl:flex-row flex-col items-center justify-center mx-auto">
        <Card className="xl:w-1/4 w-full h-96 bg-modal">
          <CardBody className="flex flex-col items-center justify-center">
            <h2 className="title uppercase">Free</h2>
            <p className="paragraph">forever</p>

            <Divider className="my-3" />

            <ul className="flex flex-col gap-3">
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
            </ul>

            <Button
              as={Link}
              color="primary"
              href="#"
              fullWidth
              variant="flat"
              className="text-inherit uppercase mt-3"
            >
              Add to discord
            </Button>
          </CardBody>
        </Card>

        <Card className="xl:w-1/4 w-full h-96 bg-modal">
          <CardBody className="flex flex-col items-center justify-center">
            <h2 className="title uppercase">$5.99</h2>
            <p className="paragraph">per month</p>

            <Divider className="my-3" />

            <ul className="flex flex-col gap-3">
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
              <li className="flex gap-1">
                <TiTick className="text-primary w-6 h-6" />
                Unlimited Servers
              </li>
            </ul>

            <Button
              as={Link}
              color="primary"
              href="#"
              fullWidth
              className="text-inherit uppercase mt-3"
            >
              Subscribe now
            </Button>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
