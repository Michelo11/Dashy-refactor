import { GuildMember, StringSelectMenuInteraction } from "discord.js";
import { Discord, SelectMenuComponent } from "discordx";

@Discord()
class ReactionRole {
  @SelectMenuComponent({ id: "reaction-role" })
  async handle(interaction: StringSelectMenuInteraction): Promise<void> {
    await interaction.deferReply({
      ephemeral: true,
    });

    const roles = interaction.values.map((value) => {
      return interaction.guild!.roles.cache.get(value);
    });

    const member = interaction.member! as GuildMember;

    for (const role of roles) {
      await member.roles.add(role!);
    }

    await interaction.editReply({
      content: "Roles added!",
    });
  }
}
