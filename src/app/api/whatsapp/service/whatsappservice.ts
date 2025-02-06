import axios from "axios";

const url = "https://graph.facebook.com/v18.0/207032509162094/messages";
const token =
  "EAAFkCmUvsOoBO8pMXdRlBxbONQ8qzLXOsgZBfdHjquMqbTX9MR83th7dJFUHerTWYLh7HevGwRqq1sVDqzcHTFl6kHshdqSOSQff0mxwxNnhhiwNWzRTiDXfH5UCmpqKhTtVMtWzBZAm15ouPDvC5jrqGt2TGG5uKovlhUFLTgDqkXYaPGkN5bTvUwyH2L";

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

export const sendMessages = async (data: any) => {
  console.log("Enviando mensaje de WhatsApp:");
  try {
    const response = await axios.post(url, data, { headers });
    console.log("Respuesta:", response.data);
    return response.data;
  } catch (error: string | any) {
    console.error(
      "Error al enviar el mensaje de WhatsApp:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const sendImageMessage = async (
  phoneNumber: string,
  imageUrl: string
) => {
  const message = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `${phoneNumber}`,
    type: "image",
    image: {
      link: imageUrl,
    },
  };
  return await sendMessages(message);
};

export const sendSingleMessage = async (
  phoneNumber: string,
  textmessage: string
) => {
  const message = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `${phoneNumber}`,
    type: "text",
    text: {
      preview_url: false,
      body: textmessage,
    },
  };
  return await sendMessages(message);
};

export const sendInteractiveMessageGeneral = async (phoneNumber: string) => {
  console.log("Procesando mensaje interactivo general");

  const message = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `${phoneNumber}`,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "GESTIÓN MANTENIMIENTO PLANTA",
      },
      body: {
        text: "Elige la opción que desees",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "UNIQUE_BUTTON_ID_1",
              title: "PARADA DE PLANTA",
            },
          },
          {
            type: "reply",
            reply: {
              id: "UNIQUE_BUTTON_ID_2",
              title: "GESTION DE COSTOS",
            },
          },
        ],
      },
    },
  };
  return await sendMessages(message);
};

export const sendInteractiveMessageCostos = async (phoneNumber: string) => {
  const message = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `${phoneNumber}`,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "PRESUPUESTO MANTENIMIENTO PLANTA",
      },
      body: {
        text: "Elige el área para saber su presupuesto/consumo de mantenimiento",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: { id: "UNIQUE_BUTTON_ID_1", title: "SULFUROS" },
          },
          {
            type: "reply",
            reply: { id: "UNIQUE_BUTTON_ID_2", title: "OXIDOS" },
          },
          {
            type: "reply",
            reply: { id: "UNIQUE_BUTTON_ID_3", title: "INFRAESTRUCTURA" },
          },
        ],
      },
    },
  };
  return await sendMessages(message);
};

export const sendInteractiveMessagePdP = async (phoneNumber: string) => {
  const message = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `${phoneNumber}`,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "STATUS PARADA DE PLANTA",
      },
      body: {
        text: "Elige la opción que desees",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: { id: "UNIQUE_BUTTON_ID_1", title: "AVANCE GENERAL" },
          },
          {
            type: "reply",
            reply: { id: "UNIQUE_BUTTON_ID_2", title: "AVANCE POR EMPRESA" },
          },
          {
            type: "reply",
            reply: { id: "UNIQUE_BUTTON_ID_3", title: "AVANCE POR AREA" },
          },
        ],
      },
    },
  };
  return await sendMessages(message);
};

export const HandleResponse = async (
  TypeMessage: string,
  from: string,
  button_reply: string
) => {
  type InteractiveResponseKeys =
    | "PARADA DE PLANTA"
    | "AVANCE GENERAL"
    | "AVANCE POR EMPRESA"
    | "AVANCE POR AREA"
    | "GESTION DE COSTOS";
  type InteractiveHandlers = {
    [key in InteractiveResponseKeys]: () => Promise<any> | void;
  };

  const ThirdPartyProgress = () => {
    const AvanceEmpresas = [
      { id: "EMPRESA 1", progress: "50%" },
      { id: "EMPRESA 2", progress: "60%" },
      { id: "EMPRESA 3", progress: "70%" },
    ];

    const MessageThirdParty = AvanceEmpresas.map(
      (empresa) => `${empresa.id}: ${empresa.progress}`
    ).join("\n");
    return MessageThirdParty;
  };

  const AreaProgress = () => {
    const AvanceAreas = [
      { id: "Area 1", progress: "50%" },
      { id: "Area 2", progress: "60%" },
      { id: "Area 3", progress: "70%" },
    ];

    const MessageArea = AvanceAreas.map(
      (Area) => `${Area.id}: ${Area.progress}`
    ).join("\n");
    return MessageArea;
  };

  const interactiveHandlers: InteractiveHandlers = {
    "PARADA DE PLANTA": () => sendInteractiveMessagePdP(from),
    "AVANCE GENERAL": () => sendSingleMessage(from, "50%"),
    "AVANCE POR EMPRESA": () => {
      const Message = ThirdPartyProgress();
      sendSingleMessage(from, Message);
    },
    "AVANCE POR AREA": () => {
      const Message = AreaProgress();
      sendSingleMessage(from, Message);
    },

    "GESTION DE COSTOS": () => sendInteractiveMessageCostos(from),
    // "SULFUROS": () => handleSulfuros(from, messageId),
    // "OXIDOS": () => handleOxidos(from, messageId),
    // "INFRAESTRUCTURA": () => handleInfraestructura(from, messageId),

    // "DEFAULT": () => handleDefaultInteractive(from, messageId) // Un manejador por defecto
  };

  if (TypeMessage === "interactive") {
    const interactiveResponse = button_reply as InteractiveResponseKeys;
    const handler =
      interactiveHandlers[interactiveResponse] ||
      (() => {
        console.log(
          "No se encontró un manejador para la respuesta interactiva."
        );
      });
    await handler();
  }

  if (TypeMessage === "text") {
    sendInteractiveMessageGeneral(from);
  }
};
