"use client";
import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {ProtectedRouteComponent} from "@/components/protected-route"

interface Option {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  path: string;
}

const Options: Option[] = [
  {
    title: "Dashboard de costos",
    subtitle: "Mantto Planta",
    description: "Status de costos de Mantenimiento",
    image: "https://media.istockphoto.com/id/1979289147/es/foto/ciencia-del-an%C3%A1lisis-de-datos-y-big-data-con-tecnolog%C3%ADa-de-ia-el-analista-o-cient%C3%ADfico-utiliza.jpg?s=612x612&w=0&k=20&c=hOnSj97xwAie1ZKlnQh2_jTSSmysvK80VR9Grf67OT8=",
    path: "/dashboard/costos",
  },
  {
    title: "Dashboard de indicadores",
    subtitle: "Mantto Planta",
    description: "Indicadores de cumplimiento de Gestión",
    image:
      "https://media.istockphoto.com/id/1488294044/es/foto/el-empresario-trabaja-en-una-computadora-port%C3%A1til-mostrando-un-panel-de-an%C3%A1lisis-de-negocios.jpg?b=1&s=612x612&w=0&k=20&c=KqRI6iHb1zI9OjWEGkRx5Skq--TNSzSy3HqNMeC_Rps=",
    path: "dashboard/gestionmantto",
  },
  {
    title: "Dashboard Seguridad PdP",
    subtitle: "Mantto Planta",
    description: "Sstatus de VCC, RACI y OPT",
    image:
      "https://media.istockphoto.com/id/1314259386/es/foto/t%C3%A9cnico-sosteniendo-fondo-de-luz-solar-de-sombrero-blanco-de-seguridad.jpg?s=612x612&w=0&k=20&c=4pfJmpBu0W2zBZozn_hyi3CMPTjQdghdLi_FnT4B9yY=",
    path: "/dashboard/paradadeplanta/seguridad",
  },
  {
    title: "Dashboard PdP",
    subtitle: "Mantto Planta",
    description: "Detalle de las actividades y recursos de la PdP",
    image:
      "https://media.istockphoto.com/id/1492645918/es/foto/concepto-de-formulario-de-encuesta-el-hombre-de-negocios-que-usa-computadoras-port%C3%A1tiles.jpg?s=612x612&w=0&k=20&c=aVUC_GNKZGAC-z9su8pI1NyaFmi1ZUH6tWtZlUonbxU=",
    path: "/dashboard/paradadeplanta/chadcn",
  },
];

export default function page() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      <div className="mt-8">
        {/* <h1 className="text-6xl font-bold text-rose-700">Marcobre</h1> */}
        <h1 className="text-4xl font-bold text-white">
          Dashboard Mantenimiento
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
  );
}
