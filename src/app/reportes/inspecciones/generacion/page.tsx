"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  AlertTriangle,
  X,
  Upload,
  FileText,
  ImageIcon,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { ProtectedRouteComponentemail } from "@/components/protected-route-email";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";

const empresas = [
  "Empresa Industrial ABC S.A.",
  "Manufacturas del Norte Ltda.",
  "Corporación Metalúrgica XYZ",
  "Industrias Químicas del Sur",
  "Textiles y Confecciones S.A.S.",
  "Alimentos Procesados Colombia",
  "Construcciones y Obras Civiles",
  "Tecnología y Sistemas Integrados",
];

const areas = [
  "Sulfuros - Chando Primario",
  "Sulfuros - Chando Secundario",
  "Sulfuros - Chancado Terciario",
  "Sulfuros - Moliendas",
  "Sulfuros - Espesamiento",
  "Sulfuros - Filtrado",
  "Sulfuros - Flotación",
  "Sulfuros - Talleres",
  "Oxidos - Chando Primario",
  "Oxidos - Chando Secundario",
  "Oxidos - Chancado Terciario",
  "Oxidos - Pre-Tratamiento",
  "Oxidos - Bateas",
  "Oxidos - Ripios",
  "Oxidos - EW",
  "Almacén L30",
];

const categorias = [
  "Paralización Trabajos por infringir standard SSO y MA",
  "Accidente con tiempo perdido, evento alto potencial",
  "Iniciar trabajos sin documentos aprobados (FOCAM)",
  "Arrojar  residuos en carretera",
  "No reportar ocurrencia incidente o accidente inmediato",
  "No cumplir con disposiciones y recomendaciones expresas MCB",
  "No proveer a su personal todos los implementos, equipos y materiales",
  "No cumplir los reglamentos internos de MCB",
  "Falta de orden y limpieza",
  "Destacar a MCB personal que no cuente con competencias, acreditaciones previamente verificadas",
  "Destacar a MCB equipos, herramientas, maquinarias y vehiculos que no cumplan con los standares",
];

const tiposRiesgo = [
  "Riesgo Físico",
  "Riesgo Químico",
  "Riesgo Biológico",
  "Riesgo Ergonómico",
  "Riesgo Psicosocial",
  "Riesgo Mecánico",
  "Riesgo Eléctrico",
  "Riesgo Locativo",
];

const nivelesRiesgo = ["Bajo", "Medio", "Alto", "Crítico"];

// Schema de validación con Zod
const formSchema = z
  .object({
    empresa: z.string().min(1, "Debe seleccionar una empresa"),
    categoria: z.string().min(1, "Debe seleccionar una categoría"),
    fecha: z.date({
      message: "Campo obligatorio",
    }),
    hora: z.string().min(1, "La hora es obligatoria"),
    area: z.string().min(1, "Debe seleccionar un área"),
    descripcion: z
      .string()
      .min(10, "La descripción debe tener al menos 10 caracteres"),
    esObservacionSeguridad: z.boolean().default(false),
    tipoRiesgo: z.string().optional(),
    nivelRiesgo: z.string().optional(),
    Archivo: z
      .array(
        z.any().refine((file) => file instanceof File, {
          message: "Debes seleccionar al menos un archivo.",
        })
      )
      .min(1, { message: "Debes seleccionar al menos un archivo." }),
  })
  .refine(
    (data) => {
      // Si es observación de seguridad, los campos de riesgo son obligatorios
      if (data.esObservacionSeguridad) {
        return data.tipoRiesgo && data.nivelRiesgo;
      }
      return true;
    },
    {
      message:
        "Los campos de tipo y nivel de riesgo son obligatorios para observaciones de seguridad",
      path: ["tipoRiesgo"],
    }
  );

type DatosFormularioSchema = z.infer<typeof formSchema>;

const FormInspecciones = () => {
  const [openEmpresa, setOpenEmpresa] = useState(false);
  const [openArea, setOpenArea] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [modalLoader, setModalLoader] = useState(true);
  const [modal, setModal] = useState(false);
  const [fileNames, setFileNames] = useState<File[]>([]);

  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<DatosFormularioSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresa: "",
      categoria: "",
      fecha: new Date(),
      hora: "",
      area: "",
      descripcion: "",
      esObservacionSeguridad: false,
      tipoRiesgo: "",
      nivelRiesgo: "",
      Archivo: [],
    },
  });

  const watchEsObservacionSeguridad = form.watch("esObservacionSeguridad");
  console.log(form.watch());

  const onSubmit = async (values: DatosFormularioSchema) => {
    try {
      setModal(true);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const typedKey = key as keyof DatosFormularioSchema;
        const value = values[typedKey];
        if (key !== "archivos" && value !== undefined) {
          if (Array.isArray(value)) {
            // value.forEach((item) => DatosFormularioSchema.append(key, item.toString()));
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      formData.append("User", session?.user?.name as string);
      formData.append("email", session?.user?.email as string);

      if (archivos && archivos.length > 0) {
        archivos.forEach((file: File) => {
          formData.append("file", file);
        });
      }

      console.log({
        ...values,
        archivos: archivos,
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/crearinpeccion`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("todo de ptmr");
        setTimeout(() => {
          setModalLoader(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isDocument =
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain";
      return isImage || isDocument || isVideo;
    });
    setArchivos((prev) => [...prev, ...validFiles]);
    form.setValue("Archivo", validFiles);
  };

  const removeFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-400" />;
    }
    return <FileText className="h-4 w-4 text-green-400" />;
  };

  return (
    <ProtectedRouteComponentemail>
      <>
        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 max-w-sm w-full rounded-xl">
              {modalLoader && (
                <div>
                  <h2 className="text-lg font-bold">
                    Procesando la informacion
                  </h2>
                  <Spinner size="md" color="primary" labelColor="primary" />
                </div>
              )}
              {!modalLoader && <p className="mt-2">Reporte Guardado</p>}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setModal(false);
                    setModalLoader(false);
                    router.push("/reportes");
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center p-4">
          <div className="w-full max-w-2xl">
            <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  Reporte de No Conformidades
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Complete el formulario para reportar una no conformidad
                  identificada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Empresa Observada */}
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white font-medium">
                            Empresa Observada *
                          </FormLabel>
                          <Popover
                            open={openEmpresa}
                            onOpenChange={setOpenEmpresa}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openEmpresa}
                                  className="w-full justify-between bg-white/5 border-gray-600 text-white hover:bg-white/10"
                                >
                                  {field.value || "Seleccionar empresa..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
                              <Command>
                                <CommandInput
                                  placeholder="Buscar empresa..."
                                  className="text-black"
                                />
                                <CommandList>
                                  <CommandEmpty className="text-gray-400">
                                    No se encontró la empresa.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {empresas.map((empresa) => (
                                      <CommandItem
                                        key={empresa}
                                        value={empresa}
                                        onSelect={() => {
                                          field.onChange(empresa);
                                          setOpenEmpresa(false);
                                        }}
                                        className="text-gray bg-white/20 hover:bg-gray-700"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === empresa
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {empresa}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Categoría y Fecha/Hora */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="categoria"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-white font-medium">
                              Categoría *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-gray-600 text-white">
                                  <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                className="bg-gray-800 border-gray-600"
                                // onTouchStart={(e) => {
                                //   e.stopPropagation();
                                // }}
                              >
                                {categorias.map((categoria) => (
                                  <SelectItem
                                    key={categoria}
                                    value={categoria.toString()}
                                    className="text-white hover:bg-gray-700"
                                  >
                                    {categoria}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/*Fecha*/}
                      <FormField
                        control={form.control}
                        name="fecha"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-white font-medium">
                              Fecha *
                            </FormLabel>
                            {/* <FormControl>
                              <Input
                                type="date"
                                className="bg-white/5 border-gray-600 text-white"
                                {...field}
                              />
                            </FormControl> */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-[240px] pl-4 w-48 pr-3 py-2 text-left font-normal bg-gray-700 text-white border-2 border-gray-600 rounded-xl shadow-md hover:bg-gray-600 focus:ring-2 focus:ring-blue-400 transition-all",
                                      !field.value && "text-gray-400"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Selecciona una fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-5 w-5 text-blue-400 opacity-80 transition-opacity duration-200" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  // disabled={(date) => date < new Date()}
                                  initialFocus
                                  className="rounded-lg bg-gray-800 text-white shadow-md p-2"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Hora */}
                      <FormField
                        control={form.control}
                        name="hora"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-white font-medium">
                              Hora *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                className="bg-white/5 border-gray-600 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Área de la Planta */}
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white font-medium">
                            Área de la Planta *
                          </FormLabel>
                          <Popover open={openArea} onOpenChange={setOpenArea}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openArea}
                                  className="w-full justify-between bg-white/5 border-gray-600 text-white hover:bg-white/10"
                                >
                                  {field.value || "Seleccionar área..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
                              <Command>
                                <CommandInput
                                  placeholder="Buscar área..."
                                  className="text-black"
                                />
                                <CommandList>
                                  <CommandEmpty className="text-gray-400">
                                    No se encontró el área.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {areas.map((area) => (
                                      <CommandItem
                                        key={area}
                                        value={area}
                                        onSelect={() => {
                                          field.onChange(area);
                                          setOpenArea(false);
                                        }}
                                        className="text-gray bg-white/20 hover:bg-gray-700"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === area
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {area}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Descripción */}
                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white font-medium">
                            Descripción de la No Conformidad *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describa detalladamente la no conformidad observada..."
                              className="bg-white/5 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Carga de Archivos */}
                    <div className="space-y-4">
                      <Label className="text-white font-medium">
                        Archivos Adjuntos
                      </Label>

                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 bg-white/5">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <div className="flex flex-col items-center">
                            <Label
                              htmlFor="file-upload"
                              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              Seleccionar Archivos
                            </Label>
                            <Input
                              id="file-upload"
                              type="file"
                              {...form.register("Archivo")}
                              multiple
                              accept="image/*,.pdf,.doc,.docx,.txt"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <p className="text-gray-400 text-sm mt-2">
                              Imágenes (JPG, PNG, GIF) y documentos (PDF, DOC,
                              TXT)
                            </p>
                            <p className="text-gray-500 text-xs">
                              Máximo 10MB por archivo
                            </p>
                          </div>
                        </div>
                        {form.formState.errors.Archivo?.message && (
                          <p className="text-red-400">
                            {form.formState.errors.Archivo?.message}
                          </p>
                        )}
                      </div>

                      {/* Lista de archivos seleccionados */}
                      {archivos.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-white font-medium text-sm">
                            Archivos seleccionados ({archivos.length})
                          </Label>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {archivos.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-gray-600"
                              >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  {getFileIcon(file)}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {formatFileSize(file.size)}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Vista previa de imágenes */}
                      {archivos.some((file) =>
                        file.type.startsWith("image/")
                      ) && (
                        <div className="space-y-2">
                          <Label className="text-white font-medium text-sm">
                            Vista previa de imágenes
                          </Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {archivos
                              .filter((file) => file.type.startsWith("image/"))
                              .map((file, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={
                                      URL.createObjectURL(file) ||
                                      "/placeholder.svg"
                                    }
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-lg border border-gray-600"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeFile(archivos.indexOf(file))
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Checkbox Observación de Seguridad */}
                    <FormField
                      control={form.control}
                      name="esObservacionSeguridad"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                            />
                          </FormControl>
                          <FormLabel className="text-yellow-200 font-medium cursor-pointer">
                            Esta es una observación de seguridad
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {/* Campos de Riesgo (condicionales y obligatorios) */}
                    {watchEsObservacionSeguridad && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <FormField
                          control={form.control}
                          name="tipoRiesgo"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-red-200 font-medium">
                                Tipo de Riesgo *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white/5 border-red-500/50 text-white">
                                    <SelectValue placeholder="Seleccionar tipo..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  {tiposRiesgo.map((tipo) => (
                                    <SelectItem
                                      key={tipo}
                                      value={tipo}
                                      className="text-white hover:bg-gray-700"
                                    >
                                      {tipo}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="nivelRiesgo"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-red-200 font-medium">
                                Nivel de Riesgo *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white/5 border-red-500/50 text-white">
                                    <SelectValue placeholder="Seleccionar nivel..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  {nivelesRiesgo.map((nivel) => (
                                    <SelectItem
                                      key={nivel}
                                      value={nivel}
                                      className="text-white hover:bg-gray-700"
                                    >
                                      {nivel}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-white/5 border-gray-600 text-white hover:bg-white/10"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Enviar Reporte
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    </ProtectedRouteComponentemail>
  );
};

export default function page() {
  return (
    <>
      <FormInspecciones />
    </>
  );
}
