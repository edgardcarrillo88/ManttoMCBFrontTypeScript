"use client";

import React, { useEffect, useState } from "react";
import { Bold, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Legend,
  ComposedChart,
  Tooltip as ChartTooltipRecharts,
} from "recharts";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
} from "@/components/ui/chart";

import { Label, Pie, PieChart, Sector } from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableColumn, Selection, SortDescriptor } from "@nextui-org/table";

import axios from "axios";

import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

import { ChevronDownIcon } from "@/components/table/utils/ChevronDownIcon";
import { Button } from "@nextui-org/button";
import { set } from "date-fns";
import { useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Label as LabelChadCN } from "@/components/ui/label";

import { ItemMedia } from "@/components/ui/item";

import { RefreshCcw } from "lucide-react";
import { fetchData } from "next-auth/client/_utils";

// export const description = "A line chart with dots";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const chartData = [
  { month: "2024-04-01", desktop: 186, mobile: 80 },
  { month: "2024-04-02", desktop: 305, mobile: 200 },
  { month: "2024-04-03", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const desktopData = [
  { month: "january", desktop: 186, fill: "var(--color-january)" },
  { month: "february", desktop: 305, fill: "var(--color-february)" },
  { month: "march", desktop: 237, fill: "var(--color-march)" },
  { month: "april", desktop: 173, fill: "var(--color-april)" },
  { month: "may", desktop: 209, fill: "var(--color-may)" },
];

const chartData2 = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartData3 = [
  { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },

  LineaBaseReal: {
    label: "Curva Real",
    color: "hsl(var(--chart-1))",
  },
  LineaBaseAjustada: {
    label: "Curva Ajustada",
    color: "hsl(var(--chart-2))",
  },

  AvanceReal: {
    label: "Avance Real",
    color: "hsl(var(--chart-1))",
  },
  AvanceRealAjustado: {
    label: "Avance Ajustado",
    color: "hsl(var(--chart-2))",
  },

  SPI: {
    label: "SPI",
    color: "hsl(var(--chart-1))",
  },
  SPIAjustado: {
    label: "SPI Ajustado",
    color: "hsl(var(--chart-2))",
  },

  visitors: {
    label: "Visitors",
  },

  january: {
    label: "January",
    color: "hsl(var(--chart-1))",
  },
  february: {
    label: "February",
    color: "hsl(var(--chart-2))",
  },
  march: {
    label: "March",
    color: "hsl(var(--chart-3))",
  },
  april: {
    label: "April",
    color: "hsl(var(--chart-4))",
  },
  may: {
    label: "May",
    color: "hsl(var(--chart-5))",
  },

  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

type TypeCurvaSGeneral = {
  Ejex: Date;
  Filtro01?: string;
  Filtro02?: string;

  hh_lb?: number;
  hh_lb_cum: number;
  hh_real?: number;
  hh_real_cum: number;
}[];

type TypeChartData = {
  LineaCombinada: TypeCurvaSGeneral;
  LineaCombinadaAjustada: TypeCurvaSGeneral;
};

type TypeValoresTotales = {
  AvanceReal: number;
  AvanceRealAjustado: number;
};

type ChartLineCombinadaProps = {
  data: TypeChartData;
  totales: TypeValoresTotales;
};

type TypeChartDataArea = {
  General: TypeCurvaSGeneral;
  Ajustada: TypeCurvaSGeneral;
};

type ChartLineCombinadaPropsArea = {
  name: string;
  data: TypeChartDataArea;
  totales: TypeValoresTotales;
  toggle?: boolean;
  loader?: boolean;
};

type ChartLineProps = {
  data: TypeCurvaSGeneral;
};

type TypeActivities = {
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
  finreal?: string;
  inicioreal?: string;

  hh: number;
  id: number;
  responsable: string;
  nivel: number;

  updatedAt: string;
  __v: number;
  _id: string;
  deleted: boolean;
};

type TypeThirdParty = {
  name: string;
  uid: string;
};

type TypeEspecialidad = {
  name: string;
  uid: string;
};

type SPIState = {
  CurvaGeneral: TypeCurvaSGeneral;
  CurvaArea: TypeCurvaSGeneral;
  CurvaContratista: TypeCurvaSGeneral;
  CurvaAreaContratista: TypeCurvaSGeneral;
  CurvaEspecialidadContratista: TypeCurvaSGeneral;
};

// export function ChartPie() {
//   const id = "pie-interactive";
//   const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month);
//   const activeIndex = React.useMemo(
//     () => desktopData.findIndex((item) => item.month === activeMonth),
//     [activeMonth]
//   );
//   const months = React.useMemo(() => desktopData.map((item) => item.month), []);
//   return (
//     <Card data-chart={id} className="flex flex-col">
//       <ChartStyle id={id} config={chartConfig} />
//       <CardHeader className="flex-row items-start space-y-0 pb-0">
//         <div className="grid gap-1">
//           <CardTitle>Pie Chart - Interactive</CardTitle>
//           <CardDescription>January - June 2024</CardDescription>
//         </div>
//         <Select value={activeMonth} onValueChange={setActiveMonth}>
//           <SelectTrigger
//             className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
//             aria-label="Select a value"
//           >
//             <SelectValue placeholder="Select month" />
//           </SelectTrigger>
//           <SelectContent align="end" className="rounded-xl">
//             {months.map((key) => {
//               const config = chartConfig[key as keyof typeof chartConfig];
//               if (!config) {
//                 return null;
//               }
//               return (
//                 <SelectItem
//                   key={key}
//                   value={key}
//                   className="rounded-lg [&_span]:flex"
//                 >
//                   <div className="flex items-center gap-2 text-xs">
//                     <span
//                       className="flex h-3 w-3 shrink-0 rounded-sm"
//                       style={{
//                         backgroundColor: `var(--color-${key})`,
//                       }}
//                     />
//                     {config?.label}
//                   </div>
//                 </SelectItem>
//               );
//             })}
//           </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent className="flex flex-1 justify-center pb-0">
//         <ChartContainer
//           id={id}
//           config={chartConfig}
//           className="mx-auto aspect-square w-full max-w-[300px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={desktopData}
//               dataKey="desktop"
//               nameKey="month"
//               innerRadius={60}
//               strokeWidth={5}
//               activeIndex={activeIndex}
//               activeShape={({
//                 outerRadius = 0,
//                 ...props
//               }: PieSectorDataItem) => (
//                 <g>
//                   <Sector {...props} outerRadius={outerRadius + 10} />
//                   <Sector
//                     {...props}
//                     outerRadius={outerRadius + 25}
//                     innerRadius={outerRadius + 12}
//                   />
//                 </g>
//               )}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-3xl font-bold"
//                         >
//                           {desktopData[activeIndex].desktop.toLocaleString()}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground"
//                         >
//                           Visitors
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

// export function ChartRadar() {
//   return (
//     <Card className="">
//       <CardHeader className="items-center pb-4">
//         <CardTitle>Radar Chart - Grid Circle</CardTitle>
//         <CardDescription>
//           Showing total visitors for the last 6 months
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <RadarChart data={chartData}>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <PolarGrid gridType="circle" />
//             <PolarAngleAxis dataKey="month" />
//             <Radar
//               dataKey="desktop"
//               fill="var(--color-desktop)"
//               fillOpacity={0.6}
//               dot={{
//                 r: 4,
//                 fillOpacity: 1,
//               }}
//             />
//           </RadarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="flex items-center gap-2 leading-none text-muted-foreground">
//           January - June 2024
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// export function ChartRadialGrid() {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Radial Chart - Grid</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <RadialBarChart data={chartData2} innerRadius={30} outerRadius={100}>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel nameKey="browser" />}
//             />
//             <PolarGrid gridType="circle" />
//             <RadialBar dataKey="visitors" />
//           </RadialBarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// export function ChartRadialShape() {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Radial Chart - Shape</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <RadialBarChart
//             data={chartData3}
//             endAngle={100}
//             innerRadius={80}
//             outerRadius={140}
//           >
//             <PolarGrid
//               gridType="circle"
//               radialLines={false}
//               stroke="none"
//               className="first:fill-muted last:fill-background"
//               polarRadius={[86, 74]}
//             />
//             <RadialBar dataKey="visitors" background />
//             <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-4xl font-bold"
//                         >
//                           {chartData3[0].visitors.toLocaleString()}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground"
//                         >
//                           Visitors
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </PolarRadiusAxis>
//           </RadialBarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

const CurvaSUnaVariable = React.memo(function CurvaSUnaVariable({
  name,
  data,
  totales,
  toggle,
}: ChartLineCombinadaPropsArea) {
  const uniqueAreas = Array.from(
    new Set(data.General.map((item) => item.Filtro01))
  );

  const [loader, setLoader] = useState(false);

  const ArrayAreas = useMemo(() => {
    return uniqueAreas.map((area) => ({
      uid: area,
      name: area,
    }));
  }, [data.General]);

  const [AreaSeleccionada, setAreaSeleccionada] = React.useState<Selection>(
    new Set()
  );

  const [avanceTotal, setAvanceTotal] = useState<{
    AvanceReal: string;
    AvanceRealAjustado: string;
  }>({
    AvanceReal: "0%",
    AvanceRealAjustado: "0%",
  });

  useEffect(() => {
    const defaultUid = ArrayAreas[0]?.uid;
    setAreaSeleccionada(defaultUid ? new Set([defaultUid]) : new Set());
  }, [ArrayAreas]);

  //---------------------------------------------

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("AvanceReal");
  const [lineChartActive, setLineChartActive] = useState(data.General);

  React.useEffect(() => {
    const fuenteDatos =
      chartConfig[activeChart].label === "Avance Real"
        ? data.General
        : data.Ajustada;

    const fuenteDatosAjustada =
      chartConfig[activeChart].label === "Avance Real"
        ? data.Ajustada
        : data.General;

    const selected = Array.from(AreaSeleccionada)[0];

    if (selected) {
      const filtrado = fuenteDatos.filter((item) => item.Filtro01 === selected);
      const filtradoAjustado = fuenteDatosAjustada.filter(
        (item) => item.Filtro01 === selected
      );

      //setLineChartActive(filtrado); LO he comentado y reemplazado por el condiconal de abajo

      if (toggle === true) {
        const newArray = filtrado.map(({ hh_real, hh_lb, ...rest }) => rest);
        setLineChartActive(newArray);
      } else {
        setLineChartActive(filtrado);
      }

      const avance = calcularPorcentajeAvance(filtrado);
      const avanceAjustado = calcularPorcentajeAvance(filtradoAjustado);
      setAvanceTotal({
        AvanceReal: avance !== null ? `${avance.toFixed(1)}%` : "0%",
        AvanceRealAjustado:
          avanceAjustado !== null ? `${avanceAjustado.toFixed(1)}%` : "0%",
      });
    } else {
      //setLineChartActive(data.General); // Si no hay selección, mostrar todo // LO he comentado y reemplazado por el condiconal de abajo

      if (toggle === true) {
        const newArray = data.General.map(
          ({ hh_real, hh_lb, ...rest }) => rest
        );
        setLineChartActive(newArray);
      } else {
        setLineChartActive(data.General);
      }

      const avance = calcularPorcentajeAvance(data.General);
      const avanceAjustado = calcularPorcentajeAvance(data.Ajustada);
      setAvanceTotal({
        AvanceReal: avance !== null ? `${avance.toFixed(1)}%` : "0%",
        AvanceRealAjustado:
          avanceAjustado !== null ? `${avanceAjustado.toFixed(1)}%` : "0%",
      });
    }
  }, [AreaSeleccionada, activeChart, data.General, data.Ajustada, toggle]);

  // LineaBaseAjustada: `${totales.AvanceRealAjustado.toFixed(1)}%`,

  function calcularPorcentajeAvance(data: TypeCurvaSGeneral): number | null {
    if (!data.length) return 0;

    // Redondear la fecha actual a la siguiente hora (por ejemplo, 17:45 → 18:00)
    const ahora = new Date();
    ahora.setSeconds(0);
    ahora.setMilliseconds(0);
    if (ahora.getMinutes() > 0) {
      ahora.setHours(ahora.getHours() + 1);
      ahora.setMinutes(0);
    }

    // Buscar coincidencia exacta por fecha y hora
    let match = data.find(
      (item) =>
        item.Ejex.getFullYear() === ahora.getFullYear() &&
        item.Ejex.getMonth() === ahora.getMonth() &&
        item.Ejex.getDate() === ahora.getDate() &&
        item.Ejex.getHours() === ahora.getHours()
    );

    // Si no hay coincidencia exacta, buscar la fecha menor más cercana
    if (!match) {
      const fechaMasCercana = data
        .filter((item) => item.Ejex <= ahora)
        .sort((a, b) => b.Ejex.getTime() - a.Ejex.getTime()); // de mayor a menor
      match = fechaMasCercana[0]; // el más cercano hacia atrás
    }

    if (match && match.hh_lb_cum > 0) {
      return (match.hh_real_cum / match.hh_lb_cum) * 100;
    }

    return 0;
  }

  // var total = {
  //   LineaBaseReal: `${totales.AvanceReal.toFixed(1)}%`,
  //   LineaBaseAjustada: `${totales.AvanceRealAjustado.toFixed(1)}%`,
  // };

  return (
    <div key={name}>
      {loader && (
        <div className="w-[600px]">
          <BaymaxLoader />
        </div>
      )}

      <div className={`mb-2 ${name === "CurvaGeneral" ? "hidden" : "block"}`}>
        <Dropdown>
          <DropdownTrigger className="">
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              variant="faded"
            >
              {Array.from(AreaSeleccionada).length === 0
                ? "Areas"
                : AreaSeleccionada}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={AreaSeleccionada}
            selectionMode="single"
            onSelectionChange={setAreaSeleccionada}
          >
            {ArrayAreas.map((status) => (
              <DropdownItem key={status.uid} className="capitalize">
                {status.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      <Card className=" w-full">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Curva S con Barras</CardTitle>
            <CardDescription>
              Comparación entre línea base y real
            </CardDescription>
          </div>
          <div className="flex">
            {["AvanceReal", "AvanceRealAjustado"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              // console.log(key); //xq se imprime 24 veces?
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => {
                    setLineChartActive(
                      chartConfig[chart].label === "Avance Real"
                        ? data.General
                        : data.Ajustada
                    );
                    setActiveChart(chart);
                  }}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {avanceTotal[key as keyof typeof avanceTotal]}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ComposedChart
              data={lineChartActive}
              margin={{ left: 12, right: 30, bottom: 24 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="Ejex"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                  });
                }}
                label={{
                  value: "Fechas",
                  position: "insideBottom",
                  offset: -10,
                  style: { fontWeight: "bold", fontSize: 12, fill: "#333" },
                }}
              />

              {/* Eje Y para las Barras */}
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value} hh`}
                label={{ value: "HH", angle: -90, position: "insideLeft" }}
              />

              {/* Eje Y para las Líneas */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tickFormatter={(value) => `${value} hh`}
                label={{
                  value: "HH Acumuladas",
                  angle: 90,
                  position: "insideRight",
                  offset: -20,
                }}
              />

              <ChartTooltipRecharts
                cursor={true}
                content={<ChartTooltipContent indicator="dot" />}
              />

              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                content={({ payload }) => (
                  <ul className="list-none m-0 p-0">
                    {payload?.map((entry, index) => {
                      const isCum = String(entry.dataKey).includes("cum");
                      return (
                        <li
                          key={`item-${index}`}
                          className="flex items-center mb-1"
                        >
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: isCum ? "50%" : "2px", // círculo para reales, cuadrado para plan
                              backgroundColor: entry.color,
                              marginRight: 8,
                            }}
                          />
                          <span className="text-sm">{entry.value}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                wrapperStyle={{
                  paddingLeft: 40,
                  paddingRight: -20,
                  lineHeight: "24px",
                }}
              />

              {/* Barras */}
              <Bar
                dataKey="hh_lb"
                fill="var(--color-desktop)"
                radius={4}
                yAxisId="left"
              />
              <Bar
                dataKey="hh_real"
                fill="var(--color-mobile)"
                radius={4}
                yAxisId="left"
              />
              {/* Línea */}
              <Line
                dataKey="hh_lb_cum"
                type="monotone"
                // stroke={`var(--color-${activeChart})`}
                stroke={`var(--color-desktop)`}
                strokeWidth={2}
                dot={true}
                yAxisId="right"
              />
              <Line
                dataKey="hh_real_cum"
                type="monotone"
                // stroke="var(--color-secondary)"
                stroke={`var(--color-mobile)`}
                strokeWidth={2}
                dot={true}
                yAxisId="right"
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
});

const CurvaSDosVariable = React.memo(function CurvaSDosVariable({
  name,
  data,
  totales,
  toggle,
}: ChartLineCombinadaPropsArea) {
  //---------------------------------------------
  const [AreaSeleccionada, setAreaSeleccionada] = React.useState<Selection>(
    new Set([])
  );
  const [ContratistaSeleccionado, setContratistaSeleccionado] =
    React.useState<Selection>(new Set([]));

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("AvanceReal");
  const [lineChartActive, setLineChartActiveDouble] = useState(
    data.General.filter((item) => item.Ejex.getTime() !== 0)
  );

  const [avanceTotal, setAvanceTotal] = useState<{
    AvanceReal: string;
    AvanceRealAjustado: string;
  }>({
    AvanceReal: "0%",
    AvanceRealAjustado: "0%",
  });

  const uniqueAreas = Array.from(
    new Set(
      data.General.map((item) => item.Filtro02).filter(
        (date) => date && date.trim() !== ""
      )
    )
    //new Set(data.General.map((item) => item.Filtro02))
  );

  const uniqueContratista = Array.from(
    new Set(
      data.General.map((item) => item.Filtro01).filter(
        (date) => date && date.trim() !== ""
      )
    )
    //new Set(data.General.map((item) => item.Filtro01))
  );

  const ArrayAreas = useMemo(() => {
    return uniqueAreas.map((area) => ({
      uid: area,
      name: area,
    }));
  }, [data.General]);

  const ArrayContratista = useMemo(() => {
    return uniqueContratista.map((contratista) => ({
      uid: contratista,
      name: contratista,
    }));
  }, [data.General]);

  React.useEffect(() => {
    const allUids = ArrayAreas.map((a) => a.uid).filter(
      (uid): uid is string => !!uid
    );
    const allContratistaUids = ArrayContratista.map((c) => c.uid).filter(
      (uid): uid is string => !!uid
    );

    if (ArrayAreas.length > 0 && Array.from(AreaSeleccionada).length === 0) {
      setAreaSeleccionada(new Set(allUids));
    }
    if (
      ArrayContratista.length > 0 &&
      Array.from(ContratistaSeleccionado).length === 0
    ) {
      setContratistaSeleccionado(new Set(allContratistaUids));
    }
  }, [ArrayAreas, ArrayContratista]);

  const UpdateCurvaS = async () => {
    console.log("Actualizando curva S con WhatIf");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_PY}/ParadaDePlanta/ProcesarWhatIf`,
      {
        params: {
          area: Array.from(AreaSeleccionada),
          contratista: Array.from(ContratistaSeleccionado),
        },
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();

          for (const key in params) {
            const value = params[key];
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else {
              searchParams.append(key, value);
            }
          }

          return searchParams.toString();
        },
      }
    );

    if (response.status === 200) {
      // aca debo setear la nueva curva
      // console.log(response.data);

      Object.keys(response.data).forEach((key) => {
        response.data[key].General.map((item: any) => {
          item.Ejex = new Date(item.Ejex);
        });
        response.data[key].Ajustada.map((item: any) => {
          item.Ejex = new Date(item.Ejex);
        });
      });

      // setLineChartActiveDouble(
      //   (response.data.CurvaWhatIf.General as TypeCurvaSGeneral).filter(
      //     (item) => item.Ejex.getTime() !== 0
      //   )
      // ); //Verficiar porque debido definirlo con "as" creería que debería ya estar tipado y no tener que forzarlo

      const filtrado =
        chartConfig[activeChart].label === "Curva Real"
          ? (response.data.CurvaWhatIf.General as TypeCurvaSGeneral).filter(
              (item) => item.Ejex.getTime() !== 0
            ) //Verficiar porque debido definirlo con "as" creería que debería ya estar tipado y no tener que forzarlo
          : (response.data.CurvaWhatIf.Ajustada as TypeCurvaSGeneral).filter(
              (item) => item.Ejex.getTime() !== 0
            ); //Verficiar porque debido definirlo con "as" creería que debería ya estar tipado y no tener que forzarlo

      // setLineChartActiveDouble(

      // );

      if (toggle === true) {
        const newArray = filtrado.map(({ hh_real, hh_lb, ...rest }) => rest);
        setLineChartActiveDouble(newArray);
      } else {
        setLineChartActiveDouble(filtrado);
      }

      const avance = calcularPorcentajeAvance(
        (response.data.CurvaWhatIf.General as TypeCurvaSGeneral).filter(
          (item) => item.Ejex.getTime() !== 0
        )
      );
      const avanceAjustado = calcularPorcentajeAvance(
        (response.data.CurvaWhatIf.Ajustada as TypeCurvaSGeneral).filter(
          (item) => item.Ejex.getTime() !== 0
        )
      );
      setAvanceTotal({
        AvanceReal: avance !== null ? `${avance.toFixed(1)}%` : "0%",
        AvanceRealAjustado:
          avanceAjustado !== null ? `${avanceAjustado.toFixed(1)}%` : "0%",
      });

      console.log("Datos actualizados");
    } else {
      console.error("Error al obtener los datos:");
    }
  };

  function calcularPorcentajeAvance(data: TypeCurvaSGeneral): number | null {
    if (!data.length) return 0;

    // Redondear la fecha actual a la siguiente hora (por ejemplo, 17:45 → 18:00)
    const ahora = new Date();
    ahora.setSeconds(0);
    ahora.setMilliseconds(0);
    if (ahora.getMinutes() > 0) {
      ahora.setHours(ahora.getHours() + 1);
      ahora.setMinutes(0);
    }

    // Buscar coincidencia exacta por fecha y hora
    let match = data.find(
      (item) =>
        item.Ejex.getFullYear() === ahora.getFullYear() &&
        item.Ejex.getMonth() === ahora.getMonth() &&
        item.Ejex.getDate() === ahora.getDate() &&
        item.Ejex.getHours() === ahora.getHours()
    );

    // Si no hay coincidencia exacta, buscar la fecha menor más cercana
    if (!match) {
      const fechaMasCercana = data
        .filter((item) => item.Ejex <= ahora)
        .sort((a, b) => b.Ejex.getTime() - a.Ejex.getTime()); // de mayor a menor
      match = fechaMasCercana[0]; // el más cercano hacia atrás
    }

    if (match && match.hh_lb_cum > 0) {
      return (match.hh_real_cum / match.hh_lb_cum) * 100;
    }

    return 0;
  }

  //---------------------------------------------

  React.useEffect(() => {
    const selectedArea = Array.from(AreaSeleccionada)[0];
    const selectedContratista = Array.from(ContratistaSeleccionado)[0];

    const fuenteDatos =
      chartConfig[activeChart].label === "Curva Real"
        ? data.General
        : data.Ajustada;

    const filtrado = fuenteDatos.filter((item) => {
      const matchArea = selectedArea ? item.Filtro02 === selectedArea : true;
      const matchContratista = selectedContratista
        ? item.Filtro01 === selectedContratista
        : true;
      return matchArea && matchContratista;
    });

    // setLineChartActiveDouble(
    //   filtrado.filter((item) => item.Ejex.getTime() !== 0)
    // );

    if (toggle === true) {
      const newArray = filtrado.map(({ hh_real, hh_lb, ...rest }) => rest);
      setLineChartActiveDouble(newArray);
    } else {
      setLineChartActiveDouble(filtrado);
    }
  }, [
    AreaSeleccionada,
    ContratistaSeleccionado,
    activeChart,
    data.General,
    data.Ajustada,
    toggle,
  ]);

  const total = {
    LineaBaseReal: `${totales.AvanceReal.toFixed(1)}%`,
    LineaBaseAjustada: `${totales.AvanceRealAjustado.toFixed(1)}%`,
  };

  return (
    <>
      {name !== "WhatIf" && (
        <div
          key={name}
          className="flex w-full items-center justify-start gap-2 mb-2"
        >
          <Dropdown>
            <DropdownTrigger className="">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="faded"
              >
                {Array.from(AreaSeleccionada).length === 1
                  ? AreaSeleccionada
                  : "Selecciona el Área"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={AreaSeleccionada}
              selectionMode="single"
              onSelectionChange={setAreaSeleccionada}
            >
              {ArrayAreas.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger className="">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="faded"
              >
                {Array.from(ContratistaSeleccionado).length === 1
                  ? ContratistaSeleccionado
                  : "Selecciona el contratista"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={ContratistaSeleccionado}
              selectionMode="single"
              onSelectionChange={setContratistaSeleccionado}
            >
              {ArrayContratista.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      )}

      {name === "WhatIf" && (
        <div
          key={name}
          className="flex w-full items-center justify-start gap-2 mb-2"
        >
          <Dropdown>
            <DropdownTrigger className="">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="faded"
              >
                {Array.from(AreaSeleccionada).length === 0
                  ? "Areas"
                  : "Selección Multiple de áreas"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={AreaSeleccionada}
              selectionMode="multiple"
              onSelectionChange={setAreaSeleccionada}
            >
              {ArrayAreas.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger className="">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="faded"
              >
                {Array.from(ContratistaSeleccionado).length === 0
                  ? "Contratistas"
                  : "Selección Multiple de contratistas"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={ContratistaSeleccionado}
              selectionMode="multiple"
              onSelectionChange={setContratistaSeleccionado}
            >
              {ArrayContratista.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      )}

      {name === "WhatIf" && (
        // <Button variant="faded" className="mb-4" onClick={() => UpdateCurvaS()}>
        //   Actualizar Curva S
        // </Button>
        <div
          className="flex items-center space-x-2 text-white border b-2 border-gray-500 rounded-2xl p-4 mt-2 mb-2"
          onClick={() => {
            UpdateCurvaS();
          }}
        >
          <ItemMedia
            className="border b-2 rounded-2xl text-black"
            variant="icon"
          >
            <RefreshCcw />
          </ItemMedia>
          <LabelChadCN htmlFor="airplane-mode" className="text-white">
            Actualizar curva S
          </LabelChadCN>
        </div>
      )}

      <Card className=" w-full">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Curva S con Barras</CardTitle>
            <CardDescription>
              Comparación entre línea base y real
            </CardDescription>
          </div>
          <div className="flex">
            {["AvanceReal", "AvanceRealAjustado"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => {
                    setLineChartActiveDouble(
                      chartConfig[chart].label === "Avance Real"
                        ? data.General.filter(
                            (item) => item.Ejex.getTime() !== 0
                          )
                        : data.Ajustada.filter(
                            (item) => item.Ejex.getTime() !== 0
                          )
                    );
                    setActiveChart(chart);
                  }}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {avanceTotal[key as keyof typeof avanceTotal]}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ComposedChart
              data={lineChartActive}
              margin={{ left: 12, right: 12, bottom: 24 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="Ejex"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                  });
                }}
                label={{
                  value: "Fechas",
                  position: "insideBottom",
                  offset: -10,
                  style: { fontWeight: "bold", fontSize: 12, fill: "#333" },
                }}
              />

              {/* Eje Y para las Barras */}
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value} hh`}
                label={{ value: "HH", angle: -90, position: "insideLeft" }}
              />

              {/* Eje Y para las Líneas */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value} hh`}
                label={{
                  value: "HH Acumuladas",
                  angle: 90,
                  position: "insideRight",
                  offset: -20,
                }}
              />

              <ChartTooltipRecharts
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />

              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                content={({ payload }) => (
                  <ul className="list-none m-0 p-0">
                    {payload?.map((entry, index) => {
                      const isCum = String(entry.dataKey).includes("cum");
                      return (
                        <li
                          key={`item-${index}`}
                          className="flex items-center mb-1"
                        >
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: isCum ? "50%" : "2px", // círculo para reales, cuadrado para plan
                              backgroundColor: entry.color,
                              marginRight: 8,
                            }}
                          />
                          <span className="text-sm">{entry.value}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                wrapperStyle={{
                  paddingLeft: 40,
                  paddingRight: -20,
                  lineHeight: "24px",
                }}
              />

              {/* Barras */}
              <Bar
                dataKey="hh_lb"
                fill="var(--color-desktop)"
                radius={4}
                yAxisId="left"
              />
              <Bar
                dataKey="hh_real"
                fill="var(--color-mobile)"
                radius={4}
                yAxisId="left"
              />
              {/* Línea */}
              <Line
                dataKey="hh_lb_cum"
                type="monotone"
                // stroke={`var(--color-${activeChart})`}
                stroke={`var(--color-desktop)`}
                strokeWidth={2}
                dot={true}
                yAxisId="right"
              />
              <Line
                dataKey="hh_real_cum"
                type="monotone"
                // stroke="var(--color-secondary)"
                stroke={`var(--color-mobile)`}
                strokeWidth={2}
                dot={true}
                yAxisId="right"
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
});

const BaymaxLoader = () => (
  <div className="fixed inset-0 bg-gray-700/60 z-40 grid place-items-center">
    <div className="flex flex-col items-center justify-center w-[600px] h-full z-50 absolute">
      {/* Cabeza de Baymax con relación 5:3 */}
      <div className="relative w-full aspect-[5/3] rounded-[50%/60%] bg-white shadow-md">
        <div className="absolute top-[45%] left-1/2 w-[60%] h-[8%] -translate-x-1/2 -translate-y-[30%] border-b-[1.5em] border-black baymax"></div>
      </div>
      <p className="mt-4 text-center text-white font-medium text-2xl ">
        Cargando...
      </p>
    </div>
  </div>
);

export default function Page() {
  const ArrayOpcionCurvas = [
    {
      value: "CurvaGeneral",
      label: "Curva S General",
    },
    {
      value: "CurvaArea",
      label: "Curva S por Área",
    },
    {
      value: "CurvaContratista",
      label: "Curva S por Contratista",
    },
    {
      value: "CurvaAreaContratista",
      label: "Curva S por Área y Contratista",
    },
    {
      value: "CurvaEspecialidadContratista",
      label: "Curva S por Especialidad y Contratista",
    },
    // {
    //   value: "WhatIf",
    //   label: "What If",
    // },
  ];

  const [opcionCurvas, setOpcionCurvas] = React.useState<Selection>(
    new Set([ArrayOpcionCurvas[0].value])
  );

  const [LineaCombinada, setLineaCombinada] = useState<TypeCurvaSGeneral>([]);
  const [LineaCombinadaAjustada, setLineaCombinadaAjustada] =
    useState<TypeCurvaSGeneral>([]);

  const [CurvaAreaTotal, setCurvaAreaTotal] = useState<TypeCurvaSGeneral>([]);
  const [CurvaAreaAjustada, setCurvaAreaAjustada] = useState<TypeCurvaSGeneral>(
    []
  );

  const [CurvaContratistaTotal, setCurvaContratistaTotal] =
    useState<TypeCurvaSGeneral>([]);
  const [CurvaContratistaAjustada, setCurvaContratistaAjustada] =
    useState<TypeCurvaSGeneral>([]);

  const [CurvaAreaContratistaTotal, setCurvaAreaContratistaTotal] =
    useState<TypeCurvaSGeneral>([]);
  const [CurvaAreaContratistaAjustada, setCurvaAreaContratistaAjustada] =
    useState<TypeCurvaSGeneral>([]);

  const [CurvaEspecialidadContratista, setCurvaEspecialidadContratista] =
    useState<TypeCurvaSGeneral>([]);
  const [
    CurvaEspecialidadContratistaAjustada,
    setCurvaEspecialidadContratistaAjustada,
  ] = useState<TypeCurvaSGeneral>([]);

  const [CurvaWhatIf, setCurvaWhatIf] = useState<TypeCurvaSGeneral>([]);
  const [CurvaWhatIfAjustada, setCurvaWhatIfAjustada] =
    useState<TypeCurvaSGeneral>([]);

  const [ValoresTotales, setValoresTotales] = useState<TypeValoresTotales>({
    AvanceReal: 0,
    AvanceRealAjustado: 0,
  });

  const [activities, setActivities] = useState<TypeActivities[]>([]);
  const [thirdparty, setThirdparty] = useState<TypeThirdParty[]>([]);
  const [especliadad, setEspecialidad] = useState<TypeEspecialidad[]>([]);

  const [isVisible, setIsVisible] = useState<Boolean>(true);

  const [ToggleBarras, setToggleBarras] = useState(false);

  const [ArraySPI, setArraySPI] = useState<SPIState>({
    CurvaGeneral: [],
    CurvaArea: [],
    CurvaContratista: [],
    CurvaAreaContratista: [],
    CurvaEspecialidadContratista: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const responseActivities = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/schedule`
      );

      const responseThirdParty = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/thirdparty`
      );

      const responseEspecialidad = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/especialidad`
      );

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_PY}/ParadaDePlanta/ProcesarLineaBase`
      );

      if (response.status === 200) {
        Object.keys(response.data).forEach((key) => {
          response.data[key].General.map((item: any) => {
            item.Ejex = new Date(item.Ejex);
          });
          response.data[key].Ajustada.map((item: any) => {
            item.Ejex = new Date(item.Ejex);
          });
        });

        console.log(response.data.CurvaGeneral.General);

        setLineaCombinada(response.data.CurvaGeneral.General);
        setLineaCombinadaAjustada(response.data.CurvaGeneral.Ajustada);

        setCurvaAreaTotal(response.data.CurvaArea.General);
        setCurvaAreaAjustada(response.data.CurvaArea.Ajustada);

        setCurvaContratistaTotal(response.data.CurvaContratista.General);
        setCurvaContratistaAjustada(response.data.CurvaContratista.Ajustada);

        setCurvaAreaContratistaTotal(
          response.data.CurvaAreaContratista.General
        );
        setCurvaAreaContratistaAjustada(
          response.data.CurvaAreaContratista.Ajustada
        );

        setCurvaEspecialidadContratista(
          response.data.CurvaEspecialidadContratista.General
        );
        setCurvaEspecialidadContratistaAjustada(
          response.data.CurvaEspecialidadContratista.Ajustada
        );

        setCurvaWhatIf(response.data.CurvaWhatIf.General);
        setCurvaWhatIfAjustada(response.data.CurvaWhatIf.Ajustada);

        setActivities(responseActivities.data.data);
        setThirdparty(responseThirdParty.data.Contratistas);
        setEspecialidad(responseEspecialidad.data.Especialidades);

        // console.log(response.data.CurvaContratista.General);
        // console.log(response.data.CurvaArea.General);
        //CurvaContratistaTotal

        const roundedDate = (date: Date) => {
          const fecha = new Date(date);
          if (
            (fecha.getMinutes() > 0 || fecha.getSeconds() > 0,
            fecha.getMilliseconds() > 0)
          ) {
            fecha.setHours(fecha.getHours() + 1);
          }
          fecha.setMinutes(0, 0, 0);
          return fecha;
        };

        const FunctionArrraySPIs = (
          Fecha: Date,
          CurvaRegular: TypeCurvaSGeneral,
          CurvaAjustada: TypeCurvaSGeneral
        ) => {
          console.log(CurvaRegular);
          const minDate = new Date(CurvaRegular[0].Ejex);
          const maxDate = new Date(CurvaRegular[CurvaRegular.length - 1].Ejex);

          console.log(
            "Fecha min: ",
            minDate,
            "Fecha max: ",
            maxDate,
            "Fecha: ",
            Fecha
          );

          if (Fecha < minDate) {
            // return 0;
          }
          if (Fecha > maxDate) {
            // return (
            //   CurvaRegular[CurvaRegular.length - 1].hh_real_cum /
            //   CurvaRegular[CurvaRegular.length - 1].hh_lb_cum
            // );
          }
          const match = CurvaRegular.filter(
            (obj: any) => new Date(obj.Ejex).getTime() === Fecha.getTime()
          );
          console.log(match);
          // if (match) return match.hh_real_cum / match.hh_lb_cum;
          if (match) return match;

          return null;
        };

        const now = new Date("2025-12-14");
        //const now = new Date();
        console.log(now);
        const DateRounded = roundedDate(now);

        const ArraySPIValueCurvaGeneral = FunctionArrraySPIs(
          DateRounded,
          response.data.CurvaGeneral.General,
          response.data.CurvaGeneral.Ajustada
        );

        const ArraySPIValueCurvaArea = FunctionArrraySPIs(
          DateRounded,
          response.data.CurvaArea.General,
          response.data.CurvaArea.Ajustada
        );

        const ArraySPIValueCurvaContratista = FunctionArrraySPIs(
          DateRounded,
          response.data.CurvaContratista.General,
          response.data.CurvaContratista.Ajustada
        );

        const ArraySPIValueCurvaAreaContratista = FunctionArrraySPIs(
          DateRounded,
          response.data.CurvaAreaContratista.General,
          response.data.CurvaAreaContratista.Ajustada
        );

        const ArraySPIValueCurvaEspecialidadContratista = FunctionArrraySPIs(
          DateRounded,
          response.data.CurvaEspecialidadContratista.General,
          response.data.CurvaEspecialidadContratista.Ajustada
        );

        setArraySPI({
          CurvaGeneral: ArraySPIValueCurvaGeneral ?? [],
          CurvaArea: ArraySPIValueCurvaArea ?? [],
          CurvaContratista: ArraySPIValueCurvaContratista ?? [],
          CurvaAreaContratista: ArraySPIValueCurvaAreaContratista ?? [],
          CurvaEspecialidadContratista:
            ArraySPIValueCurvaEspecialidadContratista ?? [],
        });

        setIsVisible(false);
      } else {
        console.log("Error");
      }
    };

    fetchData();
  }, []);

  const curvaSeleccionada = Array.from(opcionCurvas)[0] || "CurvaGeneral";

  const CurvaSMemo = useMemo(() => {
    const curvaMap: Record<string, JSX.Element> = {
      CurvaGeneral: (
        <CurvaSUnaVariable
          key="CurvaGeneral"
          name="CurvaGeneral"
          data={{ General: LineaCombinada, Ajustada: LineaCombinadaAjustada }}
          totales={ValoresTotales}
          toggle={ToggleBarras}
        />
      ),
      CurvaArea: (
        <CurvaSUnaVariable
          key="CurvaArea"
          name="CurvaArea"
          data={{ General: CurvaAreaTotal, Ajustada: CurvaAreaAjustada }}
          totales={ValoresTotales}
          toggle={ToggleBarras}
        />
      ),
      CurvaContratista: (
        <CurvaSUnaVariable
          key="CurvaContratista"
          name="CurvaContratista"
          data={{
            General: CurvaContratistaTotal,
            Ajustada: CurvaContratistaAjustada,
          }}
          totales={ValoresTotales}
          toggle={ToggleBarras}
        />
      ),
      CurvaAreaContratista: (
        <CurvaSDosVariable
          key="CurvaAreaContratista"
          name="CurvaAreaContratista"
          data={{
            General: CurvaAreaContratistaTotal,
            Ajustada: CurvaAreaContratistaAjustada,
          }}
          totales={ValoresTotales}
          toggle={ToggleBarras}
        />
      ),
      CurvaEspecialidadContratista: (
        <CurvaSDosVariable
          key="CurvaEspecialidadContratista"
          name="CurvaEspecialidadContratista"
          data={{
            General: CurvaEspecialidadContratista,
            Ajustada: CurvaEspecialidadContratistaAjustada,
          }}
          totales={ValoresTotales}
          toggle={ToggleBarras}
        />
      ),
      WhatIf: (
        <CurvaSDosVariable
          key="WhatIf"
          name="WhatIf"
          data={{
            General: CurvaWhatIf,
            Ajustada: CurvaWhatIfAjustada,
          }}
          totales={ValoresTotales}
          toggle={ToggleBarras}
        />
      ),
    };

    return curvaMap[curvaSeleccionada] ?? null;
  }, [
    curvaSeleccionada,
    LineaCombinada,
    LineaCombinadaAjustada,
    CurvaAreaTotal,
    CurvaAreaAjustada,
    CurvaContratistaTotal,
    CurvaContratistaAjustada,
    ValoresTotales,

    CurvaAreaContratistaTotal,
    CurvaAreaContratistaAjustada,
    CurvaEspecialidadContratista,
    CurvaEspecialidadContratistaAjustada,

    ToggleBarras,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white text-center mt-8 mb-4">
        Dashboard de Parada de Planta
      </h1>

      <h3 className="text-white">titulo de prueba</h3>

      {isVisible && (
        <div className="w-[600px]">
          <BaymaxLoader />
        </div>
      )}

      {!isVisible && (
        <div className="w-5/6 flex flex-col items-center">
          {/* Botones */}
          <div className="mb-2 mt-8 flex flex-col items-center">
            <h3 className="text-white mb-2">Selecciona tipo de Curva S</h3>
            <Dropdown>
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  {Array.from(opcionCurvas).length === 0
                    ? "Opciones de Curva"
                    : opcionCurvas}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={true}
                selectedKeys={opcionCurvas}
                selectionMode="single"
                onSelectionChange={setOpcionCurvas}
              >
                {ArrayOpcionCurvas.map((opcion) => (
                  <DropdownItem key={opcion.value} className="capitalize">
                    {opcion.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Curvas */}
          <div className="w-5/6">
            {CurvaSMemo}
            <div className="flex items-center space-x-2 text-white border b-2 border-gray-500 rounded-2xl p-4 mt-2">
              <Switch
                onCheckedChange={() => {
                  setToggleBarras(!ToggleBarras);
                }}
                id="airplane-mode"
              />
              <LabelChadCN htmlFor="airplane-mode" className="text-white">
                {ToggleBarras === true
                  ? "Activar barras de avace"
                  : "Desactivar barras de avace"}
              </LabelChadCN>
            </div>
          </div>

          {/* Tablas */}
          <div className="w-5/6 flex flex-col md:grid grid-flow-row-dense grid-cols-2 gap-4">
            {/* Actividades atrasadas */}
            <div className="bg-white p-4 mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
              <h3 className="text-xl font-bold text-black">
                Listado de actividades atrasadas
              </h3>
              <Table className="rounded-lg">
                <TableCaption>{`Cantidad actividades canceladas: ${
                  activities.filter((item) => item.ActividadCancelada == "Si")
                    .length
                }`}</TableCaption>

                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Descripcion</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Avance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities
                    .filter((item) => item.estado === "Cancelado")
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.contratista}</TableCell>
                        <TableCell>{item.descripcion}</TableCell>
                        <TableCell>{item.estado}</TableCell>
                        <TableCell className="text-center">
                          {item.avance}%
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                {/* <TableFooter>
              <TableRowCdn>
                <TableCellCdn colSpan={3}>Total</TableCellCdn>
                <TableCellCdn className="text-right">$2,500.00</TableCellCdn>
              </TableRowCdn>
            </TableFooter> */}
              </Table>
            </div>

            {/* SPI por Área */}
            <div className="bg-white p-4 mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
            <h3 className="text-xl font-bold text-black">
                SPI por Área
              </h3>
              <Table className="rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>SPI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ArraySPI.CurvaArea.map((item) => (
                    <TableRow key={item.Filtro01}>
                      <TableCell className="font-medium">
                        {item.Filtro01}
                      </TableCell>
                      <TableCell>
                        {(item.hh_real_cum / item.hh_lb_cum).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* SPI por Contratista */}
            <div className="bg-white p-4 mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
              <h3 className="text-xl font-bold text-black">
                SPI por Contratista
              </h3>
              <Table className="rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Contratista</TableHead>
                    <TableHead>SPI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ArraySPI.CurvaContratista.map((item) => (
                    <TableRow key={item.Filtro01}>
                      <TableCell className="font-medium">
                        {item.Filtro01}
                      </TableCell>
                      <TableCell>
                        {(item.hh_real_cum / item.hh_lb_cum).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* por Area y Contratista */}
            <div className="bg-white p-4 mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
               <h3 className="text-xl font-bold text-black">
                SPI por Contratista/Área
              </h3>
              <Table className="rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Contratista</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>SPI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ArraySPI.CurvaAreaContratista.filter((item)=> item.hh_lb_cum > 0).map((item) => (
                    <TableRow key={item.Filtro01}>
                      <TableCell className="font-medium">
                        {item.Filtro01}
                      </TableCell>
                         <TableCell className="font-medium">
                        {item.Filtro02}
                      </TableCell>
                      <TableCell>
                        {(item.hh_real_cum / item.hh_lb_cum).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* por especialidad y Contratista */}
            <div className="bg-white p-4 mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
                <h3 className="text-xl font-bold text-black">
                SPI por Contratista/Especialidad
              </h3>
              <Table className="rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Contratista</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>SPI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ArraySPI.CurvaEspecialidadContratista.filter((item)=> item.hh_lb_cum > 0).map((item) => (
                    <TableRow key={item.Filtro01}>
                      <TableCell className="font-medium">
                        {item.Filtro01}
                      </TableCell>
                         <TableCell className="font-medium">
                        {item.Filtro02}
                      </TableCell>
                      <TableCell>
                        {(item.hh_real_cum / item.hh_lb_cum).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

//---------------------------------------------------------------------------------------------

{
  /* <div className="w-4/5 grid gap-4 grid-cols-1 p-8 rounded-lg border-2 border-slate-300 mr-auto ml-auto md:grid-cols-2"> */
}
{
  /* <div className="w-5/6 h-full"> */
}
{
  /* <ChartLine data={LineaCombinada} /> */
}
{
  /* <ChartLIneInteractive LineaBase={LineaBase} LineaReal={LineaReal} />
        <ChartDobleLine data={LineaCombinada} />
        <ChartPie />
        <ChartBar data={LineaCombinada} />
        <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
          <ChartRadar />
          <ChartRadialGrid />
          <ChartRadialShape />
        </div> */
}
{
  /* <CombinedChart data={LineaCombinada} /> */
}

{
  /* <div className="w-full md:w-4/5 grid mx-auto p-8">
        <ChartLIneInteractive LineaBase={LineaBase} LineaReal={LineaReal} />
        <TableDemo />
      </div> */
}
{
  /* </div> */
}
