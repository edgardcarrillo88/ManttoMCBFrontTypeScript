"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, File, Trash2, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

type ResponseData = {
  datos: any;
};

type FileUploadPageProps = {
  title: string;
  MessageOk: string;
  pathExcelProcess?: string;
  pathLoadData?: string;
  OnResponse?: (status: number, datos: ResponseData) => void;
};

export default function FileUploadPage({
  title,
  pathExcelProcess,
  pathLoadData,
  OnResponse,
  MessageOk,
}: FileUploadPageProps) {
  const [modal, setModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoader, setModalLoader] = useState(true);

  const router = useRouter();
  const user = useSession().data?.user;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      }));
      setUploadedFiles([...newFiles]);
    }
      event.target.value = "";
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const OnSubmitFile = async () => {
    console.log("Iniciando envío de información");
    setModal(true);
    console.log(user);
    const newfile = new FormData();

    newfile.append("file", uploadedFiles[0].file);
    newfile.append("email", user?.email as string);


    if (pathExcelProcess) {
      console.log("Iniciando procesamiento de datos");
      try {
        const response = await axios.post(
          `${pathExcelProcess}`,
          newfile
        );
        setUploadedFiles([]);
        setModalLoader(false);
        setModal(false);
        console.log(response);
        if (OnResponse) {;
          OnResponse(response.status, response.data.datos);
        }
      } catch (error) {
        setModalLoader(false);
        setModal(false);
        console.log(error);
      }
    } else {
      console.log("No requiere procesamiento de datos");
      setModalLoader(false);
      setModal(false);
      OnResponse?.(0, { datos: newfile });
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click para cargar tu archivo</span> o
                    Arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOC, XLS, CSV (MAX. 10MB)
                  </p>
                </div>
                <Input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  //   multiple
                />
              </label>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white">
                Archivos Cargados
              </h2>
              <Table className="text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre del archivo</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedFiles.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                      <TableCell>{file.type}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Borrar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <div className="flex justify-between">
                  <DialogTrigger asChild className="text-white">
                    <Button className="mt-6">
                      <File className="w-4 h-4 mr-2" />
                      Ver detalles del documento
                    </Button>
                  </DialogTrigger>
                  <div className="text-white flex justify-end">
                    <Button className="shiny-border-file mt-6 bg-gray-700" onClick={() => OnSubmitFile()}>
                      <CloudUpload className="w-4 h-4 mr-2" />
                      Click para Cargar Archivo!
                    </Button>
                  </div>
                </div>
                <DialogContent className="sm:max-w-[425px] text-white bg-gray-700">
                  <DialogHeader>
                    <DialogTitle>Detalles del documento</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <p>Total archivos: {uploadedFiles.length}</p>
                    <p>
                      Total peso:{" "}
                      {uploadedFiles.reduce((acc, file) => acc + file.size, 0) /
                        1024}{" "}
                      KB
                    </p>
                    <ul className="list-disc pl-5">
                      {uploadedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Modal */}
          {modal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 max-w-sm w-full rounded-xl">
                {modalLoader && (
                  <div>
                    <h2 className="text-lg font-bold">Procesando datos</h2>
                    <Spinner size="md" color="primary" labelColor="primary" />
                  </div>
                )}
                {!modalLoader && <p className="mt-2">{MessageOk}</p>}
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
      </main>
    </div>
  );
}
