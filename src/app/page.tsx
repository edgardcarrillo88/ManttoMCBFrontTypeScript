"use client";
import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useRouter } from "next/navigation";
import Link from "next/link";


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
    description: "Actualización de actividades",
    image: "https://images.pexels.com/photos/2760343/pexels-photo-2760343.jpeg",
    path: "/paradadeplanta/activities",
  },
  {
    title: "Reportes",
    subtitle: "Inspección y formularios",
    description: "Reportabilidad de trabajos en planta",
    image:
      "https://media.istockphoto.com/id/1465188429/es/foto/concepto-de-monitoreo-del-desempe%C3%B1o-empresarial-hombre-de-negocios-que-usa-un-tel%C3%A9fono.jpg?b=1&s=612x612&w=0&k=20&c=Y5RDY60EubhINu3bMCWvjz3xdL5UOVkDh-9jDQ-sLVI=",
    path: "/reportes",
  },
  {
    title: "Costos",
    subtitle: "Mantto Planta",
    description: "Actualización y revisión de costos",
    image:
      "https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    path: "/costos",
  },
  {
    title: "Dashboard",
    subtitle: "PdP",
    description: "Dashboard",
    image:
      "https://media.istockphoto.com/id/1488294044/es/foto/el-empresario-trabaja-en-una-computadora-port%C3%A1til-mostrando-un-panel-de-an%C3%A1lisis-de-negocios.jpg?b=1&s=612x612&w=0&k=20&c=KqRI6iHb1zI9OjWEGkRx5Skq--TNSzSy3HqNMeC_Rps=",
    path: "/dashboard",
  },
];

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      {/* <div className="">
        <h1 className="text-6xl font-bold text-rose-700">Marcobre</h1>
        <h1 className="text-4xl font-bold text-white">
          Plataforma de Gestión de Mantenimiento
        </h1>
        
      </div> */}
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
  );
}
