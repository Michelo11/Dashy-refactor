import Image from "next/image";

export default function Guild({
  name,
  icon,
  members,
}: {
  name: string;
  icon: string;
  members: number;
}) {
  return (
    <div className="w-fit flex gap-3">
      <Image
        src={icon || "/logo.png"}
        alt="Trending Guild"
        width={50}
        height={50}
        draggable={false}
      />

      <div>
        <p className="font-semibold text-lg">{name}</p>
        <p className="paragraph !text-base">{members} Members</p>
      </div>
    </div>
  );
}
