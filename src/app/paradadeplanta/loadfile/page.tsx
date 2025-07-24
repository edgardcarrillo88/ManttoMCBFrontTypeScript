"use client";

import LoadFile from "@/components/loadfile/page";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import { ProtectedRouteComponentemail } from "@/components/protected-route-email";

interface UploadedFile {}

interface ActivitiesInterface {
  id: number;
  nivel: number;
  WBS: string;
  area: string;
  descripcion: string;
  TAG: string;
  OT: string;
  inicioplan: Date;
  finplan: Date;
  contratista: string;
  especialidad: string;
  responsable: string;
  rutacritica: string;
  estado: string;
  avance: number;
  hh: number;
  curva: string;
  BloqueRC: string;
  ActividadCancelada: string;
}

type ResponseData = {
  datos: ActivitiesInterface[];
};

export default function page() {
  const [modalLoader, setModalLoader] = useState(true);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleResponse = async (status: number, datos: any) => {
    setModal(true);

    try {
      if (status === 200) {
        setModalLoader(false);
        setMessage("Datos cargados correctamente");
      }
    } catch (error) {
      setModalLoader(false);
      setMessage("Error al cargar los datos");
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));
    setModalLoader(false);
  };

  return (
    <>
      <ProtectedRouteComponentemail empresa="Marcobre">
       
     
      <LoadFile
        title={"Carga de Actividades de Parada de Planta"}
        MessageOk="Actividades cargadas correctamente"
        pathExcelProcess={`${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/loadactivities`}
        OnResponse={handleResponse}
      />
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 max-w-sm w-full rounded-xl">
            {modalLoader && (
              <div>
                <h2 className="text-lg font-bold">
                  Cargando datos a base de datos
                </h2>
                <Spinner size="md" color="primary" labelColor="primary" />
              </div>
            )}
            {!modalLoader && <p className="mt-2">{message}</p>}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setModal(false);
                  setModalLoader(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
       </ProtectedRouteComponentemail>
    </>
  );
}
