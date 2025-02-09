"use client";
import { cn } from "@/lib/utils";
import { Card, CardHeader } from "@nextui-org/card";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandEmpty,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  ChevronsUpDown,
  Check,
  CalendarIcon,
  PaperclipIcon,
  XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import axios from "axios";
import {ProtectedRouteComponentemail} from "@/components/protected-route-email"

const evaluationschema = z
  .object({
    DescripcionBreve: z
      .string()
      .min(5, {
        message: "Mínimo 5 caracteres",
      })
      .max(40, {
        message: "Máximo 40 caracteres",
      }),
    DescripcionDetallada: z
      .string({
        message: "Campo obligatorio",
      })
      .min(10, {
        message: "Mínimo 10 caracteres",
      }),
    TipoAviso: z.string().min(1, { message: "Campo obligatorio" }),
    TipoPlanta: z.string().min(1, { message: "Campo obligatorio" }),
    Equipo: z.string().min(1, { message: "Campo obligatorio" }),
    Prioridad: z.string().min(1, { message: "Campo obligatorio" }),
    PuestoTrabajo: z.string().min(1, { message: "Campo obligatorio" }),

    FechaRequerida: z.date({
      message: "Campo obligatorio",
    }),
    // TiempoEjecucion: z.string().regex(/^\d+$/, {
    //   message: "debe ingresar un número",
    // }),

    TiempoEjecucion: z
      .string()
      .regex(/^[0-9]{1,2}$/, {
        message: "Debe ingresar un número entre 0 y 99",
      })
      .transform(Number)
      .refine((num) => num >= 0 && num <= 99, {
        message: "El número debe estar entre 0 y 99",
      }),

    ToggleAndamios: z.boolean().default(false),
    ToggleCamionGrua: z.boolean().default(false),
    ToggleTelescopica: z.boolean().default(false),
    ToggleServicioEspecializado: z.boolean().default(false),

    CantidadAndamios: z
      .string()
      .regex(/^\d+$/, {
        message: "debe ingresar un número",
      })
      .optional(),
    CantidadCamionGrua: z
      .string()
      .regex(/^\d+$/, {
        message: "debe ingresar un número",
      })
      .optional(),
    CantidadTelescopica: z
      .string()
      .regex(/^\d+$/, {
        message: "debe ingresar un número",
      })
      .optional(),
    ServicioEspecializado: z.string().optional(),

    ToggleParadaEquipo: z.boolean().default(false),
    ToggleParadaNoAplica: z.boolean().default(false),
    ToggleParadaProceso: z.boolean().default(false),
    ToggleParadaPlanta: z.boolean().default(false),

    LaborMecanicos: z.string().regex(/^\d+$/, {}).optional(),
    LaborSoldadores: z.string().regex(/^\d+$/, {}).optional(),
    LaborElectricistas: z.string().regex(/^\d+$/, {}).optional(),
    LaborInstrumentistas: z.string().regex(/^\d+$/, {}).optional(),
    LaborVigias: z.string().regex(/^\d+$/, {}).optional(),

    ToggleMateriales: z.boolean().default(false),
    ArrayMateriales: z
      .array(
        z.object({
          codSAP: z.string().optional(),
          noParte: z.string().optional(),
          descripcion: z.string().optional(),
          cantidad: z.string().optional(),
          um: z.string().optional(),
          caracteristicas: z.string().optional(),
        })
      )
      .optional()
      .default([]),

    // Archivo: z.array(z.instanceof(File)).refine((files) => files.length > 0, {
    //   message: "Debes seleccionar al menos un archivo.",
    // }),
    Archivo: z.array(
      z.any().refine((file) => file instanceof File, {
        message: "Debes seleccionar al menos un archivo.",
      })
    ),
  })
  .refine(
    (data) => {
      if (data.ToggleAndamios) {
        return data.CantidadAndamios !== "" && data.CantidadAndamios !== "0";
      }
      return true;
    },
    {
      message: "Campo obligatorio",
      path: ["CantidadAndamios"],
    }
  )
  .refine(
    (data) => {
      if (data.ToggleTelescopica) {
        return (
          data.CantidadTelescopica !== "" && data.CantidadTelescopica !== "0"
        );
      }
      return true;
    },
    {
      message: "Campo obligatorio",
      path: ["CantidadTelescopica"],
    }
  )
  .refine(
    (data) => {
      if (data.ToggleCamionGrua) {
        return (
          data.CantidadCamionGrua !== "" && data.CantidadCamionGrua !== "0"
        );
      }
      return true;
    },
    {
      message: "Campo obligatorio",
      path: ["CantidadCamionGrua"],
    }
  )
  .refine(
    (data) => {
      if (data.ToggleServicioEspecializado) {
        return (
          data.ServicioEspecializado && data.ServicioEspecializado.length >= 5
        );
      }
      return true;
    },
    {
      message: "Debe agregar una descripción de al menos 5 caracteres",
      path: ["ServicioEspecializado"],
    }
  )
  .refine(
    (data) => {
      if (
        !data.ToggleParadaEquipo &&
        !data.ToggleParadaNoAplica &&
        !data.ToggleParadaProceso &&
        !data.ToggleParadaPlanta
      ) {
        return false;
      }
      return true;
    },
    {
      message: "debe agregar una descripción",
      path: ["Paradas"],
    }
  )
  .refine(
    (data) => {
      if (
        parseFloat(data.LaborMecanicos ?? "0") +
          parseFloat(data.LaborSoldadores ?? "0") +
          parseFloat(data.LaborElectricistas ?? "0") +
          parseFloat(data.LaborInstrumentistas ?? "0") +
          parseFloat(data.LaborVigias ?? "0") ===
        0
      ) {
        return false;
      }
      return true;
    },
    {
      message: "debe agregar al menos un recurso",
      path: ["Recursos"],
    }
  )
  .refine(
    (data) => {
      if (data.ToggleMateriales) {
        return data.ArrayMateriales?.length > 0;
      } else {
        return true;
      }
    },
    {
      message: "debe agregar al menos un material",
      path: ["Materiales"],
    }
  )
  .refine(
    (files) => {
      return Array.from(files.Archivo).every(
        (file) => file.size <= 5 * 1024 * 1024
      ); // 5MB
    },
    {
      message: "El archivo no debe superar los 5MB.",
    }
  );

const TipoAviso = [
  { label: "Correctivo", value: "Correctivo - Z2" },
  // { label: "Mejora", value: "Mejora - Z7" },
  { label: "Mejora", value: "Mejora - Z4" },
];

const TipoPlanta = [
  "Sulfuros",
  "Oxidos",
  "Infraestructura",
  "Puerto",
  "Potencia",
];

const TipoPrioridad = ["Emergencia", "Alta", "Media", "Baja", "Muy Baja"];

const toggleFields = [
  { name: "ToggleParadaEquipo", label: "Requiere Parada de Equipo?" },
  {
    name: "ToggleParadaNoAplica",
    label: "Se ejecuta con equipo en funcionamiento?",
  },
  { name: "ToggleParadaProceso", label: "Requiere parar el proceso?" },
  { name: "ToggleParadaPlanta", label: "Requiere Parada de Planta?" },
] as const;

const TipoPuestoTrabajo = [
  { label: "Mecánico", value: "TEC-MEC" },
  { label: "Electricidad", value: "TEC-ELE" },
  { label: "Instrumentación", value: "TEC-INS" },
  { label: "Soldadura", value: "TEC-MEC1" },
  { label: "Termofusión", value: "TEC-TERM" },
  { label: "Predictivo Electrcidad", value: "TEC-PRED" },
  { label: "Predictivo Mecánico", value: "TEC-MEC2" },
] as const;

type EvaluationSchema = z.infer<typeof evaluationschema>;

interface FormData {
  codSAP: string;
  noParte: string;
  descripcion: string;
  cantidad: string;
  um: string;
  caracteristicas: string;
}

interface EquiposData {
  // _id: string,
  // Planta: string,
  // Area: string,
  TAG: string;
  // DescripcionEquipo: string,
  // deleted: boolean,
  // createdAt: string,
  // updatedAt: string,
  // __v: 0
}

export default function page() {
  const form = useForm<EvaluationSchema>({
    resolver: zodResolver(evaluationschema),
    defaultValues: {
      DescripcionBreve: "",
      DescripcionDetallada: "",
      TipoAviso: "",
      TipoPlanta: "",
      Equipo: "",
      Prioridad: "",
      PuestoTrabajo: "",

      FechaRequerida: new Date(),
      TiempoEjecucion: 0,

      ToggleAndamios: false,
      CantidadAndamios: "0",
      ToggleTelescopica: false,
      CantidadTelescopica: "0",
      ToggleCamionGrua: false,
      CantidadCamionGrua: "0",
      ToggleServicioEspecializado: false,
      ServicioEspecializado: "",

      ToggleParadaEquipo: false,
      ToggleParadaNoAplica: false,
      ToggleParadaProceso: false,
      ToggleParadaPlanta: false,

      LaborMecanicos: "0",
      LaborSoldadores: "0",
      LaborElectricistas: "0",
      LaborInstrumentistas: "0",
      LaborVigias: "0",

      ToggleMateriales: false,
      ArrayMateriales: [],

      Archivo: [],
    },
  });

  const [formData, setFormData] = useState<FormData>({
    codSAP: "",
    noParte: "",
    descripcion: "",
    cantidad: "",
    um: "",
    caracteristicas: "",
  });

  const [fileNames, setFileNames] = useState<File[]>([]);

  const [tableData, setTableData] = useState<FormData[]>([]);

  const [tableEquipos, setTableEquipos] = useState<EquiposData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/getdataequiposplanta`
        );
        console.log(response.data);
        setTableEquipos(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, um: value }));
  };

  const handleAddToTable = () => {
    if (
      !formData.descripcion.trim() ||
      !formData.cantidad.trim() ||
      !formData.um.trim()
    )
      return;

    const newTableData = [...tableData, formData];
    setTableData(newTableData);
    form.setValue("ArrayMateriales", newTableData);

    setFormData({
      codSAP: "",
      noParte: "",
      descripcion: "",
      cantidad: "",
      um: "",
      caracteristicas: "",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      setFileNames((prev) => [...prev, ...fileArray]);

      // Actualizar el valor en react-hook-form
      form.setValue("Archivo", fileArray); // Actualiza el valor del campo "Archivo" en el formulario
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFileNames((prev) => prev.filter((file) => file.name !== fileName));

    const updatedFiles = form
      .getValues("Archivo")
      .filter((file: File) => file.name !== fileName);
    form.setValue("Archivo", updatedFiles);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const typedKey = key as keyof EvaluationSchema;
        const value = values[typedKey];
        if (key !== "Archivo" && value !== undefined) {
          if (Array.isArray(value)) {
            // value.forEach((item) => formData.append(key, item.toString()));
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

      if (values.Archivo && values.Archivo.length > 0) {
        values.Archivo.forEach((file: File) => {
          formData.append("file", file);
        });
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/uploadimagebacklog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Formulario enviado");
        alert("Formulario Enviado");
      }
    } catch (error) {}
  });

  return (
    <ProtectedRouteComponentemail>
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center">
        <Card className="w-11/12 md:w-2/3 lg:w-1/2 space-y-6 bg-gray-800 rounded-2xl p-10 shadow-2xl mt-10 mb-10 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-100 text-2xl font-semibold tracking-wide">
              GENERACIÓN DE PRE-AVISOS
            </CardTitle>
          </CardHeader>

          <Form {...form}>
            <form className="space-y-4" onSubmit={onSubmit}>
              {/* Datos básicos */}
              <div className="border-2 border-gray-600 rounded-2xl p-4 gap-8 space-y-4">
                {/* Descripcion Breve */}
                <FormField
                  control={form.control}
                  name="DescripcionBreve"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Descripción Breve (Max. 40 caracteres)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border-2 w-48 border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                        />
                      </FormControl>
                      {form.formState.errors.DescripcionBreve?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.DescripcionBreve?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Descripcion Detallada */}
                <FormField
                  control={form.control}
                  name="DescripcionDetallada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Descripción Detallada
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="border-2 w-full h-24 border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                        />
                      </FormControl>
                      {form.formState.errors.DescripcionDetallada?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.DescripcionDetallada?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Tipo Aviso */}
                <FormField
                  control={form.control}
                  name="TipoAviso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Tipo Aviso
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-2 w-48 border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200 shadow-md">
                            <SelectValue placeholder="Selecciona tipo aviso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 text-gray-300 border border-gray-600 rounded-2xl shadow-lg">
                          {TipoAviso.map((tipo) => (
                            <SelectItem
                              key={tipo.label}
                              value={tipo.label}
                              className="hover:bg-gray-700 hover:text-white transition-all duration-150 px-4 py-2 rounded-lg"
                            >
                              {tipo.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.TipoAviso?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.TipoAviso?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Tipo Planta */}
                <FormField
                  control={form.control}
                  name="TipoPlanta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Planta
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-2 w-48 border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200 shadow-md">
                            <SelectValue placeholder="Selecciona la Planta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 text-gray-300 border border-gray-600 rounded-2xl shadow-lg">
                          {TipoPlanta.map((tipo) => (
                            <SelectItem
                              key={tipo}
                              value={tipo}
                              className="hover:bg-gray-700 hover:text-white transition-all duration-150 px-4 py-2 rounded-lg"
                            >
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.TipoAviso?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.TipoPlanta?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Equipo */}
                <FormField
                  control={form.control}
                  name="Equipo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Equipo
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[220px] justify-between w-48 border-2 border-gray-600 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200 shadow-md hover:bg-gray-600 focus:ring-2 focus:ring-blue-400",
                                !field.value && "text-gray-400"
                              )}
                            >
                              {field.value
                                ? tableEquipos.find(
                                    (equipo) => equipo.TAG === field.value
                                  )?.TAG
                                : "Selecciona un equipo"}
                              <ChevronsUpDown className="opacity-50 ml-2" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-0 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg">
                          <Command className="p-1">
                            <CommandInput
                              placeholder="Buscar equipo..."
                              className="h-10 px-3 bg-white-700 text-black border border-gray-600  focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <CommandList>
                              <CommandEmpty className="text-gray-400 text-center py-2">
                                No se encontraron equipos.
                              </CommandEmpty>
                              <CommandGroup>
                                {tableEquipos.map((equipo) => (
                                  <CommandItem
                                    value={equipo.TAG}
                                    key={equipo.TAG}
                                    onSelect={() => {
                                      form.setValue("Equipo", equipo.TAG);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-700 hover:text-white transition-all duration-150 rounded-lg flex items-center cursor-pointer"
                                  >
                                    {equipo.TAG}
                                    <Check
                                      className={cn(
                                        "ml-auto text-blue-400 transition-all",
                                        equipo.TAG === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.TipoAviso?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.Equipo?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Prioridad */}
                <FormField
                  control={form.control}
                  name="Prioridad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Prioridad
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-2 w-48 border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200 shadow-md">
                            <SelectValue placeholder="Selecciona la Prioridad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 text-gray-300 border border-gray-600 rounded-2xl shadow-lg">
                          {TipoPrioridad.map((tipo) => (
                            <SelectItem
                              key={tipo}
                              value={tipo}
                              className="hover:bg-gray-700 hover:text-white transition-all duration-150 px-4 py-2 rounded-lg"
                            >
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.TipoAviso?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.Prioridad?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Puesto trabajo */}
                <FormField
                  control={form.control}
                  name="PuestoTrabajo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Puesto Trabajo
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-2 w-48 border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200 shadow-md">
                            <SelectValue placeholder="Selecciona Puesto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 text-gray-300 border border-gray-600 rounded-2xl shadow-lg">
                          {TipoPuestoTrabajo.map((tipo) => (
                            <SelectItem
                              key={tipo.value}
                              value={tipo.value}
                              className="hover:bg-gray-700 hover:text-white transition-all duration-150 px-4 py-2 rounded-lg"
                            >
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.TipoAviso?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.Prioridad?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Listado avisos */}
              <div className="border-2 border-gray-600 rounded-2xl p-4 text-white">
                <h1>Listado de los útlimos 5 avisos de ese equipo</h1>
              </div>

              {/* Fecha y tiempo */}
              <div className="border-2 border-gray-600 rounded-2xl p-4 text-white space-y-4">
                {/* Fecha Requerida */}
                <FormField
                  control={form.control}
                  name="FechaRequerida"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Fecha Requerida
                      </FormLabel>
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
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="rounded-lg bg-gray-800 text-white shadow-md p-2"
                          />
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.FechaRequerida?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.FechaRequerida?.message}
                        </p>
                      )}
                      {/* <FormMessage className="text-red-400 text-sm mt-1" /> */}
                    </FormItem>
                  )}
                />

                {/* Tiempo Ejecución */}
                <FormField
                  control={form.control}
                  name="TiempoEjecucion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Tiempo estimado de ejecución (Horas)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="off"
                          // onInput={(e) => {
                          //   e.currentTarget.value = e.currentTarget.value.replace(
                          //     /[^0-9]/g,
                          //     ""
                          //   );
                          // }}
                          onChange={(e) => {
                            let value = e.currentTarget.value.replace(
                              /[^0-9]/g,
                              ""
                            );

                            if (value.length > 2) {
                              value = value.slice(0, 2);
                            }

                            const numValue = parseInt(value);
                            if (numValue > 99) {
                              value = "99";
                            }

                            field.onChange(value);
                          }}
                          className="border-2 w-24 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                        />
                      </FormControl>
                      {form.formState.errors.TiempoEjecucion?.message && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.TiempoEjecucion?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Recursos No Labor */}
              <div className="border-2 border-gray-600 rounded-2xl p-4 text-white space-y-2">
                <h1>Recursos No Labor</h1>

                {/* Andamios */}
                <div className="border-2 border-white p-4 rounded-2xl">
                  <FormField
                    control={form.control}
                    name="ToggleAndamios"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Requiere Andamios?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("ToggleAndamios") && (
                    <FormField
                      control={form.control}
                      name="CantidadAndamios"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                          <FormLabel className="text-gray-300 text-sm font-medium">
                            Cantidad Cuerpo de andamios
                            {form.formState.errors.CantidadAndamios
                              ?.message && (
                              <p className="text-sm text-red-600">
                                {
                                  form.formState.errors.CantidadAndamios
                                    ?.message
                                }
                              </p>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoComplete="off"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.replace(/[^0-9]/g, "");
                              }}
                              className="border-2 w-16 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Grúa Telescopica */}
                <div className="border-2 border-white p-4 rounded-2xl">
                  <FormField
                    control={form.control}
                    name="ToggleTelescopica"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Requiere Grúa Telescópica?</FormLabel>
                          {/* <FormDescription>
                          Receive emails about new products, features, and more.
                        </FormDescription> */}
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("ToggleTelescopica") && (
                    <FormField
                      control={form.control}
                      name="CantidadTelescopica"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                          <FormLabel className="text-gray-300 text-sm font-medium">
                            Cantidad de Grúas
                            {form.formState.errors.CantidadTelescopica
                              ?.message && (
                              <p className="text-sm text-red-600">
                                {
                                  form.formState.errors.CantidadTelescopica
                                    ?.message
                                }
                              </p>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoComplete="off"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.replace(/[^0-9]/g, "");
                              }}
                              className="border-2 w-16 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Camion Grúa */}
                <div className="border-2 border-white p-4 rounded-2xl">
                  <FormField
                    control={form.control}
                    name="ToggleCamionGrua"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Requiere Camión Grúa?</FormLabel>
                          {/* <FormDescription>
                          Receive emails about new products, features, and more.
                        </FormDescription> */}
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("ToggleCamionGrua") && (
                    <FormField
                      control={form.control}
                      name="CantidadCamionGrua"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                          <FormLabel className="text-gray-300 text-sm font-medium">
                            Cantidad Camiones Grúa
                            {form.formState.errors.CantidadCamionGrua
                              ?.message && (
                              <p className="text-sm text-red-600">
                                {
                                  form.formState.errors.CantidadCamionGrua
                                    ?.message
                                }
                              </p>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoComplete="off"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.replace(/[^0-9]/g, "");
                              }}
                              className="border-2 w-16 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Parada de Planta */}
                <div className="border-2 border-white p-4 rounded-2xl">
                  {toggleFields.map(({ name, label }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>{label}</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(value) => {
                                form.setValue("ToggleParadaEquipo", false);
                                form.setValue("ToggleParadaNoAplica", false);
                                form.setValue("ToggleParadaProceso", false);
                                form.setValue("ToggleParadaPlanta", false);
                                form.setValue(name, value);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                  {!form.watch("ToggleParadaEquipo") &&
                    !form.watch("ToggleParadaNoAplica") &&
                    !form.watch("ToggleParadaProceso") &&
                    !form.watch("ToggleParadaPlanta") && (
                      <p className="text-sm text-red-600">
                        Debe seleccionar un tipo de parada
                      </p>
                    )}
                </div>

                {/* Servicios especializados */}
                <div className="border-2 border-white p-4 rounded-2xl">
                  <FormField
                    control={form.control}
                    name="ToggleServicioEspecializado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>
                            Requiere Servicio especializado?
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("ToggleServicioEspecializado") && (
                    <FormField
                      control={form.control}
                      name="ServicioEspecializado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm font-medium">
                            Describa servicio especializado
                            {form.formState.errors.ServicioEspecializado
                              ?.message && (
                              <p className="text-sm text-red-600">
                                {
                                  form.formState.errors.ServicioEspecializado
                                    ?.message
                                }
                              </p>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="border-2 border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Recursos Labor */}
              <div className="border-2 border-gray-600 rounded-2xl p-4 text-white space-y-2">
                <h1>Recursos Labor (ingresar cantidad)</h1>

                {parseFloat(form.watch("LaborMecanicos") ?? "0") +
                  parseFloat(form.watch("LaborSoldadores") ?? "0") +
                  parseFloat(form.watch("LaborElectricistas") ?? "0") +
                  parseFloat(form.watch("LaborInstrumentistas") ?? "0") +
                  parseFloat(form.watch("LaborVigias") ?? "0") ===
                  0 && (
                  <p className="text-sm text-red-600">
                    Debe agregar por lo menos un recurso
                  </p>
                )}

                <FormField
                  control={form.control}
                  name="LaborMecanicos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm w-60">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Cantidad Mecánicos
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border-2 w-16 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LaborSoldadores"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm w-60">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Cantidad Soldadores
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border-2 w-16 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LaborElectricistas"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm w-60">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Cantidad Electricistas
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border-2 w-16 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LaborInstrumentistas"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm w-60">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Cantidad Instrumentistas
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border-2 w-16 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LaborVigias"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm w-60">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Cantidad Vigias
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border-2 w-16 text-center border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 bg-gray-700 text-white rounded-2xl px-4 py-2 transition-all duration-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Materiales */}
              <div className="border-2 border-gray-600 rounded-2xl p-4 text-white space-y-2">
                <h1>Materiales</h1>

                <div>
                  <FormField
                    control={form.control}
                    name="ToggleMateriales"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Requiere Materiales?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("ToggleMateriales") && (
                  <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Cod. SAP</Label>
                        <Input
                          name="codSAP"
                          value={formData.codSAP}
                          onChange={handleChange}
                          className="bg-gray-700 border border-gray-600 text-white rounded-2xl"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300">N° de parte</Label>
                        <Input
                          name="noParte"
                          value={formData.noParte}
                          onChange={handleChange}
                          className="bg-gray-700 border border-gray-600 text-white rounded-2xl"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label className="text-gray-300">Descripción *</Label>
                        <Input
                          name="descripcion"
                          value={formData.descripcion}
                          onChange={handleChange}
                          className="bg-gray-700 border border-gray-600 text-white rounded-2xl"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300">Cantidad *</Label>
                        <Input
                          name="cantidad"
                          value={formData.cantidad}
                          onChange={handleChange}
                          type="number"
                          className="bg-gray-700 border border-gray-600 text-white rounded-2xl"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300">UM *</Label>
                        <Select
                          value={formData.um}
                          onValueChange={handleSelectChange}
                        >
                          <SelectTrigger className="w-full bg-gray-700 border border-gray-600 text-white rounded-2xl">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            <SelectGroup>
                              <SelectLabel>Unidades</SelectLabel>
                              <SelectItem value="m">Metros (m)</SelectItem>
                              <SelectItem value="kg">Kilogramo (kg)</SelectItem>
                              <SelectItem value="l">Litro (L)</SelectItem>
                              <SelectItem value="gal">Galón (gal)</SelectItem>
                              <SelectItem value="pz">Pieza (Pz)</SelectItem>
                              <SelectItem value="und">Unidad (Und)</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-2">
                        <Label className="text-gray-300">
                          Características adicionales
                        </Label>
                        <Input
                          name="caracteristicas"
                          value={formData.caracteristicas}
                          onChange={handleChange}
                          className="bg-gray-700 border border-gray-600 text-white rounded-2xl"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleAddToTable}
                      disabled={
                        !formData.descripcion.trim() ||
                        !formData.cantidad.trim() ||
                        !formData.um.trim()
                      }
                      className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-2xl transition-all disabled:opacity-50"
                    >
                      Agregar a la Tabla
                    </Button>

                    {/* Tabla de Datos */}
                    <div className="mt-6 overflow-x-auto">
                      {tableData.length === 0 ? (
                        <p className="text-red-500">
                          No se han agregado materiales a la tabla
                        </p>
                      ) : (
                        <table className=" border border-gray-700 rounded-lg shadow-md">
                          <thead>
                            <tr className="bg-gray-700 text-white">
                              <th className="p-2 border border-gray-600">
                                Cod. SAP
                              </th>
                              <th className="p-2 border border-gray-600">
                                N° Parte
                              </th>
                              <th className="p-2 border border-gray-600">
                                Descripción
                              </th>
                              <th className="p-2 border border-gray-600">
                                Cantidad
                              </th>
                              <th className="p-2 border border-gray-600">UM</th>
                              <th className="p-2 border border-gray-600">
                                Características
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((item, index) => (
                              <tr
                                key={index}
                                className="bg-gray-800 text-white hover:bg-gray-700"
                              >
                                <td className="p-2 border border-gray-600">
                                  {item.codSAP}
                                </td>
                                <td className="p-2 border border-gray-600">
                                  {item.noParte}
                                </td>
                                <td className="p-2 border border-gray-600">
                                  {item.descripcion}
                                </td>
                                <td className="p-2 border border-gray-600">
                                  {item.cantidad}
                                </td>
                                <td className="p-2 border border-gray-600">
                                  {item.um}
                                </td>
                                <td className="p-2 border border-gray-600">
                                  {item.caracteristicas}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cargar Archivos */}
              <div className="border-2 border-gray-600 rounded-2xl p-4 text-white space-y-2">
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                  <div>
                    <Label className="text-gray-300">
                      Cargar Archivos (fotos o documentos)
                    </Label>
                    <div className="mt-4 flex flex-col items-center">
                      <Input
                        type="file"
                        {...form.register("Archivo")}
                        onChange={handleFileChange}
                        className="bg-gray-700 text-white border border-gray-600 rounded-2xl py-3 px-4 w-full text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        multiple
                        style={{ display: "none" }}
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer w-full text-center bg-gray-900 hover:bg-gray-700 transition-all rounded-xl p-4"
                      >
                        <PaperclipIcon className="w-5 h-5 inline-block mr-2" />{" "}
                        Seleccionar archivo(s)
                      </label>

                      {fileNames.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <ul className="max-h-32 overflow-y-auto space-y-1">
                            {fileNames.map((file, index) => (
                              <li
                                key={index}
                                className="flex justify-between items-center bg-gray-700 text-sm text-gray-300 p-2 rounded-lg"
                              >
                                <span className="truncate">{file.name}</span>
                                <XCircleIcon
                                  onClick={() => handleRemoveFile(file.name)}
                                  className="w-5 h-5 text-red-500 cursor-pointer ml-2"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {form.formState.errors.Archivo?.message && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.Archivo?.message}
                  </p>
                )}
              </div>

              <Button className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-2xl transition-all disabled:opacity-50">
                Enviar
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </ProtectedRouteComponentemail>
  );
}
