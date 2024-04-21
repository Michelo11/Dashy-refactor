import { describe, expect, test } from "bun:test";
import webhooks from "../api/webhooks.js";
import { Webhook } from "@repo/database";

const base = "/guilds/1221867796476989481/webhooks";
let webhook: Webhook | null;

describe("Manage Webhooks", () => {
  test("Create webhook [/new]", async () => {
    const res = await webhooks.request(base + "/new", {
      method: "POST",
      body: JSON.stringify({
        action: "ASSIGN_ROLE",
        payload: "1231555121171927052",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response).toHaveProperty("token");

    const { token } = response;
    webhook = response;

    expect(token).toBeDefined();
  });

  test(`Get webhooks [/]`, async () => {
    const res = await webhooks.request(base);
    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response).toBeInstanceOf(Array);
    expect(response).toContainEqual(webhook);
  });

  test(`Delete webhook [/:webhookId]`, async () => {
    const res = await webhooks.request(base + `/${webhook!.token}`, {
      method: "DELETE",
    });

    expect(res.status).toBe(200);

    const response = await res.json();

    expect(response).toEqual({
      success: true,
    });
  });
});