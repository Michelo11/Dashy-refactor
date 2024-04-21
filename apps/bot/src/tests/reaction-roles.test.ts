import { ReactionRole } from "@repo/database";
import { describe, expect, test } from "bun:test";
import reactionRoles from "../api/reaction-roles.js";

const base = "/guilds/1221867796476989481/reaction-roles";
let reactionRole: ReactionRole | null;

describe("Manage Reaction Roles", () => {
  test("Create Reaction Role [/new]", async () => {
    const res = await reactionRoles.request(`${base}/new`, {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        description: "Test",
        channelId: "1221867796476989484",
        roles: [
          {
            roleId: "1231591974830604348",
            name: "Test",
            emoji: "👍",
            description: "Test",
          },
        ],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response.success).toBe(true);
  });

  test("Get Reaction Roles [/]", async () => {
    const res = await reactionRoles.request(base, {
      method: "GET",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response.length).toBeGreaterThan(0);

    reactionRole = response[0];
  });

  test("Delete Reaction Role [/reactionRoleId]", async () => {
    const res = await reactionRoles.request(`${base}/${reactionRole!.id}`, {
      method: "DELETE",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response.success).toBe(true);
  });
});
