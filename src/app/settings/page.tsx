"use client";
import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ProtectedRouteComponentemail } from "@/components/protected-route-email";

interface Option {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  path: string;
}

const Options: Option[] = [
  {
    title: "Parada de Planta",
    subtitle: "PdP",
    description: "Configuración de base de datos",
    image: "https://images.pexels.com/photos/2760343/pexels-photo-2760343.jpeg",
    path: "/settings/paradadeplanta",
  },
  {
    title: "Indicadores",
    subtitle: "Cumplimiento semanal OTs, avisos y Backlog",
    description: "Configuración de base de datos",
    image:
      "https://media.istockphoto.com/id/1465188429/es/foto/concepto-de-monitoreo-del-desempe%C3%B1o-empresarial-hombre-de-negocios-que-usa-un-tel%C3%A9fono.jpg?b=1&s=612x612&w=0&k=20&c=Y5RDY60EubhINu3bMCWvjz3xdL5UOVkDh-9jDQ-sLVI=",
    path: "/settings/indicadores",
  },
  {
    title: "Costos",
    subtitle: "Mantto Planta",
    description: "Actualización de Budget, Forecast y Actual",
    image:
      "https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    path: "/settings/costos",
  },
  {
    title: "WhatsApp",
    subtitle: "Configuración de mensajería y alertas",
    description: "Notificaciones",
    image:"https://media.istockphoto.com/id/1494003131/es/foto/escriba-el-mensaje-de-chat-en-el-tel%C3%A9fono-inteligente.jpg?b=1&s=612x612&w=0&k=20&c=CngRSZihcGmHe-uK2cuZOtmgZfuggbfXaPVtTJmPEwE=",
        path: "/settings/whatsapp",
  },
];


export default function Home() {
  return (
    <ProtectedRouteComponentemail empresa="Marcobre">
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Options.map((option: any, index: number) => {
            return (
              <div key={index}>
                <Link href={option.path}>
                  <Card className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <h4 className="font-bold text-large">{option.title}</h4>
                      <small className="text-default-500">
                        {option.description}
                      </small>
                      <p className="text-tiny font-bold">{option.subtitle}</p>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        isZoomed
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src={option.image}
                        width={270}
                        height={270}
                      />
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRouteComponentemail>
  );
}
