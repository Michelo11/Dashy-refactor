import Image from "next/image";

export default function Guild() {
  return (
    <div className="w-fit flex gap-3">
      <Image
        src="https://dashy.michelemanna.me/icon.svg"
        alt="Guild"
        width={50}
        height={50}
        draggable={false}
      />
      
      <div>
        <p className="font-semibold text-lg">Guild Name</p>
        <p className="paragraph !text-base">3000 Members</p>
      </div>
    </div>
  );
}
