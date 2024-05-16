import { Level } from "@repo/database";
import { describe, expect, test } from "bun:test";
import levels from "../api/levels.js";

const base = "/guilds/1221867796476989481/levels";
let level: Level | null;

describe("Manage Levels", () => {
  test("Create level [/new]", async () => {
    const res = await levels.request(base + "/new", {
      method: "POST",
      body: JSON.stringify({
        role: "1231591974830604348",
        xp: 1,
        name: "Level 1",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response.success).toBe(true);
  });

  test("Get Levels [/]", async () => {
    const res = await levels.request(base, {
      method: "GET",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response.length).toBeGreaterThan(0);

    level = response[0];
  });

  test("Delete Level [/levelId]", async () => {
    const res = await levels.request(base + "/" + level!.id, {
      method: "DELETE",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response.success).toBe(true);
  });
});
