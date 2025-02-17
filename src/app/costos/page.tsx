"use client";
import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {ProtectedRouteComponent} from "@/components/protected-route"
import {ProtectedRouteComponentemail} from "@/components/protected-route-email"



interface Option {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  path: string;
}

const Options: Option[] = [
  {
    title: "Cargar Datos",
    subtitle: "Mantto Planta & Mina",
    description: "Cargar datos de presupuesto y real",
    image: "https://media.istockphoto.com/id/1402436756/es/foto/carga-de-documentos-desde-la-carpeta-abra-la-carpeta-archivo-con-documentos-en-blanco.jpg?b=1&s=612x612&w=0&k=20&c=MsBlrt9bWQK8Dd_THdoMthVDY4xb8pdLq7-Kv8rXLOo=",
    path: "/costos/planta/loadfile",
  },
  {
    title: "Costos Mantto Planta",
    subtitle: "Mantto Planta",
    description: "Actualización de datos de costos ",
    image:
      "https://media.tenor.com/au5QHMc9eZEAAAAM/dwinterlude-monkey.gif",
    path: "costos/planta/historial",
  },
  {
    title: "Cargar Provisiones",
    subtitle: "Mantto Planta",
    description: "Cargar datos de provisiones del mes",
    image:
      "https://media.istockphoto.com/id/1398247146/es/foto/concepto-de-gesti%C3%B3n-de-documentos-con-iconos-en-pantalla-virtual-erpbusinessman-trabajando-en.jpg?b=1&s=612x612&w=0&k=20&c=f7NhIWafzxFwDsdIYeX0tRzlHUjHuUre6f0tQ7LthHI=",
    path: "/costos/provisiones/loadfile",
  },
  {
    title: "Historial Provisiones",
    subtitle: "Mantto Planta",
    description: "Revisar el status de las provisiones",
    image:
      "https://images.pexels.com/photos/7693229/pexels-photo-7693229.jpeg?auto=compress&cs=tinysrgb&w=300",
    path: "/costos/provisiones/historial",
  },
  {
    title: "Compromisos",
    subtitle: "Mantto Planta",
    description: "compromisos y saldos por partidas",
    image:
      "https://images.pexels.com/photos/7693229/pexels-photo-7693229.jpeg?auto=compress&cs=tinysrgb&w=300",
    path: "/costos/compromisos",
  },
  {
    title: "Dashboard",
    subtitle: "Mantto Planta",
    description: "Dashboard Budget/Actual/Presupuesto",
    image:
      "https://media.istockphoto.com/id/1488294044/es/foto/el-empresario-trabaja-en-una-computadora-port%C3%A1til-mostrando-un-panel-de-an%C3%A1lisis-de-negocios.jpg?b=1&s=612x612&w=0&k=20&c=KqRI6iHb1zI9OjWEGkRx5Skq--TNSzSy3HqNMeC_Rps=",
    path: "/dashboard",
  },
];

export default function page() {

  return (
 <ProtectedRouteComponentemail>
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      <div className="mt-8">
        {/* <h1 className="text-6xl font-bold text-rose-700">Marcobre</h1> */}
        <h1 className="text-4xl font-bold text-white">
          Gestión de Costos
        </h1>
        
      </div>
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
