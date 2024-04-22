import { Card, CardBody } from "@nextui-org/react";

export default function WhyUs() {
  return (
    <section id="whyus" className="lg:flex w-full items-center gap-3">
      <div className="w-1/2">
        <h2 className="title">Why us?</h2>
        <p className="paragraph mt-3">
          Our bot is designed to enhance your server's functionality and user
          experience. With all our features being customizable, you can feel the
          bot as your custom one.
        </p>

        <div className="mt-3 flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 block bg-primary rounded-full" />
            Warns
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-1 block bg-primary rounded-full" />
            Tickets
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-1 block bg-primary rounded-full" />
            Logging
          </div>
        </div>
      </div>

      <div className="xl:w-1/2 w-full flex gap-3 xl:mt-0 mt-3">
        <Card className="w-1/3 h-36 bg-modal">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <h1 className="title text-primary">9</h1>
            <p className="paragraph">Command executed</p>
          </CardBody>
        </Card>

        <Card className="w-1/3 h-36 bg-modal overflow-none">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <h1 className="title text-primary">9</h1>
            <p className="paragraph">Community guilds</p>
          </CardBody>
        </Card>

        <Card className="w-1/3 h-36 bg-modal">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <h1 className="title text-primary">627</h1>
            <p className="paragraph">Active users</p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
