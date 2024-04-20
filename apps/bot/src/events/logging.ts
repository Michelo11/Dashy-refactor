import { EventType } from "@repo/database";
import { ArgsOf, Discord, On } from "discordx";
import { logAction } from "../utils/logging.js";

@Discord()
class ChannelCreate {
  @On({ event: "channelCreate" })
  async onChannelCreate([channel]: ArgsOf<"channelCreate">) {
    if (!("guild" in channel)) return;

    await logAction(EventType.CHANNEL_CREATE, channel.guild, {
      channel: channel.name,
    });
  }

  @On({ event: "channelDelete" })
  async onChannelDelete([channel]: ArgsOf<"channelDelete">) {
    if (!("guild" in channel)) return;

    await logAction(EventType.CHANNEL_DELETE, channel.guild, {
      channel: channel.name,
    });
  }

  @On({ event: "guildBanAdd" })
  async onGuildBanAdd([ban]: ArgsOf<"guildBanAdd">) {
    await logAction(EventType.GUILD_BAN_ADD, ban.guild, {
      user: ban.user.username,
      reason: ban.reason || "No reason provided",
    });
  }

  @On({ event: "guildBanRemove" })
  async onGuildBanRemove([ban]: ArgsOf<"guildBanRemove">) {
    await logAction(EventType.GUILD_BAN_REMOVE, ban.guild, {
      user: ban.user.username,
    });
  }

  @On({ event: "guildMemberAdd" })
  async onGuildMemberAdd([member]: ArgsOf<"guildMemberAdd">) {
    await logAction(EventType.GUILD_MEMBER_ADD, member.guild, {
      user: member.user.username,
    });
  }

  @On({ event: "guildMemberUpdate" })
  async onGuildMemberRemove([
    oldMember,
    newMember,
  ]: ArgsOf<"guildMemberUpdate">) {
    if (
      oldMember.premiumSince !== newMember.premiumSince &&
      newMember.premiumSince
    ) {
      await logAction(EventType.GUILD_MEMBER_UPDATE, newMember.guild, {
        user: newMember.user.username,
      });
    }

    if (oldMember.nickname === newMember.nickname) return;

    await logAction(EventType.GUILD_MEMBER_UPDATE, newMember.guild, {
      oldNickname: oldMember.nickname || "None",
      newNickname: newMember.nickname || "None",
    });
  }

  @On({ event: "inviteCreate" })
  async onInviteCreate([invite]: ArgsOf<"inviteCreate">) {
    if (!invite.guild || !("channels" in invite.guild)) return;

    await logAction(EventType.INVITE_CREATE, invite.guild, {
      code: invite.code,
      inviter: invite.inviter?.username || "Unknown",
    });
  }

  @On({ event: "inviteDelete" })
  async onInviteDelete([invite]: ArgsOf<"inviteDelete">) {
    if (!invite.guild || !("channels" in invite.guild)) return;

    await logAction(EventType.INVITE_DELETE, invite.guild, {
      code: invite.code,
    });
  }

  @On({ event: "messageDelete" })
  async onMessageDelete([message]: ArgsOf<"messageDelete">) {
    if (!message.guild) return;

    await logAction(EventType.MESSAGE_DELETE, message.guild, {
      message: message.content!,
    });
  }
}
