// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUserWithDefaultSpace, syncUserFromClerk } from "@/lib/users";
import { UserInterface } from "@/features/user/types/user.types";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ WEBHOOK_SECRET not configured");
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing svix headers");
    return new Response("Error: missing svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Error verifying webhook", {
      status: 400,
    });
  }

  const { type, data } = evt;

  try {
    switch (type) {
      case "user.created": {
        await createUserWithDefaultSpace({
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
          emailAddresses: data.email_addresses?.map((email) => ({
            emailAddress: email.email_address,
          })),
        } as UserInterface);

        break;
      }

      case "user.updated": {
        await syncUserFromClerk({
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
        });

        break;
      }

      case "user.deleted": {
        await prisma.user.update({
          where: { clerk_id: data.id! },
          data: {
            is_active: false,
            updated_at: new Date(),
          },
        });
        break;
      }

      default:
        console.log(`ℹ️ Unhandled webhook event type: ${type}`);
        break;
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error(`❌ Error processing webhook event ${type}:`, error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return new Response(`Error processing webhook: ${type}`, { status: 500 });
  }
}
