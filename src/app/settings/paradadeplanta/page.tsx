"use client";
import { ProtectedRouteComponentemail } from "@/components/protected-route-email";

import { ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";

export default function page() {
  const [modal, setModal] = useState(false);
  const [modalLoader, setModalLoader] = useState(true);
  const [message, setMessage] = useState("");

  const handleButton = async (endpoint: string, bdname: string) => {
    setModal(true);
    setModalLoader(true);
    try {
      const response = await axios.post(`${endpoint}`);
      console.log(response);
      console.log("Datos eliminados de la base de datos");
      if (response.status === 200) {
        setMessage(
          `Datos eliminados de manera correcta de la base de datos de ${bdname}`
        );
      }
    } catch (error) {
      console.log(error);
      setMessage(
        `Error al eliminar los datos de la base de datos de ${bdname}`
      );
    }
  };

  return (
    <ProtectedRouteComponentemail empresa="Marcobre">
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        <div className="w-5/6 flex flex-col items-start mt-8 mb-8 mx-auto gap-4 p-4">
          <div className="flex w-full max-w-lg flex-col gap-6">
            <Item variant="outline" className="rounded-2xl">
              <ItemMedia variant="icon">
                <ShieldAlertIcon />
              </ItemMedia>
              <ItemContent className="text-white">
                <ItemTitle>Base de datos de Actividades</ItemTitle>
                <ItemDescription>
                  Borrar datos de la base de datos
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white rounded-2xl border-red-500"
                  onClick={() =>
                    handleButton(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/deleteschedule`,
                      "Actividades"
                    )
                  }
                >
                  Borrar
                </Button>
              </ItemActions>
            </Item>
          </div>

          <div className="flex w-full max-w-lg flex-col gap-6">
            <Item variant="outline" className="rounded-2xl">
              <ItemMedia variant="icon">
                <ShieldAlertIcon />
              </ItemMedia>
              <ItemContent className="text-white">
                <ItemTitle>
                  Base de datos historial de actualizaciones
                </ItemTitle>
                <ItemDescription>
                  Borrar datos de la base de datos
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white rounded-2xl border-red-500"
                  onClick={() =>
                    handleButton(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/deleteschedulehistorydata`,
                      "Historial"
                    )
                  }
                >
                  Borrar
                </Button>
              </ItemActions>
            </Item>
          </div>
        </div>

        {modal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 max-w-sm w-full rounded-xl">
              {modalLoader && (
                <div>
                  <h2 className="text-lg font-bold ">
                    Borrando datos de la base de datos
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
      </div>
    </ProtectedRouteComponentemail>
  );
}
