import { describe, expect, test } from "bun:test";
import guilds from "../api/guilds.js";

const base = "/guilds/1221867796476989481";
const name = Math.random().toString(36).substring(7);

describe("Manage Guilds", () => {
  test("Rename Bot [/rename]", async (ctx) => {
    const res = await guilds.request(base + "/rename", {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);

    const response = await res.json();
    expect(response.success).toBe(true);

    ctx();
  });

  test("Get Bot Name [/name]", async (ctx) => {
    const res = await guilds.request(base + "/name", {
      method: "GET",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response).toBe(name);

    ctx();
  });

  test("Set Admin Role [/role]", async (ctx) => {
    const res = await guilds.request(base + "/role", {
      method: "POST",
      body: JSON.stringify({
        role: "1231591974830604348",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response.success).toBe(true);

    ctx();
  });

  test("Get Roles [/roles]", async (ctx) => {
    const res = await guilds.request(base + "/roles", {
      method: "GET",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response).toBeInstanceOf(Array);
    expect(response).toContainEqual({
      id: "1231591974830604348",
      name: "Test Role",
      color: 0,
    });

    ctx();
  });
});
