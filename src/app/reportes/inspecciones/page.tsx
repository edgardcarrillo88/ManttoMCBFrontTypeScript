"use client";
import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
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
    title: "Inspección en campo",
    subtitle: "Mantto Planta",
    description: "Generación de reporte de inspección in situ",
    image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400",
    path: "/reportes/inspecciones/generacion",
  },
  {
      title: "Historial de Inspecciones",
    subtitle: "Mantto Planta",
    description: "Listado de inspecciones realizadas",
    image: "https://images.pexels.com/photos/7947758/pexels-photo-7947758.jpeg",
    path: "/reportes/inspecciones/historial",
  },
];

export default function page() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      <div className="mt-8">
        {/* <h1 className="text-6xl font-bold text-rose-700">Marcobre</h1> */}
        <h1 className="text-4xl font-bold text-white">
          Gestión de Reportes
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
