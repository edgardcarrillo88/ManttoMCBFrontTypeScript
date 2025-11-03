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
    title: "Cargar Cronograma",
    subtitle: "Mantto Planta",
    description: "Cargar datos del cronograma de PdP",
    image: "https://media.istockphoto.com/id/1402436756/es/foto/carga-de-documentos-desde-la-carpeta-abra-la-carpeta-archivo-con-documentos-en-blanco.jpg?b=1&s=612x612&w=0&k=20&c=MsBlrt9bWQK8Dd_THdoMthVDY4xb8pdLq7-Kv8rXLOo=",
    path: "/paradadeplanta/loadfile",
  },
  {
    title: "Listado de actividades",
    subtitle: "Mantto Planta",
    description: "Actualización de las actividades de PdP",
    image:
      "https://media.istockphoto.com/id/1433763560/es/foto/concepto-de-gesti%C3%B3n-de-proyectos-analista-que-trabaja-con-el-ordenador-en-el-sistema-de.jpg?b=1&s=612x612&w=0&k=20&c=ffHtB1_W5POoGF3I437eoOzrMGSTxN9AXUUz8sIDNHQ=",
    path: "/paradadeplanta/activities",
  },
  {
    title: "Dashboard",
    subtitle: "Mantto Planta",
    description: "Curva S de PdP",
    image:
      "https://media.istockphoto.com/id/1398247146/es/foto/concepto-de-gesti%C3%B3n-de-documentos-con-iconos-en-pantalla-virtual-erpbusinessman-trabajando-en.jpg?b=1&s=612x612&w=0&k=20&c=f7NhIWafzxFwDsdIYeX0tRzlHUjHuUre6f0tQ7LthHI=",
    path: "/dashboard/paradadeplanta/chadcn",
  },
  {
    title: "Curso Lineamientos Seg. PdP",
    subtitle: "Mantto Planta",
    description: "Examen de lineamientos seg.",
    image:
      "https://images.pexels.com/photos/7092540/pexels-photo-7092540.jpeg?auto=compress&cs=tinysrgb&w=400",
    path: "/paradadeplanta/induccion",
  },
];

export default function page() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      <div className="mt-8">
        {/* <h1 className="text-6xl font-bold text-rose-700">Marcobre</h1> */}
        <h1 className="text-4xl font-bold text-white">
          Gestión de Paradas de Planta
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
