// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createOrUpdateUser } from "@/lib/users";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Obtener los headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
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
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", {
      status: 400,
    });
  }

  // Manejar el evento
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      // ✅ Crear/actualizar usuario y obtener spaceId
      const result = await createOrUpdateUser({
        id: id,
        firstName: first_name,
        lastName: last_name,
        emailAddresses: email_addresses?.map(email => ({
          emailAddress: email.email_address,
        })),
      } as any);

      console.log(
        `✅ Usuario ${eventType === "user.created" ? "created" : "updated"}:`,
        id,
        `- Active Space: ${result.spaceId}`
      );

      return new Response("User created/updated", { status: 200 });
    } catch (error) {
      console.error("Error processing user data:", error);
      return new Response("Error processing user data", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
