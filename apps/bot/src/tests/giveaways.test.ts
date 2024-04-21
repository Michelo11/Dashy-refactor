import { describe, expect, test } from "bun:test";
import giveaways from "../api/giveaways.js";
import { Giveaway } from "@repo/database";

const base = "/guilds/1221867796476989481/giveaways";
let giveaway: Giveaway | null;

describe("Manage Giveaways", () => {
  test("Create giveaway [/new]", async () => {
    const res = await giveaways.request(base + "/new", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Giveaway",
        description: "This is a test giveaway",
        winnerCount: 1,
        channelId: "1221867796476989484",
        endsAt: Date.now() + 1000 * 60 * 60 * 24,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    giveaway = response;

    expect(giveaway).toBeDefined();
  });

  test("Get giveaways [/]", async () => {
    const res = await giveaways.request(base, {
      method: "GET",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response).toBeDefined();
    expect(response).toContainEqual(giveaway);
  });

  test("Get giveaway [/giveawayId]", async () => {
    const res = await giveaways.request(base + `/${giveaway!.id}`, {
      method: "GET",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response).toEqual(giveaway);
  });

  test("Delete Giveaway [/giveawayId]", async () => {
    const res = await giveaways.request(base + `/${giveaway!.id}`, {
      method: "DELETE",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response.success).toEqual(true);
  });
});
