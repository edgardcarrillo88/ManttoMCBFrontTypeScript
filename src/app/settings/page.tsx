"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRouteComponentemail } from "@/components/protected-route-email";
import { ChevronDownIcon } from "@/components/table/utils/ChevronDownIcon";
import { Selection } from "@nextui-org/table";
import axios from "axios";

import { Button as ButtonChadCN } from "@/components/ui/button";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Send,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { set } from "date-fns";
import { es, se } from "date-fns/locale";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: Date;
  unread?: number;
  online?: boolean;
  participants: string[];
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read"; // opcional
  mediaUrl?: string; // opcional
}

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

const users: User[] = [
  { id: "u1", name: "Tú", avatar: "/avatars/you.png", online: true },
  {
    id: "u2",
    name: "La que jode",
    avatar: "/avatars/maria.png",
    online: true,
  },
  {
    id: "u3",
    name: "Carlos Ruiz",
    avatar: "/avatars/carlos.png",
    online: false,
  },
  {
    id: "u4",
    name: "Grupo Familia",
    avatar: "/avatars/familia.png",
    online: true,
  },
];

const chats: Chat[] = [
  {
    id: "c1",
    name: "La que jode",
    avatar: "https://avatar.iran.liara.run/public/94",
    lastMessage: "Nos vemos a las 7 🙂",
    time: new Date("2025-07-30T10:45:00"),
    unread: 1,
    online: true,
    participants: ["u1", "u2"],
  },
  {
    id: "c2",
    name: "Carlos Ruiz",
    avatar: "https://avatar.iran.liara.run/public/11",
    lastMessage: "Claro, lo reviso y te aviso.",
    time: new Date("2025-07-30T09:20:00"),
    unread: 0,

    online: false,
    participants: ["u1", "u3"],
  },
  {
    id: "c3",
    name: "Grupo Familia 👨‍👩‍👧‍👦",
    avatar: "https://avatar.iran.liara.run/public",
    lastMessage: "Mamá: Almuerzo listo!",
    time: new Date("2025-07-30T08:15:00"),
    unread: 3,
    online: true,
    participants: ["u1", "u2", "u4"],
  },
];

const messages: Message[] = [
  // Chat con María (c1)
  {
    id: "m1",
    chatId: "c1",
    senderId: "u2",
    text: "Hola! ¿Ya saliste?",
    timestamp: new Date("2025-07-30T10:30:00"),
    status: "read",
  },
  {
    id: "m2",
    chatId: "c1",
    senderId: "u1",
    text: "Sí, estoy en camino 😊",
    timestamp: new Date("2025-07-30T10:31:00"),
    status: "read",
  },
  {
    id: "m3",
    chatId: "c1",
    senderId: "u2",
    text: "Perfecto. Nos vemos a las 7 🙂",
    timestamp: new Date("2025-07-30T10:45:00"),
    status: "sent",
  },

  // Chat con Carlos (c2)
  {
    id: "m4",
    chatId: "c2",
    senderId: "u3",
    text: "Oye, revisaste el informe que te mandé?",
    timestamp: new Date("2025-07-30T09:00:00"),
    status: "delivered",
  },
  {
    id: "m5",
    chatId: "c2",
    senderId: "u1",
    text: "No aún, estoy justo saliendo. Te aviso luego.",
    timestamp: new Date("2025-07-30T09:10:00"),
    status: "delivered",
  },
  {
    id: "m6",
    chatId: "c2",
    senderId: "u3",
    text: "Claro, lo reviso y te aviso.",
    timestamp: new Date("2025-07-30T09:20:00"),
    status: "delivered",
  },

  // Grupo Familia (c3)
  {
    id: "m7",
    chatId: "c3",
    senderId: "u2",
    text: "¿Alguien quiere ir al parque esta tarde?",
    timestamp: new Date("2025-07-30T08:00:00"),
    status: "read",
  },
  {
    id: "m8",
    chatId: "c3",
    senderId: "u4",
    text: "Mamá: Almuerzo listo!",
    timestamp: new Date("2025-07-30T08:15:00"),
    status: "read",
  },
  {
    id: "m9",
    chatId: "c3",
    senderId: "u1",
    text: "Yo paso por pan al rato 😁",
    timestamp: new Date("2025-07-30T08:20:00"),
    status: "read",
  },
  {
    id: "m10",
    chatId: "c3",
    senderId: "u2",
    text: "Gracias!",
    timestamp: new Date("2025-07-30T08:21:00"),
    status: "read",
  },
];

const WhatsAppClone = function WhatsAppClone() {
  const [ChatList, setChatList] = useState<Chat[]>(chats);
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [TotalMessages, setTotalChatMessages] = useState<Message[]>(messages);

  const filterChats = (key: string) => {
    const filter = chats.filter((item) =>
      item.name.toLowerCase().includes(key)
    );
    setChatList(filter);
  };

  const handleSendMessage = () => {
    console.log("chatMessages", chatMessages);

    if (newMessage.trim()) {
      const message: Message = {
        chatId: selectedChat.id,
        senderId: "u1",
        id: Date.now().toString(),
        text: newMessage,
        timestamp: new Date(),
        status: "sent",
      };

      setTotalChatMessages([...TotalMessages, message]);
      setChatMessages([...chatMessages, message]);

      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Lista de chats */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header del sidebar */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
            <ButtonChadCN variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </ButtonChadCN>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar o empezar un chat nuevo"
              className="pl-10 bg-gray-100 border-none"
              onChange={(e) => filterChats(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de chats */}
        <ScrollArea className="flex-1">
          {ChatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);

                // setChatMessages(
                //   chatMessages.length === 0
                //     ? messages.filter((message) => message.chatId === chat.id)
                //     : chatMessages.filter(
                //         (message) => message.chatId === chat.id
                //       )
                // );

                setChatMessages(TotalMessages.filter((message) => message.chatId === chat.id));
                
              }}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedChat.id === chat.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={chat.avatar || "/placeholder.svg"}
                    alt={chat.name}
                  />
                  <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {chat.time.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage}
                  </p>
                  {(chat.unread ?? 0) > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {chat.unread === 0 ? "" : chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Área principal de chat */}
      <div className="flex-1 flex flex-col">
        {/* Header del chat */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={selectedChat.avatar || "/placeholder.svg"}
                alt={selectedChat.name}
              />
              <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h2 className="font-medium text-gray-900">{selectedChat.name}</h2>
              {/* <p className="text-sm text-gray-500">
                {selectedChat.online ? "En línea" : "Última vez hace 2 horas"}
              </p> */}
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <ButtonChadCN variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </ButtonChadCN>
            <ButtonChadCN variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </ButtonChadCN>
            <ButtonChadCN variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </ButtonChadCN>
          </div> */}
        </div>

        {/* Área de mensajes */}
        <ScrollArea className="flex-1 p-4 bg-gray-50">
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === "u1" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === "u1"
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === "u1"
                        ? "text-green-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("es-ES", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Campo de entrada de mensaje */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <ButtonChadCN variant="ghost" size="icon">
              <Smile className="h-5 w-5 text-gray-500" />
            </ButtonChadCN>
            <ButtonChadCN variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </ButtonChadCN>
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje"
                className="pr-12"
              />
              {newMessage.trim() ? (
                <ButtonChadCN
                  onClick={handleSendMessage}
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-green-500 hover:bg-green-600"
                >
                  <Send className="h-4 w-4" />
                </ButtonChadCN>
              ) : (
                <ButtonChadCN
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  {/* <Mic className="h-4 w-4 text-gray-500" /> */}
                </ButtonChadCN>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Admin" },
    { id: 2, name: "María López", email: "maria@example.com", role: "User" },
  ]);

  const ArrayPlantillas = [
    { uid: "plantillaprueba", name: "Plantilla de prueba" },
    { uid: "plantillacero", name: "Plantilla Mia Festa" },
    { uid: "plantillainicial", name: "Plantilla con boton de respuesta" },
    { uid: "plantillasapito", name: "Plantilla Sapito" },
  ];

  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [PlantillaSeleccionada, setPlantillaSeleccionada] =
    React.useState<Selection>(new Set([]));
  const [PhoneNumber, setPhoneNumber] = useState({
    number: "",
  });

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, { ...newUser, id: users.length + 1, role: "User" }]);
    setNewUser({ name: "", email: "" });
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const SendTemplateMessage = async () => {
    console.log("Enviando Plantilla");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/sendtemplate`,
        { phone: PhoneNumber, plantilla: PlantillaSeleccionada }
      );
      console.log(response.status);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProtectedRouteComponentemail empresa="Marcobre">
      <div className="min-h-screen bg-gray-950 flex flex-col items-center p-10 text-white space-y-6">
        <h1 className="text-3xl font-bold">⚙️ Configuración</h1>

        {/* Gestión de Usuarios */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>👥 Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Nombre"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
              <Input
                type="email"
                placeholder="Correo"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <Button onClick={addUser}>Agregar</Button>
            </div>
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between bg-gray-800 p-2 rounded"
                >
                  <span>
                    {user.name} - {user.email}
                  </span>
                  <Button
                    variant="faded"
                    size="sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Mensajes de WhatsApp */}
        <Card className="w-5/6">
          <CardHeader>
            <CardTitle>Mensajes de WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Label>Enviar plantilla:</Label>

              <Dropdown>
                <DropdownTrigger className="w-80">
                  <Button
                    className="w-auto"
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="faded"
                  >
                    {Array.from(PlantillaSeleccionada).length === 0
                      ? "Plantillas"
                      : PlantillaSeleccionada}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={PlantillaSeleccionada}
                  selectionMode="single"
                  onSelectionChange={setPlantillaSeleccionada}
                >
                  {ArrayPlantillas.map((plantilla) => (
                    <DropdownItem key={plantilla.uid} className="capitalize">
                      {plantilla.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <Input
                type="number"
                placeholder="Celular (9 digitos)"
                className="w-60"
                value={PhoneNumber.number}
                onChange={(e) =>
                  setPhoneNumber({ ...PhoneNumber, number: e.target.value })
                }
              />
              <Button className="w-60" onClick={() => SendTemplateMessage()}>
                Enviar mensaje
              </Button>
            </div>
            <ul className="space-y-2"></ul>
          </CardContent>
        </Card>

        {/* Conversación de WhatsApp */}
        <Card className="w-5/6">
          <CardHeader>
            <CardTitle>WhatSAPito 🐸</CardTitle>
          </CardHeader>
          <CardContent>
            <WhatsAppClone />
          </CardContent>
        </Card>
      </div>
    </ProtectedRouteComponentemail>
  );
}
