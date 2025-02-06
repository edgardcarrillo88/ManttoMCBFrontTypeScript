import { NextResponse } from "next/server";
import { sendInteractiveMessageGeneral, HandleResponse } from "../service/whatsappservice"


async function handler(request: any) {


  //   contraseña de conexion
  const token = "123";
  console.log("Verificando conexion");

  //   cuerpo de los datos de la peticion
  const body = await request.json();//Esto se debe comentar cuando se configura el webhook en meta, despues de configurar si se debe habilitar


  //   credenciales que te envio facebook
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const verify_token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  console.log(mode);

  //   solo para subscribirse para la primera vez
  if (mode === "subscribe" && verify_token === token) {
    return new Response(challenge);
  }

  // console.log("------------");
  // console.log(body);

  const { entry } = body;

  //   recorremos los mensajes
  for (const msg of entry) {
    const { changes } = msg;
    // console.log("changes", changes);
    for (const { field, value } of changes) {
      console.log("field", field);
      console.log("values", value);

      if (value?.messages) {
        const type = value?.messages[0].type;
        // console.log("type", type);

        if (type === "text") {
          const { text, id, from, timestamp } = value.messages[0];
          console.log("text", text);
          // console.log("id", id);
          console.log("from", from);
          console.log("timestamp", timestamp);
          console.log("messages", value.messages);

          // sendInteractiveMessageGeneral(from);
          HandleResponse(type, from, "")
        }

        if (type === "interactive") {
          const { type, from } = value.messages[0];
          const button_reply = value.messages[0].interactive.button_reply;
          console.log("type", type);
          console.log("button_reply", button_reply);
          HandleResponse(type, from, button_reply.title);
        }

        if (type === "image") {
          const { type } = value.messages[0];
          const image = value.messages[0].image;
          console.log("type", type);
          console.log("image", image);
        }

      }
    }
  }

  return new Response(null, { status: 200 });
}

export { handler as GET, handler as POST };
