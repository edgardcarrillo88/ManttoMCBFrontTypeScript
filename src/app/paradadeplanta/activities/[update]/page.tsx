"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { object, z } from "zod";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TimePickerDemo } from "@/components/ui/time-picker-demo";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Spinner } from "@nextui-org/spinner";
import { signIn, useSession, signOut } from "next-auth/react";

import { ProtectedRouteComponentemail } from "@/components/protected-route-email";

const NoLaborSchema = z.object({
  Andamios: z.boolean(),
  CamionGrua: z.boolean(),
  Telescopica: z.boolean(),
});

const LaborSchema = z.object({
  Mecanicos: z.number(),
  Soldadores: z.number(),
  Vigias: z.number(),
  Electricista: z.number(),
  Instrumentista: z.number(),
});

const FormSchema = z
  .discriminatedUnion("ActividadCancelada", [
    // Schema for when activity is cancelled
    z.object({
      ActividadCancelada: z.literal("Si"),
      comentarios: z
        .string()
        .min(2, {
          message: "Debes escribir por lo menos 2 caracteres.",
        })
        .trim(),
      NoLabor: NoLaborSchema,
      Labor: LaborSchema,
      inicioreal: z.date().optional(),
      finreal: z.date().optional(),
      avance: z.number().min(0).max(100, {
        message: "El avance debe ser un número entre 0 y 100.",
      }),
    }),
    // Schema for when activity is not cancelled
    z.object({
      ActividadCancelada: z.literal("No"),
      comentarios: z
        .string()
        .min(2, {
          message: "Debes escribir por lo menos 2 caracteres.",
        })
        .trim(),
      NoLabor: NoLaborSchema,
      Labor: LaborSchema.refine(
        (data) => {
          return Object.values(data).reduce((acc, curr) => acc + curr, 0) > 0;
        },
        { message: "Debes asignar al menos un recurso laboral." }
      ),
      inicioreal: z.date(),
      finreal: z.date().optional(),
      avance: z.number().min(0).max(100, {
        message: "El avance debe ser un número entre 0 y 100.",
      }),
    }),
  ])
  .refine(
    (data) => {
      if (data.ActividadCancelada === "No" && data.finreal) {
        return data.avance === 100;
      }
      return true;
    },
    {
      message: "Si tiene fecha fin el avance debe ser 100",
      path: ["avance"],
    }
  )
  .refine(
    (data) => {
      if (data.ActividadCancelada === "No" && data.finreal) {
        return data.finreal > data.inicioreal;
      }
      return true;
    },
    {
      message: "la fecha fin debe ser mayor a la fecha inicio",
      path: ["finreal"],
    }
  )
  .refine(
    (data) => {
      if (
        data.ActividadCancelada === "No" &&
        data.avance === 100 &&
        !data.finreal
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Si el avance es 100 debe tener fecha fin",
      path: ["finreal"],
    }
  )
  .refine(
    (data) => {
      if (data.ActividadCancelada === "No" && data.inicioreal) {
        return data.avance > 0;
      }
      return true;
    },
    {
      message: "Si tiene fecha inicio el avance debe ser mayor a 0",
      path: ["avance"],
    }
  );

type TypeResponse = {
  ActividadCancelada: string;
  Labor?: {
    Mecanicos: number;
    Soldadores: number;
    Vigias: number;
    Electricista: number;
    Instrumentista: number;
  };
  NoLabor?: {
    Andamios: boolean;
    CamionGrua: boolean;
    Telescopica: boolean;
  };
  TAG?: string;
  WBS: string;
  area: string;
  avance?: number;
  comentarios?: string;
  contratista: string;
  descripcion: string;
  especialidad?: string;
  estado: string;

  finplan: string;
  inicioplan: string;
  finreal?: Date;
  inicioreal?: Date;
  OT?: string;

  hh: number;
  idtask: number;
  id: number;
  responsable: string;
  nivel: number;

  updatedAt: string;
  __v: number;
  _id: string;
  deleted: boolean;
};

export default function InputForm(params: any) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoader, setModalLoader] = useState(true);

  const [activity, setActivity] = useState<TypeResponse>({
    ActividadCancelada: "",
    Labor: {
      Mecanicos: 0,
      Soldadores: 0,
      Vigias: 0,
      Electricista: 0,
      Instrumentista: 0,
    },
    NoLabor: {
      Andamios: false,
      CamionGrua: false,
      Telescopica: false,
    },
    TAG: "",
    WBS: "",
    area: "",
    avance: 0,
    comentarios: "",
    contratista: "",
    descripcion: "",
    especialidad: "",
    estado: "",
    finplan: "",
    inicioplan: "",
    finreal: undefined,
    inicioreal: undefined,
    OT: "",
    hh: 0,
    id: 0,
    idtask: 0,
    responsable: "",
    nivel: 0,
    updatedAt: "",
    __v: 0,
    _id: "",
    deleted: false,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comentarios: "",
      ActividadCancelada: "No",
      inicioreal: undefined,
      NoLabor: {
        Andamios: false,
        CamionGrua: false,
        Telescopica: false,
      },
      Labor: {
        Mecanicos: 0,
        Soldadores: 0,
        Vigias: 0,
        Electricista: 0,
        Instrumentista: 0,
      },
      avance: 0,
    },
  });

  const formNoLabor = useForm<z.infer<typeof NoLaborSchema>>({
    resolver: zodResolver(NoLaborSchema),
    defaultValues: {
      Andamios: false,
      CamionGrua: false,
      Telescopica: false,
    },
  });

  const formLabor = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Mecanicos: 0,
      Soldadores: 0,
      Vigias: 0,
      Electricista: 0,
      Instrumentista: 0,
    },
  });

  useEffect(() => {
    const fectchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/filtereddata`,
        { params: { id: params.params.update } }
      );
      console.log(response.data);
      const convertedData = {
        ...response.data,
        inicioreal: response.data.inicioreal
          ? new Date(response.data.inicioreal)
          : undefined,
        finreal: response.data.finreal
          ? new Date(response.data.finreal)
          : undefined,
      };

      setActivity(convertedData);

      form.reset({
        comentarios: "",
        ActividadCancelada: convertedData.ActividadCancelada || "No",
        inicioreal: convertedData.inicioreal || undefined,
        finreal: convertedData.finreal || undefined,
        NoLabor: {
          Andamios: convertedData.NoLabor?.Andamios || false,
          CamionGrua: convertedData.NoLabor?.CamionGrua || false,
          Telescopica: convertedData.NoLabor?.Telescopica || false,
        },
        Labor: {
          Mecanicos: convertedData.Labor?.Mecanicos || 0,
          Soldadores: convertedData.Labor?.Soldadores || 0,
          Vigias: convertedData.Labor?.Vigias || 0,
          Electricista: convertedData.Labor?.Electricista || 0,
          Instrumentista: convertedData.Labor?.Instrumentista || 0,
        },
        avance: convertedData.avance || 0,
      });
    };
    fectchData();
  }, []);

  const handleCheckedChange = (
    key: keyof TypeResponse["NoLabor"],
    checked: boolean
  ) => {
    console.log(form.formState.errors);
    console.log("Valores actuales del formulario: ", form.watch());

    setActivity((prev) => ({
      ...prev!,
      NoLabor: {
        ...(prev?.NoLabor || {
          Andamios: false,
          CamionGrua: false,
          Telescopica: false,
        }),
        [key]: checked,
      },
    }));
    form.setValue(
      `NoLabor.${key}` as `NoLabor.${keyof TypeResponse["NoLabor"]}`,
      checked as never
    );
  };

  const handleChange = (key: keyof TypeResponse["Labor"], value: number) => {
    console.log(form.formState.errors);
    console.log("Valores actuales del formulario: ", form.watch());

    setActivity((prev) => ({
      ...prev!,
      Labor: {
        ...(prev?.Labor || {
          Mecanicos: 0,
          Soldadores: 0,
          Vigias: 0,
          Electricista: 0,
          Instrumentista: 0,
        }),
        [key]: value,
      },
    }));
    form.setValue(
      `Labor.${key}` as `Labor.${keyof TypeResponse["Labor"]}`,
      value as unknown as never
    );
  };

  async function onSubmitForm(data: Partial<TypeResponse>) {
    console.log("procesando on submit");
    const TimeFinishPlan = new Date(activity.finplan);

    let estado = "";
    if (data.ActividadCancelada === "Si") {
      estado = "Cancelado";
    } else if (data.finreal) {
      estado = "Finalizado";
    } else {
      estado = new Date() > TimeFinishPlan ? "Atrasado" : "En curso";
    }

    const newData = {
      id: activity._id,
      idtask: activity.id,
      comentario: data.comentarios,
      inicio: data.inicioreal,
      fin: data.finreal,
      avance: data.avance,
      usuario: session?.user?.name,
      lastupdate: activity.updatedAt,
      ActividadCancelada: data.ActividadCancelada,
      Labor: data.Labor,
      NoLabor: data.NoLabor,
      vigente: "Si",
      estado: estado,
    };

    console.log(newData);

    setIsModalOpen(true);
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/updatedata`,
      newData
    );
    if (response.status === 200) {
      setModalLoader(false);
    } else {
      console.log("Error al guardar los datos");
    }
  }

  return (
    <ProtectedRouteComponentemail empresa="Todos">
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitForm)}
          className="w-5/6 md:w-1/2 space-y-6 bg-gray-800 rounded-xl p-8 shadow-2xl mt-8 mb-8"
        >
          <h2 className="text-2xl text-white font-bold mb-4">
            Actualización de actividades
          </h2>
          {/* Datos de la actividad */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base text-white font-bold mb-4 text-blue-600">
              Datos de la actividad
            </h3>
            <p className="text-white text-xs">
              <span className="font-bold">Actividad: </span>{" "}
              {activity ? activity.descripcion : "Loading..."}
            </p>
            <p className="text-white text-xs">
              <span className="font-bold">Última actualización: </span>{" "}
              {activity
                ? new Date(activity.updatedAt).toLocaleString("es-ES", {
                    timeZone: "America/Lima",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Loading..."}
            </p>
            <p className="text-white text-xs">
              <span className="font-bold">OT: </span>{" "}
              {activity ? activity.OT : "Loading..."}
            </p>
            <p className="text-white text-xs">
              <span className="font-bold">TAG: </span>{" "}
              {activity ? activity.TAG : "Loading..."}
            </p>
            <p className="text-white text-xs">
              <span className="font-bold">Responsable: </span>{" "}
              {activity ? activity.responsable : "Loading..."}
            </p>
            <p className="text-white text-xs">
              <span className="font-bold">Contratista: </span>{" "}
              {activity ? activity.contratista : "Loading..."}
            </p>
          </div>
          {/* Recursos No Labor */}
          <div className="border-t border-gray-300">
            <h3 className="text-base text-white font-bold mb-4 text-blue-600 mt-8">
              Recursos No Labor
            </h3>
            {Object.keys(formNoLabor.getValues()).map((key) => (
              <FormField
                key={key}
                name={
                  `${key}` as `${keyof z.infer<typeof FormSchema>["NoLabor"]}`
                }
                control={formNoLabor.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-white mb-4">
                    <FormControl className="text-white ">
                      <Checkbox
                        className="b-rounded-xl bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-full"
                        checked={
                          activity?.NoLabor?.[
                            key as keyof typeof activity.NoLabor
                          ] ?? false
                        }
                        onCheckedChange={(checked: boolean) =>
                          handleCheckedChange(
                            key as keyof TypeResponse["NoLabor"],
                            checked
                          )
                        }
                      />
                    </FormControl>
                    <FormLabel>{key}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          {/* Recursos Labor */}
          <div className="border-t border-gray-300">
            <h3 className="text-base text-white font-bold mb-4 text-blue-600 mt-8">
              Recursos Labor
            </h3>
            {Object.keys(formLabor.getValues()).map((key) => (
              <FormField
                key={key}
                name={
                  `${key}` as `${keyof z.infer<typeof FormSchema>["Labor"]}`
                }
                control={formLabor.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-white mb-4">
                    <FormLabel className="w-32">{key}</FormLabel>
                    <FormControl className="text-white ">
                      <Input
                        type="number"
                        className="b-rounded-xl bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-full w-16 text-center"
                        value={
                          activity?.Labor?.[
                            key as keyof typeof activity.Labor
                          ] ?? 0
                        }
                        onChange={(e) => {
                          console.log(form.formState.errors.Labor);
                          const value = parseInt(e.target.value, 10);
                          handleChange(
                            key as keyof TypeResponse["Labor"],
                            value
                          );
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            {form.formState.errors.Labor && (
              <FormMessage className="text-red-500">
                {form.formState.errors.Labor?.message}
              </FormMessage>
            )}
          </div>
          {/* Comentarios */}
          <div className="border-t border-gray-300 pt-4">
            <FormField
              control={form.control}
              name="comentarios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white mt-8">
                    Comentarios de la actividad
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe de manera detallada lo realizado en la actividad"
                      className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 h-32 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {/* Actividad Cancelada */}
          <FormField
            control={form.control}
            name="ActividadCancelada"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-white mb-4">
                <FormControl className="text-white ">
                  <Checkbox
                    className="b-rounded-xl bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-full"
                    checked={
                      activity?.ActividadCancelada === "Si" ? true : false
                    }
                    onCheckedChange={(checked) => {
                      setActivity((prev) => ({
                        ...prev,
                        ActividadCancelada: checked === true ? "Si" : "No",
                      }));
                      form.setValue(
                        "ActividadCancelada",
                        checked === true ? "Si" : "No"
                      );
                    }}
                  />
                </FormControl>
                <FormLabel>Actividad Cancelada</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Fecha Inicio */}
          <div>
            <FormField
              control={form.control}
              name="inicioreal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white">Inicio</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"default"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal text-white focus:border-blue-600",
                            !activity.inicioreal &&
                              "text-muted-foreground border-blue-600"
                          )}
                        >
                          {activity.inicioreal ? (
                            format(activity.inicioreal, "PPP  HH:mm")
                          ) : (
                            <span className="text-white">Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-white" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-0"
                      align="start"
                    >
                      <Calendar
                        className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (!date) return;//
                          const currentTime = field.value || new Date();
                          //const newDate = new Date(currentTime);
                          const newDate = new Date(date);

                          newDate.setHours(currentTime.getHours());
                          newDate.setMinutes(currentTime.getMinutes());

                          // Actualiza el estado de activity con la nueva fecha
                          const updatedActivity = {
                            ...activity,
                            // inicioreal: newDate.toISOString(), // Convierte a formato ISO
                            inicioreal: newDate, // Convierte a formato ISO
                          };
                          setActivity(updatedActivity);
                          field.onChange(newDate); // Actualiza el control de formulario
                        }}
                        // disabled={(date) =>
                        //   date > new Date() ||
                        //   date <
                        //     new Date(
                        //       new Date().setDate(new Date().getDate() - 2)
                        //     )
                        // }
                        disabled={(date) => {
                          // Normalizar fechas para comparar solo el día
                          const today = new Date();
                          today.setHours(0, 0, 0, 0); // Elimina horas/minutos/segundos
                      
                          const minDate = new Date(today);
                          minDate.setDate(today.getDate() - 1); // Un día anterior
                      
                          return date < minDate || date > today; // Deshabilitar fuera del rango permitido
                        }}
                        initialFocus
                      />
                      <div className="bg-gray-900 text-white p-3 border-t border-border">
                        <TimePickerDemo
                          setDate={(time) => {
                            const currentDate = field.value || new Date();
                            const newDate = new Date(currentDate);

                            newDate.setHours(time?.getHours() || 0);
                            newDate.setMinutes(time?.getMinutes() || 0);
                            newDate.setSeconds(time?.getSeconds() || 0);

                            const updatedActivity = {
                              ...activity,
                              // inicioreal: newDate.toISOString(),
                              inicioreal: newDate,
                            };
                            console.log(activity);
                            setActivity(updatedActivity);
                            field.onChange(newDate);
                          }}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {/* Fecha Fin */}
          <div>
            <FormField
              control={form.control}
              name="finreal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white">Fin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"default"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal text-white focus:border-blue-600",
                            !activity.finreal &&
                              "text-muted-foreground border-blue-600"
                          )}
                        >
                          {activity.finreal ? (
                            format(activity.finreal, "PPP  HH:mm")
                          ) : (
                            <span className="text-white">Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-white" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-0"
                      align="start"
                    >
                      <Calendar
                        className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                        mode="single"
                        onSelect={(date) => {
                          // Si el valor de field.value es null, lo inicializamos
                          if (!date) return;//
                          const currentTime = field.value || new Date();
                          //const newDate = new Date(currentTime);
                          const newDate = new Date(date);

                          // Combina la fecha seleccionada con la hora existente
                          newDate.setHours(currentTime.getHours());
                          newDate.setMinutes(currentTime.getMinutes());

                          // Actualiza el estado de activity con la nueva fecha
                          const updatedActivity = {
                            ...activity,
                            // finreal: newDate.toISOString(), // Convierte a formato ISO
                            finreal: newDate,
                          };
                          setActivity(updatedActivity);
                          field.onChange(newDate); // Actualiza el control de formulario
                        }}
                        // disabled={(date) =>
                        //   date > new Date() ||
                        //   date <
                        //     new Date(
                        //       new Date().setDate(new Date().getDate() - 2)
                        //     )
                        // }
                        disabled={(date) => {
                          // Normalizar fechas para comparar solo el día
                          const today = new Date();
                          today.setHours(0, 0, 0, 0); // Elimina horas/minutos/segundos
                      
                          const minDate = new Date(today);
                          minDate.setDate(today.getDate() - 1); // Un día anterior
                      
                          return date < minDate || date > today; // Deshabilitar fuera del rango permitido
                        }}
                        initialFocus
                      />
                      <div className="bg-gray-900 text-white p-3 border-t border-border">
                        <TimePickerDemo
                          setDate={(time) => {
                            const currentDate = field.value || new Date();
                            const newDate = new Date(currentDate);

                            newDate.setHours(time?.getHours() || 0);
                            newDate.setMinutes(time?.getMinutes() || 0);
                            newDate.setSeconds(time?.getSeconds() || 0);

                            const updatedActivity = {
                              ...activity,
                              // finreal: newDate.toISOString(),
                              finreal: newDate,
                            };
                            console.log(activity);
                            setActivity(updatedActivity);
                            field.onChange(newDate);
                          }}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {/* Avance */}
          <div className="border-t border-gray-300 pt-4">
            <FormField
              control={form.control}
              name="avance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white mt-8">Avance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="b-rounded-xl bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-full w-32 text-center"
                      value={activity?.avance}
                      onChange={(e) => {
                        console.log(form.formState.errors);
                        console.log(
                          "Valores actuales del formulario: ",
                          form.watch()
                        );
                        const value = parseInt(e.target.value, 10);
                        field.onChange(value);
                        setActivity((prev) => ({
                          ...prev,
                          avance: value,
                        }));
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            Enviar
          </Button>
        </form>
      </Form>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 max-w-sm w-full rounded-xl">
            {modalLoader && (
              <div>
                <h2 className="text-lg font-bold">Guardando</h2>
                <Spinner size="md" color="primary" labelColor="primary" />
              </div>
            )}
            {!modalLoader && (
              <p className="mt-2">
                Los cambios han sido guardados correctamente.
              </p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => router.push("/paradadeplanta/activities")}
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
