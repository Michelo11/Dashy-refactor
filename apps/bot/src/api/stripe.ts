import { Hono } from "hono";
import { hono } from "../main.js";
import authenticated from "../middlewares/authenticated.js";
import stripe from "../lib/stripe.js";
import { User } from "discord.js";
import { prisma } from "@repo/database";

const guilds = new Hono<{ Variables: { user: User } }>().basePath("/stripe");

guilds.get("/checkout", authenticated, async (ctx) => {
  const user = ctx.get("user");

  const customerId = await getCustomer(user);
  if (!customerId) {
    ctx.status(404);
    return ctx.json({ error: "User not saved" });
  }

  const subscriptions = await stripe.subscriptions.list({customer: customerId, status: "active"});
  if (subscriptions.data.length > 0) {
    return ctx.redirect(process.env.APP_URL + "/dashboard");
  }

  const checkout = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: "price_1PAwSpAc73VgTUvY5ulI6dkU",
        quantity: 1,
      },
    ],
    success_url: process.env.APP_URL + "/dashboard",
    cancel_url: process.env.APP_URL,
  });

  return ctx.redirect(checkout.url!);
});

guilds.get("/portal", authenticated, async (ctx) => {
  const user = ctx.get("user");

  const customerId = await getCustomer(user);
  if (!customerId) {
    ctx.status(404);
    return ctx.json({ error: "User not saved" });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.APP_URL,
  });

  return ctx.redirect(portal.url);
});

async function getCustomer(user: User) {
  const prismaUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      stripeId: true,
      email: true,
    },
  });

  if (!prismaUser) {
    return null;
  }

  let customerId = prismaUser.stripeId;

  if (!customerId) {
    customerId = (
      await stripe.customers.create({
        email: prismaUser.email,
        name: user.username,
        metadata: {
          id: user.id,
        },
      })
    ).id;
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripeId: customerId,
    },
  });

  return customerId;
}

hono.route("/", guilds);
export default guilds;