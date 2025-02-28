"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import axios from "axios";

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

type TypeLineaBase = {
  Ejex: Date;
  hh: number;
  "hh cum": number;
}[];

type TypeLineaCombinada = {
  Ejex: Date;
  hh_lb: number;
  hh_lb_cum: number;
  hh_real: number;
  hh_real_cum: number;
}[];

type ChartLineCombinadaProps = {
  data: {
    LineaCombinada: TypeLineaCombinada;
    LineaCombinadaAjustada: TypeLineaCombinada;
  };
};

type ChartLineProps = {
  data: TypeLineaBase;
};

type ChartLineMultipleProps = {
  LineaBase: TypeLineaBase;
  LineaReal: TypeLineaBase;
};

// export function ChartLine({ data }: ChartLineProps) {
//   return (
//     <>
//       <Card className="">
//         <CardHeader>
//           <CardTitle>Linea Base General</CardTitle>
//           <CardDescription>PdP Enero 2025</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer config={chartConfig}>
//             <LineChart
//               accessibilityLayer
//               // data={chartData}
//               data={data}
//               margin={{
//                 left: 12,
//                 right: 12,
//               }}
//             >
//               <CartesianGrid vertical={false} />
//               <XAxis
//                 // dataKey="month"
//                 dataKey="Ejex"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 // tickFormatter={(value: any) => value.slice(0, 3)}
//                 tickFormatter={(value) => {
//                   const date = new Date(value);
//                   return date.toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                   });
//                 }}
//               />
//               <ChartTooltip
//                 cursor={false}
//                 content={<ChartTooltipContent hideLabel />}
//               />
//               <Line
//                 // dataKey="desktop"
//                 dataKey="hh cum"
//                 type="monotone"
//                 stroke="var(--color-desktop)"
//                 strokeWidth={2}
//                 dot={{
//                   fill: "var(--color-desktop)",
//                 }}
//                 activeDot={{
//                   r: 6,
//                 }}
//               />
//               <ChartLegend
//                 content={
//                   <ChartLegendContent
//                     //  nameKey="desktop"
//                     nameKey="hh cum"
//                   />
//                 }
//               />
//             </LineChart>
//           </ChartContainer>
//         </CardContent>
//         <CardFooter className="flex-col items-start gap-2 text-sm">
//           <div className="flex gap-2 font-medium leading-none">
//             Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//           </div>
//           <div className="leading-none text-muted-foreground">
//             Showing total visitors for the last 6 months
//           </div>
//         </CardFooter>
//       </Card>

//       <Card className="">
//         <CardHeader>
//           <CardTitle>Line Chart - Dots</CardTitle>
//           <CardDescription>January - June 2024</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer config={chartConfig}>
//             <LineChart
//               accessibilityLayer
//               data={chartData}
//               margin={{
//                 left: 12,
//                 right: 12,
//               }}
//             >
//               <CartesianGrid vertical={false} />
//               <XAxis
//                 dataKey="month"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 tickFormatter={(value: any) => value.slice(0, 3)}
//               />
//               <ChartTooltip
//                 cursor={false}
//                 content={<ChartTooltipContent hideLabel />}
//               />
//               <Line
//                 dataKey="mobile"
//                 type="natural"
//                 stroke="var(--color-desktop)"
//                 strokeWidth={2}
//                 dot={{
//                   fill: "var(--color-desktop)",
//                 }}
//                 activeDot={{
//                   r: 6,
//                 }}
//               />
//             </LineChart>
//           </ChartContainer>
//         </CardContent>
//         <CardFooter className="flex-col items-start gap-2 text-sm">
//           <div className="flex gap-2 font-medium leading-none">
//             Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//           </div>
//           <div className="leading-none text-muted-foreground">
//             Showing total visitors for the last 6 months
//           </div>
//         </CardFooter>
//       </Card>
//     </>
//   );
// }

// export function ChartLIneInteractive({
//   LineaBase,
//   LineaReal,
// }: ChartLineMultipleProps) {
//   const [activeChart, setActiveChart] =
//     React.useState<keyof typeof chartConfig>("LineaBaseReal");
//   const [LineChartActive, setLineChartActive] = useState(LineaBase);

//   React.useEffect(() => {
//     setLineChartActive(LineaBase);
//   }, [LineaBase, LineaReal]);

//   const total = React.useMemo(
//     () => ({
//       LineaBaseReal: "70%",
//       LineaBaseAjustada: "80%",
//     }),
//     []
//   );
//   return (
//     <Card className="">
//       <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
//         <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
//           <CardTitle>Curva S General</CardTitle>
//           <CardDescription>
//             Línea Base real y Línea base ajustada
//           </CardDescription>
//         </div>
//         <div className="flex">
//           {["LineaBaseReal", "LineaBaseAjustada"].map((key) => {
//             const chart = key as keyof typeof chartConfig;
//             return (
//               <button
//                 key={chart}
//                 data-active={activeChart === chart}
//                 className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
//                 onClick={() => {
//                   if (chartConfig[chart].label === "Curva Real") {
//                     setLineChartActive(LineaBase);
//                     setActiveChart(chart);
//                   } else {
//                     setLineChartActive(LineaReal);
//                     setActiveChart(chart);
//                   }
//                 }}
//               >
//                 <span className="text-xs text-muted-foreground">
//                   {chartConfig[chart].label}
//                 </span>
//                 <span className="text-lg font-bold leading-none sm:text-3xl">
//                   {total[key as keyof typeof total].toLocaleString()}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </CardHeader>
//       <CardContent className="px-2 sm:p-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[250px] w-full"
//         >
//           <LineChart
//             accessibilityLayer
//             data={LineChartActive}
//             margin={{
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="Ejex"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 const date = new Date(value);
//                 return date.toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                 });
//               }}
//             />
//             <ChartTooltip
//               content={
//                 <ChartTooltipContent
//                   className="w-[150px]"
//                   nameKey="Ejex"
//                   labelFormatter={(value) => {
//                     console.log(value);
//                     const date = new Date(value);
//                     return date.toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     });
//                   }}
//                 />
//               }
//             />
//             <Line
//               dataKey={"hh"}
//               type="monotone"
//               stroke={`var(--color-${activeChart})`}
//               strokeWidth={2}
//               dot={true}
//             />
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

// export function ChartDobleLine({ data }: ChartLineCombinadaProps) {
//   return (
//     <Card className="">
//       <CardHeader>
//         <CardTitle>Line Chart - Multiple</CardTitle>
//         <CardDescription>PdP Sulfuros</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <LineChart
//             accessibilityLayer
//             data={data}
//             margin={{
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="Ejex"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tickFormatter={(value) => {
//                 const date = new Date(value);
//                 return date.toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                 });
//               }}
//             />
//             <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
//             <Line
//               dataKey="hh_lb_cum"
//               type="monotone"
//               stroke="var(--color-desktop)"
//               strokeWidth={2}
//               dot={false}
//             />
//             <Line
//               dataKey="hh_real_cum"
//               type="monotone"
//               stroke="var(--color-mobile)"
//               strokeWidth={2}
//               dot={false}
//             />
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter>
//         <div className="flex w-full items-start gap-2 text-sm">
//           <div className="grid gap-2">
//             <div className="flex items-center gap-2 font-medium leading-none">
//               Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//             </div>
//             <div className="flex items-center gap-2 leading-none text-muted-foreground">
//               Showing total visitors for the last 6 months
//             </div>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// export function ChartBar({ data }: ChartLineCombinadaProps) {
//   return (
//     <Card className="">
//       <CardHeader>
//         <CardTitle>Bar Chart - Multiple</CardTitle>
//         <CardDescription>PdP Sulfuros Enero</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart accessibilityLayer data={data}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="Ejex"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => {
//                 const date = new Date(value);
//                 return date.toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                 });
//               }}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent indicator="dot" />}
//             />
//             <Bar dataKey="hh_lb" fill="var(--color-desktop)" radius={4} />
//             <Bar dataKey="hh_real" fill="var(--color-mobile)" radius={4} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

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

// export function CombinedChart({ LineaCombinada }: ChartLineCombinadaProps) {
//   return (
//     <Card className="">
//       <CardHeader>
//         <CardTitle>Combined Bar and Line Chart</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <ComposedChart data={data}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="Ejex"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => {
//                 const date = new Date(value);
//                 return date.toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                 });
//               }}
//             />
//             <YAxis
//               yAxisId="left"
//               orientation="left"
//               tickLine={false}
//               axisLine={false}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               tickLine={false}
//               axisLine={false}
//             />
//             <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

//             {/* Gráfico de barras */}
//             <Bar
//               yAxisId="left"
//               dataKey="hh_lb"
//               fill="var(--color-desktop)"
//               radius={4}
//             />
//             <Bar
//               yAxisId="left"
//               dataKey="hh_real"
//               fill="var(--color-mobile)"
//               radius={4}
//             />

//             {/* Gráfico de líneas */}
//             <Line
//               yAxisId="right"
//               dataKey="hh_lb_cum"
//               type="monotone"
//               stroke="var(--color-desktop)"
//               strokeWidth={2}
//               dot={false}
//             />
//             <Line
//               yAxisId="right"
//               dataKey="hh_real_cum"
//               type="monotone"
//               stroke="var(--color-mobile)"
//               strokeWidth={2}
//               dot={false}
//             />
//           </ComposedChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// export function TableDemo() {
//   return (
//     <Table>
//       <TableCaption>A list of your recent invoices.</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[100px]">Invoice</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Method</TableHead>
//           <TableHead className="text-right">Amount</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {invoices.map((invoice) => (
//           <TableRow key={invoice.invoice}>
//             <TableCell className="font-medium">{invoice.invoice}</TableCell>
//             <TableCell>{invoice.paymentStatus}</TableCell>
//             <TableCell>{invoice.paymentMethod}</TableCell>
//             <TableCell className="text-right">{invoice.totalAmount}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//       <TableFooter>
//         <TableRow>
//           <TableCell colSpan={3}>Total</TableCell>
//           <TableCell className="text-right">$2,500.00</TableCell>
//         </TableRow>
//       </TableFooter>
//     </Table>
//   );
// }
function ChartInteractivoCombinado({ data }: ChartLineCombinadaProps) {
  console.log(data);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("LineaBaseReal");
  const [lineChartActive, setLineChartActive] = useState(data.LineaCombinada);

  React.useEffect(() => {
    setLineChartActive(data.LineaCombinada);
  }, [data.LineaCombinada, data.LineaCombinadaAjustada]);

  const total = React.useMemo(
    () => ({
      LineaBaseReal: "70%",
      LineaBaseAjustada: "80%",
    }),
    []
  );

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Curva S con Barras</CardTitle>
          <CardDescription>Comparación entre línea base y real</CardDescription>
        </div>
        <div className="flex">
          {["LineaBaseReal", "LineaBaseAjustada"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => {
                  setLineChartActive(
                    chartConfig[chart].label === "Curva Real"
                      ? data.LineaCombinada
                      : data.LineaCombinadaAjustada
                  );
                  setActiveChart(chart);
                }}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
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
            margin={{ left: 12, right: 12 }}
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
                });
              }}
            />

            {/* Eje Y para las Barras */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            {/* Eje Y para las Líneas */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltipRecharts
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
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
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={true}
              yAxisId="right"
            />
            <Line
              dataKey="hh_real_cum"
              type="monotone"
              stroke="var(--color-secondary)"
              strokeWidth={2}
              dot={true}
              yAxisId="right"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  // const [LineaBase, setLineaBase] = useState<TypeLineaBase>([]);
  // const [LineaReal, setLineaReal] = useState<TypeLineaBase>([]);
  const [LineaCombinada, setLineaCombinada] = useState<TypeLineaCombinada>([]);
  const [LineaCombinadaAjustada, setLineaCombinadaAjustada] =
    useState<TypeLineaCombinada>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_PY}/ParadaDePlanta/ProcesarLineaBase`
      );
      if (response.status === 200) {
        // response.data.df_LineaBase.map(
        //   (item: any) => (item.Ejex = new Date(item.Ejex))
        // );
        // response.data.df_Real.map(
        //   (item: any) => (item.Ejex = new Date(item.Ejex))
        // );
        response.data.df_Combinado.map(
          (item: any) => (item.Ejex = new Date(item.Ejex))
        );
        response.data.df_CombinadoAjustada.map(
          (item: any) => (item.Ejex = new Date(item.Ejex))
        );

        // setLineaBase(response.data.df_LineaBase);
        // setLineaReal(response.data.df_Real);
        console.log(response.data.df_Combinado);
        console.log(response.data.df_CombinadoAjustada);
        setLineaCombinada(response.data.df_Combinado);
        setLineaCombinadaAjustada(response.data.df_CombinadoAjustada);
      } else {
        console.log("Error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white text-center mt-8">
        Dashboard PdP
      </h1>
      <div className="mt-8 w-5/6">
        <ChartInteractivoCombinado
          data={{ LineaCombinada, LineaCombinadaAjustada }}
        />
      </div>

      <div className="w-5/6 flex flex-row items-center gap-4">
        <div className="bg-white p-4 mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
          <Label className="text-2xl font-bold text-white">Listado de SP</Label>
          <Table className="rounded-lg">
            <TableCaption>
              Solamente se muestran las SPs aprobadas (todos los montos estan en
              USD)
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Pos</TableHead>
                <TableHead>Partida</TableHead>
                <TableHead>Texto Breve</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((item) => (
                <TableRow key={item.invoice}>
                  <TableCell className="font-medium">{item.invoice}</TableCell>
                  <TableCell>{item.paymentMethod}</TableCell>
                  <TableCell>{item.invoice}</TableCell>
                  <TableCell>{item.paymentStatus}</TableCell>
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

        <div className="bg-white p-4 mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
          <Label className="text-2xl font-bold text-white">Listado de OC</Label>
          <Table className="rounded-lg">
            <TableCaption>(todos los montos estan en USD)</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Pos</TableHead>
                <TableHead>Partida</TableHead>
                <TableHead>Texto Breve</TableHead>
                <TableHead>Proveedor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((item) => (
                <TableRow key={item.invoice}>
                  <TableCell className="font-medium">{item.invoice}</TableCell>
                  <TableCell>{item.paymentMethod}</TableCell>
                  <TableCell>{item.invoice}</TableCell>
                  <TableCell>{item.paymentStatus}</TableCell>
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
      </div>

      {/* <div className="w-4/5 grid gap-4 grid-cols-1 p-8 rounded-lg border-2 border-slate-300 mr-auto ml-auto md:grid-cols-2"> */}
      <div>
        {/* <ChartLine data={LineaBase} />
        <ChartLIneInteractive LineaBase={LineaBase} LineaReal={LineaReal} />
        <ChartDobleLine data={LineaCombinada} />
        <ChartPie />
        <ChartBar data={LineaCombinada} />
        <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
          <ChartRadar />
          <ChartRadialGrid />
          <ChartRadialShape />
        </div> */}
        {/* <CombinedChart data={LineaCombinada} /> */}

        {/* <div className="w-full md:w-4/5 grid mx-auto p-8">
        <ChartLIneInteractive LineaBase={LineaBase} LineaReal={LineaReal} />
        <TableDemo />
      </div> */}
      </div>
    </div>
  );
}
