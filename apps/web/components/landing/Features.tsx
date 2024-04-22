import { Card, CardBody } from "@nextui-org/react";
import { FaAlignLeft, FaHammer, FaPaintBrush, FaRobot } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";

export default function Features() {
  return (
    <section id="features">
      <div className="flex gap-6 flex-col lg:flex-row">
        <Card className="lg:w-1/3 w-full bg-modal h-80">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <FaHammer className="text-primary text-8xl" />
            <h2 className="font-bold text-xl uppercase mt-6">Moderation</h2>
            <p className="text-center mt-3">
              Address warns and punish who doesn't respect your rules.
            </p>
          </CardBody>
        </Card>

        <Card className="lg:w-1/3 w-full bg-modal h-80">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <FaAlignLeft className="text-primary text-8xl" />
            <h2 className="font-bold text-xl uppercase mt-6">
              Advanced Logging
            </h2>
            <p className="text-center mt-3">
              Log everything that happens in your server to always stay updated.
            </p>
          </CardBody>
        </Card>

        <Card className="lg:w-1/3 w-full bg-modal h-80">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <FaPaintBrush className="text-primary text-8xl" />
            <h2 className="font-bold text-xl uppercase mt-6">Customizable</h2>
            <p className="text-center mt-3">
              Everything is customizable, make the bot your own.
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="w-full gap-6 mt-6 flex items-center justify-center mx-auto flex-col lg:flex-row">
        <Card className="lg:w-1/3 w-full bg-modal h-80">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <FaRobot className="text-primary text-8xl" />
            <h2 className="font-bold text-xl uppercase mt-6">AI Chatbot</h2>
            <p className="text-center mt-3">
              Talk to our chat bot for simple and easy automatic bot setup.
            </p>
          </CardBody>
        </Card>
        
        <Card className="lg:w-1/3 w-full bg-modal h-80">
          <CardBody className="flex flex-col items-center justify-center m-auto">
            <VscSettings className="text-primary text-8xl" />
            <h2 className="font-bold text-xl uppercase mt-6">Web Panel</h2>
            <p className="text-center mt-3">
              Our detailed web panel alows you to fuly customise and control the
              bot.
            </p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
