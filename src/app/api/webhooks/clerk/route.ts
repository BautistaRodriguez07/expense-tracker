import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createOrUpdateUser } from "@/lib/users";

export async function POST(req: Request) {
  // Puedes encontrar esto en el Dashboard de Clerk -> Webhooks -> elige el webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Por favor agrega WEBHOOK_SECRET del Dashboard de Clerk a .env o .env.local"
    );
  }

  // Obtener los headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Si no hay headers, devolver error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: faltan headers svix", {
      status: 400,
    });
  }

  // Obtener el cuerpo de la petición
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Crear una nueva instancia de Svix con tu secreto
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verificar el payload con los headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verificando webhook:", err);
    return new Response("Error de verificación", {
      status: 400,
    });
  }

  // Manejar el evento
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      // Mapear datos de Clerk al formato esperado por createOrUpdateUser
      // Nota: Usamos 'as any' porque la interfaz UserInterface espera tipos específicos
      // pero createOrUpdateUser maneja el mapeo internamente.
      await createOrUpdateUser({
        id: id,
        firstName: first_name,
        lastName: last_name,
        emailAddresses: email_addresses?.map(email => ({
          emailAddress: email.email_address,
        })),
      } as any);

      return new Response("Usuario creado/actualizado", { status: 200 });
    } catch (error) {
      console.error("Error procesando datos de usuario:", error);
      return new Response("Error procesando datos", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
