"use client";

import LoadFile from "@/components/loadfile/page";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import {ProtectedRouteComponentemail} from "@/components/protected-route-email"

interface UploadedFile {}

interface Provision {
  ClaseCosto: string | number;
  DescClaseCosto: string;
  CeCo: string | number;
  DescCeCo: string;
  CodProveedor: string | number;
  NombreProveedor: string;
  FechaEnvioProvision: string | number;
  FechaEnvioProvision2: string | number;
  FechaEjecucionServicio: string | number;
  FechaEjecucionServicio2: string | number;
  OC: string | number;
  Posicion: string | number;
  DescripcionServicio: string;
  Moneda: string;
  Monto: number;
  NoEDP: string | number;
  VersionEDP: string;
  Partida: string;
  Glosa: string;
  TipoProvision: string;
  Planta: string;
  Sustento: string;
  id: string;
}

type ResponseData = {
  datos: Provision[];
};

export default function page() {
  const [provisiones, setProvisiones] = useState<UploadedFile[]>([]);
  const [modalLoader, setModalLoader] = useState(true);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleResponse = async (status: number, datos: any) => {
    // console.log("Status:", status);
    // console.log("Datos:", datos);
    setModal(true);

    console.log("Status:", status, "Datos:", datos);

    const convertFieldsToString = (
      provision: Provision
    ): Partial<Provision> => {
      return Object.fromEntries(
        Object.entries(provision).map(([key, value]) => {
          if (key === "Monto") {
            return [key, value]; // Mantiene Monto como está
          }
          return [key, String(value)]; // Convierte otros campos a string
        })
      );
    };

    const convertedProvisions = datos.map(convertFieldsToString);
    const ProvisionFinal = convertedProvisions.map(
      (item: Partial<Provision>) => ({
        ...item,
        Status: "Pendiente Aprobación",
      })
    );
    console.log(ProvisionFinal);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cost/loadprovisiones`,
        ProvisionFinal
      );
      if (response.status === 200) {
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
    <ProtectedRouteComponentemail>
    <>
      <LoadFile
        title={"Carga de Provisiones"}
        MessageOk="Provisiones cargadas correctamente"
        pathExcelProcess={`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/loadprovisionestemp`}
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
            {!modalLoader && <p className="mt-2">Datos Cargados</p>}
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
    </>
    </ProtectedRouteComponentemail>
  );
}
