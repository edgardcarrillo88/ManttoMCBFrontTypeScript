"use client";

import { Card, CardHeader } from "@nextui-org/card";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Preguntas = [
  {
    id: 1,
    Pregunta:
      "Escriba usted cuales son los 4 estados en los que nos encontramos cuando sucede un evento de seguridad ",
    Opciones: [
      "Prisa, Fatiga, Complacencia ,Entusiasmo",
      "Frustración, Prisa, Fatiga, Complacencia",
      "Frustración, Prisa, Ira , Complacencia",
      "Frustración, Somnolencia, Prisa , Complacencia",
    ],
    Respuesta: "Frustración, Prisa, Fatiga, Complacencia",
  },
  // {
  //     id: 2,
  //     Pregunta: "Identifique las zonas que debe usar traje antiácido (vea imagen de Pregunta 2)",
  //     Opciones: [
  //         "A, B, F, G, H, J",
  //         "A, B, C, D, I, K",
  //         "F, G, H, J, K",
  //         "A, B, C, D, F, G, H, J"
  //     ],
  //     Respuesta: "A, B, F, G, H, J"
  // },
  {
    id: 2,
    Pregunta:
      "¿Según el estándar de trabajos en caliente, a que distancia tiene que estar los materiales inflamables?",
    Opciones: ["25 metros", "10 metros", "15 metros", "12 metros"],
    Respuesta: "15 metros",
  },
  {
    id: 3,
    Pregunta: "Cuantas reglas por la vida son en MCB",
    Opciones: ["8", "12", "9", "11"],
    Respuesta: "11",
  },
  {
    id: 4,
    Pregunta:
      "Según el evento explicado en la charla indique usted cual fue el error crítico (vea imagen de pregunta 4).",
    Opciones: [
      "Ojos no en la tarea, Mente no en la tarea, Equilibrio/ Tracción / Agarre",
      "Mente no en la tarea , Equilibrio/ Tracción / Agarre.",
      "En la línea de fuego, Ojos no en la tarea, Mente no en la tarea.",
      "Equilibrio / Tracción / Agarre.",
    ],
    Respuesta:
      "Ojos no en la tarea, Mente no en la tarea, Equilibrio/ Tracción / Agarre",
  },
  {
    id: 5,
    Pregunta:
      "Al inspeccionar las herramientas para una  PDP Enero debemos rotularlas con  cinta color: ",
    Opciones: ["Amarillo", "Azul", "Verde", "Rojo"],
    Respuesta: "Rojo",
  },
  {
    id: 6,
    Pregunta: "Antes de iniciar  el mantenimiento de un Chute  debo:",
    Opciones: [
      "Bloquear con mi candado Azul , Monitoreo de gases, Llenar el IPERC, Limpiar.",
      "Bloquear con mi candado rojo, Monitoreo de gases, Llenar el IPERC, Limpiar.",
      "Monitoreo de gases, Llenar el IPERC, Limpiar.",
      "Llenar el IPERC ,  Avisar al supervisor, llamar a CECOM.",
    ],
    Respuesta:
      "Bloquear con mi candado rojo, Monitoreo de gases, Llenar el IPERC, Limpiar.",
  },
  {
    id: 7,
    Pregunta: "El procedimiento para realizar un bloqueo es el siguiente: ",
    Opciones: [
      "Informar y coordinar ; Apagar y aislar ; Bloquear y etiquetar; Verificar “Energía Cero”; Colocar tarjetas y candados.",
      "Informar y coordinar; Bloquear y etiquetar; Verificar “Energía Cero”; Colocar tarjetas y candados ; Apagar y aislar.",
      "Bloquear y etiquetar; Verificar “Energía Cero”; Colocar tarjetas y candados ; Apagar y aislar; Informar y coordinar.",
      "Bloquear y etiquetar; Colocar tarjetas y candados ; Verificar “Energía Cero”; Apagar y aislar; Informar y coordinar.",
    ],
    Respuesta:
      "Informar y coordinar ; Apagar y aislar ; Bloquear y etiquetar; Verificar “Energía Cero”; Colocar tarjetas y candados.",
  },
  {
    id: 8,
    Pregunta:
      "Renato que está trabajando en la reparación del chute 305 ve que ya falta poco para el horario de almuerzo y  quiere culminar rápidamente en ello ve pasar  a Juan y  le pide ayuda  solo por 5 minutos  (Juan no había bloqueado y tenía otras tareas asignadas); Juan piensa solo es un momento y no va a pasar nada, decide ayudarle y durante su ayuda se golpea con un liners. Identifique en qué estado estaba Juan",
    Opciones: [
      "Prisa, Frustración",
      "Frustración, Fatiga ",
      "Fatiga, Prisa",
      "Prisa, Complacencia",
    ],
    Respuesta: "Prisa, Complacencia",
  },
  {
    id: 9,
    Pregunta:
      "Pedro y Marco estan cambiando polines en la CV-206, en ello Pedro recibe un mensaje de WhatsApp decide sacar el celular y contestar utilizando una mano, en ello cae se resbala el polin y sufre el atrapamiento de un dedo.",
    Opciones: [
      "Mente no en la tarea, En la línea de fuego.",
      "Ojos no en la tarea,  Mente no en la tarea, En la línea de fuego.",
      "En la línea de fuego, Mente no en la tarea.",
      "Equilibrio/ Tracción / Agarre.",
    ],
    Respuesta:
      "Ojos no en la tarea,  Mente no en la tarea, En la línea de fuego.",
  },
  {
    id: 10,
    Pregunta:
      "Referente a las buenas prácticas y Safestart indique cuantas pausas activas se deben realizar:",
    Opciones: [
      "2, 10:00am y 04:00pm",
      "3, 7:00am, 12:00pm y 3:00pm",
      "1, 5:00pm",
      "N.A.",
    ],
    Respuesta: "2, 10:00am y 04:00pm",
  },
];

const evaluationSchema = z.object({
  name: z.string().min(2, {
    message: "Debes escribir por lo menos 2 caracteres.",
  }),
  lastname: z.string().min(2, {
    message: "Debes escribir por lo menos 2 caracteres.",
  }),
  dni: z.string().refine(
    (value) => {
      return /^\d+$/.test(value) && value.length >= 8;
    },
    {
      message: "Solo se permiten números. Debe tener al menos 8 caracteres.",
    }
  ),
  company: z.string().min(2, {
    message: "Debe seleccionar una empresa.",
  }),
  position: z.string().min(2, {
    message: "Debes seleccionar un cargo.",
  }),
  respuesta: z.record(
    z.string().regex(/^respuesta_\d+$/, { message: "clave invalida" }),
    z.string().min(1, { message: "Debes seleccionar una respuesta." })
  ),
});

type EvaluationSchema = z.infer<typeof evaluationSchema>;

export default function page() {
  const router = useRouter();

  const [modalLoader, setModalLoader] = useState(true);
  const [modal, setModal] = useState(false);

  const Empresas = [
    "Prodise",
    "IngePeru",
    "Confipetrol",
    "Emensa",
    "Invesux",
    "RTS",
    "Selin",
    "Precision",
    "Voyant",
    "Vivargo",
    "Eccocentury",
    "Emsumir",
  ];

  const Puestos = [
    "Técnico Mecánico",
    "Técnico Electricista",
    "Técnico Instrumentista",
    "Técnico Soldador",
    "Ingeniero seguridad",
    "Supervisor",
    "Planner",
  ];

  const dynamicDefaults = Preguntas.reduce<Record<string, string>>(
    (acc, pregunta) => {
      acc[`respuesta_${pregunta.id}`] = "";
      return acc;
    },
    {}
  );

  console.log(dynamicDefaults);

  const form = useForm<EvaluationSchema>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      name: "",
      lastname: "",
      dni: "",
      company: "",
      position: "",
      respuesta: dynamicDefaults,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setModal(true);
    console.log(values);

    const ArrayRespuestas = [];

    for (const [key, value] of Object.entries(values.respuesta)) {
      let Puntaje = 0;
      const FilterPregunta = Preguntas.find(
        (pregunta) => pregunta.id == parseInt(key.split("_")[1])
      );
      if (FilterPregunta?.Respuesta === value) {
        Puntaje = 2;
      } else {
        Puntaje = 0;
      }
      const objectRespuesta = {
        id: parseInt(key.split("_")[1]),
        respuesta: value,
        Puntaje: Puntaje,
      };
      ArrayRespuestas.push(objectRespuesta);
    }
    const PuntajeTotal = ArrayRespuestas.reduce(
      (acc, pregunta) => acc + pregunta.Puntaje,
      0
    );

    const objeto = ArrayRespuestas.reduce<Record<string, string>>(
      (acc, item) => {
        acc[item.id.toString()] = item.respuesta;
        return acc;
      },
      {}
    );

    objeto.DNI = values.dni;
    objeto.Fecha = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Lima",
    });
    objeto.Nombre = values.name + ", " + values.lastname;
    objeto.Cargo = values.position;
    objeto.Empresa = values.company;

    const data = {
      Nota: PuntajeTotal,
      answer: objeto,
    };

    console.log(data);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/evaluacionpdp`,
      { data }
    );
    if (response.status === 200) {
      setModalLoader(false);
      alert(`Formulario enviado con exito, tu nota es ${PuntajeTotal}`);
      console.log(`Formulario enviado con exito, tu nota es ${PuntajeTotal}`);
      form.reset();
      router.push("/paradadeplanta");
    } else {
      setModalLoader(false);
      alert("Error al enviar el formulario");
      console.log("Error al enviar el formulario");
    }
  });

  return (
    <>
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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

      <Card className="w-4/5 md:w-1/2 mt-8 mb-8 border-1 border-gray-200 rounded-lg shadow-lg mx-auto text-black">
        <CardHeader>
          <CardTitle className="text-center mx-auto">
            Datos personales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    {form.formState.errors.dni?.message && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.name?.message}
                      </p>
                    )}
                    {/* <FormDescription>ingresa tus nombres</FormDescription> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control} //Controlado por
                name="lastname" //captura la informacion en este nombre
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    {form.formState.errors.dni?.message && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.lastname?.message}
                      </p>
                    )}
                    {/* <FormDescription>ingresa tus apellidos</FormDescription> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control} //Controlado por
                name="dni" //captura la informacion en este nombre
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    {form.formState.errors.dni?.message && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.dni?.message}
                      </p>
                    )}
                    {/* <FormDescription>ingresa tu DNI</FormDescription> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control} //Controlado por
                name="company" //captura la informacion en este nombre
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Empresas.map((empresa) => (
                          <SelectItem key={empresa} value={empresa}>
                            {empresa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormDescription>Selecciona tu empresa</FormDescription> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control} //Controlado por
                name="position" //captura la informacion en este nombre
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puesto trabajo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un puesto de trabajo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Puestos.map((puesto) => (
                          <SelectItem key={puesto} value={puesto}>
                            {puesto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormDescription>
                    Selecciona tu puesto de trabajo
                  </FormDescription> */}
                  </FormItem>
                )}
              />

              <CardTitle className="text-center mx-auto mt-8">
                Preguntas de Evaluación
              </CardTitle>

              {/* Preguntas */}

              {Preguntas.map((pregunta) => (
                <FormField
                  key={pregunta.id}
                  control={form.control} //Controlado por
                  name={`respuesta.respuesta_${pregunta.id}`} // el primer "respuesta" viene de la key de defaultValues
                  render={({ field }) => (
                    <FormItem className="mt-8 mb-8">
                      <FormLabel>
                        {pregunta.id}. {pregunta.Pregunta}
                      </FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una respuesta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pregunta.Opciones.map((opcion) => (
                            <SelectItem key={opcion} value={opcion}>
                              {opcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              ))}

              <CardContent>
                <CardTitle className="text-center mx-auto mt-8">
                  Imagenes de pregunta 4
                </CardTitle>
                <img
                  className="mx-auto"
                  src="https://i.postimg.cc/zX284Q2J/Pregunta4.png"
                  alt="imagen1"
                />
              </CardContent>

              <Button className="mt-8 bg-red-500 hover:bg-red-800">
                Enviar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
