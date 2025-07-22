"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  ImageIcon,
  FileText,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react";
import { format, set } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";

// Tipos de datos
interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Submission {
  _id: string;
  // nombre: string;
  // usuario: string;
  empresa: string;
  area:string;
  descripcion: string;
  categoria: string;
  // prioridad: string;
  fecha: Date;
  FilesData: FileAttachment[];
  // estado: "pendiente" | "en_proceso" | "completado" | "rechazado";
}

// Datos de ejemplo
// const mockSubmissions: Submission[] = [
//   {
//     _id: "1",
//     // nombre: "Juan Pérez",
//     // usuario: "juan.perez@email.com",
//     empresa: "TechCorp SA",
//     descripcion: "Solicitud de revisión de documentos para el proyecto Alpha.",
//     categoria: "Documentación",
//     // prioridad: "Alta",
//     fecha: new Date("2024-01-15"),
//     // estado: "pendiente",
//     FilesData: [
//       {
//         id: "f1",
//         name: "propuesta-proyecto.pdf",
//         type: "application/pdf",
//         size: 2048576,
//         url: "/placeholder.svg?height=300&width=400&text=Propuesta+Proyecto",
//       },
//       {
//         id: "f3",
//         name: "Vaquita.png",
//         type: "image/png",
//         size: 512000,
//         url: "https://media.istockphoto.com/id/1402436756/es/foto/carga-de-documentos-desde-la-carpeta-abra-la-carpeta-archivo-con-documentos-en-blanco.jpg?b=1&s=612x612&w=0&k=20&c=MsBlrt9bWQK8Dd_THdoMthVDY4xb8pdLq7-Kv8rXLOo=",
//       },
//     ],
//   },

//   {
//     _id: "2",
//     // nombre: "María González",
//     // usuario: "maria.gonzalez@email.com",
//     empresa: "InnovaCorp",
//     descripcion: "Envío de reportes mensuales y análisis de métricas.",
//     categoria: "Reportes",
//     // prioridad: "Media",
//     fecha: new Date("2024-01-14"),
//     // estado: "en_proceso",
//     FilesData: [
//       {
//         id: "f4",
//         name: "reporte-enero.pdf",
//         type: "application/pdf",
//         size: 3072000,
//         url: "/placeholder.svg?height=300&width=400&text=Reporte+Enero",
//       },
//       {
//         id: "f5",
//         name: "graficos-metricas.jpg",
//         type: "image/jpeg",
//         size: 768000,
//         url: "/placeholder.svg?height=300&width=400&text=Gráficos+Métricas",
//       },
//     ],
//   },
//   {
//     _id: "3",
//     // nombre: "Carlos Rodríguez",
//     // usuario: "carlos.rodriguez@email.com",
//     empresa: "TechCorp SA",
//     descripcion: "Solicitud de soporte técnico para resolver problemas.",
//     categoria: "Soporte Técnico",
//     // prioridad: "Baja",
//     fecha: new Date("2024-01-13"),
//     // estado: "completado",
//     FilesData: [
//       {
//         id: "f6",
//         name: "captura-error.png",
//         type: "image/png",
//         size: 256000,
//         url: "/placeholder.svg?height=300&width=400&text=Captura+Error",
//       },
//     ],
//   },
//   {
//     _id: "4",
//     // nombre: "Ana Martínez",
//     // usuario: "ana.martinez@email.com",
//     empresa: "DataSolutions",
//     descripcion: "Análisis de datos del primer trimestre.",
//     categoria: "Análisis",
//     // prioridad: "Alta",
//     fecha: new Date("2024-01-12"),
//     // estado: "completado",
//     FilesData: [
//       {
//         id: "f7",
//         name: "analisis-q1.png",
//         type: "image/png",
//         size: 1024000,
//         url: "/placeholder.svg?height=300&width=400&text=Análisis+Q1",
//       },
//       {
//         id: "f8",
//         name: "dashboard.jpg",
//         type: "image/jpeg",
//         size: 2048000,
//         url: "/placeholder.svg?height=300&width=400&text=Dashboard+Métricas",
//       },
//     ],
//   },
//   {
//     _id: "5",
//     // nombre: "Luis Torres",
//     // usuario: "luis.torres@email.com",
//     empresa: "InnovaCorp",
//     descripcion: "Documentación técnica del nuevo sistema.",
//     categoria: "Documentación",
//     // prioridad: "Media",
//     fecha: new Date("2024-01-11"),
//     // estado: "pendiente",
//     FilesData: [
//       {
//         id: "f9",
//         name: "arquitectura.png",
//         type: "image/png",
//         size: 1536000,
//         url: "/placeholder.svg?height=300&width=400&text=Arquitectura+Sistema",
//       },
//     ],
//   },
//   {
//     _id: "6",
//     // nombre: "Sofia Herrera",
//     // usuario: "sofia.herrera@email.com",
//     empresa: "DataSolutions",
//     descripcion: "Reporte de incidencias del sistema.",
//     categoria: "Reportes",
//     // prioridad: "Alta",
//     fecha: new Date("2024-01-10"),
//     // estado: "en_proceso",
//     FilesData: [],
//   },
// ];

const CHART_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function SubmissionsPage() {
  const [submissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [records, SetRecords] = useState<Submission[]>([]);
  const [totalPages, settotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, []);

  async function fetchData(page: number, RowPerPage: number) {
    const RowPerPageValue = RowPerPage || 5;
    let URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/getalldatainspeccion?page=${page}&perPage=${RowPerPageValue}`;

    console.log(searchTerm);

    if (searchTerm) {
      URL = `${URL}&empresa=${searchTerm}`;
    }

    console.log(URL);

    const response = await axios.get(URL);

    console.log(response.data);

    SetRecords(response.data.docs);
    settotalPages(response.data.totalPages);
    setTotalRecords(response.data.totalDocs);
  }

  // Filtrar envíos por búsqueda
  // const filteredSubmissions = useMemo(() => {
  //   // return submissions.filter(
  //   //   (submission) =>
  //   //     submission.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   //     submission.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   //     submission.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   //     submission.comentarios.toLowerCase().includes(searchTerm.toLowerCase())
  //   // );
  //   fetchData(1, itemsPerPage);
  //   return records;
  // }, [submissions, searchTerm,itemsPerPage]);

  // Paginación
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
      fetchData(currentPage, itemsPerPage);
    // return records.slice(startIndex, endIndex);
     return records;
  }, [ currentPage, itemsPerPage]);

  // const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Datos para gráfico circular (por empresa)
  const companyData = useMemo(() => {
    const companyCounts = records.reduce((acc, submission) => {
      acc[submission.empresa] = (acc[submission.empresa] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(companyCounts).map(([empresa, count]) => ({
      name: empresa,
      value: count,
    }));
  }, [records]);

  // Datos para gráfico de barras (por categoría)
  const categoryData = useMemo(() => {
    const filteredData =
      selectedCategories.length > 0
        ? records.filter((s) => selectedCategories.includes(s.categoria))
        : records;

    const categoryCounts = filteredData.reduce((acc, submission) => {
      acc[submission.categoria] = (acc[submission.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([categoria, count]) => ({
      categoria,
      count,
    }));
  }, [records, selectedCategories]);

  // Obtener todas las categorías únicas
  const allCategories = useMemo(() => {
    return Array.from(new Set(records.map((s) => s.categoria)));
  }, [records]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "en_proceso":
        return "bg-blue-100 text-blue-800";
      case "completado":
        return "bg-green-100 text-green-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Media":
        return "bg-orange-100 text-orange-800";
      case "Baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImageFiles = (archivos: FileAttachment[]) => {
    return archivos.filter((file) => file.type.startsWith("image/"));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  //className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center p-4
  //container mx-auto p-6 space-y-6
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-5/6 mx-auto mt-6 text-white">
        <h1 className="text-3xl font-bold">Reportes de Envíos</h1>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar reportes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-600 border-1 b-rounded-lg bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla de reportes */}
      <Card className="w-5/6 mx-auto mt-6 mb-6 bg-white shadow-lg">
        <CardHeader>
          <CardTitle>
            Lista de Reportes ({totalRecords} total, mostrando{" "}
            {records.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Categoría</TableHead>
                {/* <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead> */}
                <TableHead>Fecha</TableHead>
                <TableHead>Archivos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((submission) => {
                const imageFiles = getImageFiles(submission.FilesData);
                return (
                  <TableRow
                    key={submission._id}
                    className="hover:bg-gray-50 relative"
                    onMouseMove={(e) => {
                      setTooltipPosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseEnter={() => setHoveredRow(submission._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <TableCell className="font-medium">
                      {submission.empresa}
                    </TableCell>
                    <TableCell>{submission.area}</TableCell>
                    <TableCell>{submission.categoria}</TableCell>
                    <TableCell>
                      {/* <Badge className={getStatusColor(submission.estado)}>
                        {submission.estado.replace("_", " ")}
                      </Badge> */}
                    </TableCell>
                    <TableCell>
                      {/* <Badge className={getPriorityColor(submission.prioridad)}>
                        {submission.prioridad}
                      </Badge> */}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(submission.fecha, "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="relative">
                      <div className="flex items-center gap-2">
                        {submission.FilesData.length > 0 && (
                          <>
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">
                              {submission.FilesData.length}
                            </span>
                          </>
                        )}
                        {imageFiles.length > 0 && (
                          <>
                            <ImageIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-600">
                              {imageFiles.length}
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {/* Controles de paginación */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Mostrando{" "}
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  records.length
                )}{" "}
                a{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  records.length
                )}{" "}
                de {records.length} resultados
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filas por página:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
          {/* Hover overlay con imágenes - fuera de la tabla */}
          {hoveredRow && (
            <div className="fixed z-50 pointer-events-none">
              {(() => {
                const submission = records.find(
                  (s) => s._id === hoveredRow
                );
                const imageFiles = submission
                  ? getImageFiles(submission.FilesData)
                  : [];

                if (!submission || imageFiles.length === 0) return null;

                return (
                  <div
                    className="absolute bg-white border rounded-lg shadow-lg p-3 min-w-[300px]"
                    // style={{
                    //   left: "100%",
                    //   top: "0",
                    //   marginLeft: "8px",
                    // }}

                    style={{
                      left: `${tooltipPosition.x + 10}px`,
                      top: `${tooltipPosition.y + 10}px`,
                      position: "fixed", // importante para que se posicione respecto a la ventana
                    }}
                  >
                    <div className="text-sm font-medium mb-2">
                      Imágenes adjuntas:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {imageFiles.slice(0, 4).map((file) => (
                        <div key={file.id} className="space-y-1">
                          <img
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <div className="text-xs text-gray-600 truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}
                      {imageFiles.length > 4 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded h-20">
                          <span className="text-sm text-gray-600">
                            +{imageFiles.length - 4} más
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-5/6 mx-auto mb-6">
        {/* Gráfico circular - Reportes por empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes por Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Reportes",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {companyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de barras - Reportes por categoría */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reportes por Categoría</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-transparent"
                >
                  Filtrar <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar categoría..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                    <CommandGroup>
                      {allCategories.map((category) => (
                        <CommandItem
                          key={category}
                          onSelect={() => handleCategoryToggle(category)}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                            />
                            <span>{category}</span>
                          </div>
                          {selectedCategories.includes(category) && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Cantidad",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="categoria"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            {selectedCategories.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Mostrando: {selectedCategories.join(", ")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
