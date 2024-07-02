import Event from "@/components/dashboard/Event";

const events = [
  {
    id: "CHANNEL_CREATE",
    name: "Channel Created",
    description: "This event is fired when a new channel is created.",
  },
  {
    id: "CHANNEL_DELETE",
    name: "Channel Deleted",
    description: "This event is fired when a channel is deleted.",
  },
  {
    id: "GUILD_BAN_ADD",
    name: "Member Banned",
    description: "This event is fired when a member is banned from a guild.",
  },
  {
    id: "GUILD_BAN_REMOVE",
    name: "Member Unbanned",
    description: "This event is fired when a member is unbanned from a guild.",
  },
  {
    id: "GUILD_MEMBER_ADD",
    name: "Member Joined",
    description: "This event is fired when a new member joins a guild.",
  },
  {
    id: "GUILD_MEMBER_UPDATE",
    name: "Member Updated",
    description: "This event is fired when a member's metadata is updated.",
  },
  {
    id: "GUILD_BOOST",
    name: "Server Boosted",
    description: "This event is fired when someone boosts the server.",
  },
  {
    id: "INVITE_CREATE",
    name: "Invite Created",
    description: "This event is fired when an invite is created.",
  },
  {
    id: "INVITE_DELETE",
    name: "Invite Deleted",
    description: "This event is fired when an invite is deleted.",
  },
  {
    id: "MESSAGE_DELETE",
    name: "Message Deleted",
    description: "This event is fired when a message is deleted.",
  },
  {
    id: "GUILD_WARN_CREATE",
    name: "Member Warned",
    description: "This event is fired when a member is warned.",
  },
  {
    id: "GUILD_WARN_DELETE",
    name: "Member Warn Removed",
    description: "This event is fired when a member's warn is removed.",
  },
  {
    id: "TRANSCRIPT_CREATE",
    name: "Transcript Created",
    description:
      "This event is fired when a transcript is created from a ticket.",
  },
];

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="title w-1/3">Events</h1>
      <p className="paragraph w-1/2">
        Send messages for everything that happens on the server such as join,
        leave and bans.
      </p>

      <div className="2xl:grid flex flex-col gap-3 grid-cols-4">
        {events.map((event) => (
          <Event
            guildId={id}
            id={event.id}
            key={event.id}
            name={event.name}
            description={event.description}
          />
        ))}
      </div>
    </section>
  );
}
