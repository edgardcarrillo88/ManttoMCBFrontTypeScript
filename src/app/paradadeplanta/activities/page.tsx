"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
  SortDescriptor,
} from "@nextui-org/table";

import { Label } from "@/components/ui/label";

import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

import { Input } from "@nextui-org/input";
import { Chip, ChipProps } from "@nextui-org/chip";

import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { FileSpreadsheet } from "lucide-react";

import { VerticalDotsIcon } from "@/components/table/utils/VerticalDotsIcon";
import { ChevronDownIcon } from "@/components/table/utils/ChevronDownIcon";
import { ClearFiltersIcon } from "@/components/table/utils/ClearFiltersIcon";
import { SearchIcon } from "@/components/table/utils/SearchIcon";
import { capitalize } from "@/components/table/utils/utils";

import { ProtectedRouteComponentemail } from "@/components/protected-route-email";

import { useRouter } from "next/navigation";
// import * as XLSX from "xlsx";
// import XLSX from "xlsx-style";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import LoadFile from "@/components/loadfile/page";
import { Spinner } from "@nextui-org/spinner";

import {
  Table as TableChadcn,
  TableBody as TableBodyChadcn,
  TableCaption as TableCaptionChadcn,
  TableCell as TableCellChadcn,
  TableFooter as TableFooterChadcn,
  TableHead as TableHeadChadcn,
  TableHeader as TableHeaderChadcn,
  TableRow as TableRowChadcn,
} from "@/components/ui/table";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ACTIVITY", uid: "activity", sortable: true },
  { name: "RESPONSIBLE", uid: "responsable", sortable: true },
  { name: "THIRDPARTY", uid: "role", sortable: true },
  { name: "TAG", uid: "TAG" },
  { name: "PROGRESS", uid: "avance" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "START", uid: "inicioplan" },
  { name: "FINISH", uid: "finplan" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "No iniciado", uid: "No iniciado" },
  { name: "Finalizado", uid: "Finalizado" },
  { name: "Atrasado", uid: "Atrasado" },
  { name: "Cancelado", uid: "Cancelado" },
  { name: "En curso", uid: "En curso" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  "No iniciado": "success",
  Finalizado: "success",
  Atrasado: "danger",
  Cancelado: "warning",
  "En curso": "default",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "activity",
  "TAG",
  "role",
  "contratista",
  "responsable",
  "inicioplan",
  "finplan",
  "avance",
  "status",
  "actions",
];

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
  curva: string;
  rutacritica: string;
  area: string;
  avance?: number;
  comentarios?: string;
  contratista: string;
  descripcion: string;
  especialidad?: string;
  estado: string;

  finplan: string;
  inicioplan: string;
  finreal?: string | null;
  inicioreal?: string | null;

  hh: number;
  id: number;
  responsable: string;
  nivel: number;

  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
  deleted: boolean;
  lastupdate: string;
  OT?: string;
  BloqueRC?: string;
};

type TypeThirdParty = {
  name: string;
  uid: string;
};

type TypeEspecialidad = {
  name: string;
  uid: string;
};

type TypeLogError = {
  _id: string;
  id: number;
  descripcion: string;
  TAG: string;
  avance: number;
  responsable: string;
  contratista: string;
  especialidad: string;
  ActividadCancelada: string;
  comentarios: string;
  inicioreal: string;
  finreal: string;
  Mecanicos: number;
  Soldadores: number;
  Vigias: number;
  Electricista: number;
  Instrumentista: number;
  Andamios: boolean;
  CamionGrua: boolean;
  Telescopica: boolean;
  Errors: [];
  Message: string;
  isValid: boolean;
};

export default function page(params: any) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [especiliadadFilter, setEspeciliadadFilter] =
    React.useState<Selection>("all");
  const [thirdPartyFilter, setthirdPartyFilter] = React.useState<Selection>(
    new Set([])
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [activities, setActivities] = useState<TypeActivities[]>([]);
  const [thirdparty, setThirdparty] = useState<TypeThirdParty[]>([]);
  const [especliadad, setEspecialidad] = useState<TypeEspecialidad[]>([]);
  const [page, setPage] = React.useState(1);

  const [modalLoader, setModalLoader] = useState(true);
  const [modal, setModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [message, setMessage] = useState("");
  const [logerror, setLogError] = useState<TypeLogError[]>([]);
  const [correoempresa, setCorreoEmpresa] = useState("");
  const [userempresa, setUserempresa] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/schedule`
      );

      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/thirdparty`
      );

      const response3 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/especialidad`
      );

      if (correoempresa.toLocaleLowerCase() == "marcobre") {
        setActivities(response.data.data);
        setThirdparty(response2.data.Contratistas);
        setEspecialidad(response3.data.Especialidades);
      } else {
        setActivities(
          response.data.data.filter(
            (item: any) =>
              item.contratista.toLowerCase() ==
              correoempresa.toLocaleLowerCase()
          )
        );
        setThirdparty(
          response2.data.Contratistas.filter(
            (item: any) =>
              item.name.toLowerCase() == correoempresa.toLocaleLowerCase
          )
        );
        setEspecialidad(response3.data.Especialidades);
      }
    };
    fetchData();
  }, [correoempresa]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...activities];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((activity) =>
        activity.descripcion.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((activity) =>
        Array.from(statusFilter).includes(activity.estado)
      );
    }

    if (
      Array.from(thirdPartyFilter).length !== 0 &&
      Array.from(thirdPartyFilter).length !== thirdparty.length
    ) {
      console.log(thirdPartyFilter);
      filteredUsers = filteredUsers.filter((item) =>
        Array.from(thirdPartyFilter).includes(item.contratista)
      );
    }

    if (
      especiliadadFilter !== "all" &&
      Array.from(especiliadadFilter).length !== especliadad.length
    ) {
      filteredUsers = filteredUsers.filter((item) =>
        Array.from(especiliadadFilter).includes(item.especialidad || "")
      );
    }

    setPage(1);

    return filteredUsers;
  }, [
    activities,
    filterValue,
    statusFilter,
    thirdPartyFilter,
    especiliadadFilter,
  ]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TypeActivities, b: TypeActivities) => {
      const first = a[sortDescriptor.column as keyof TypeActivities] as number;
      const second = b[sortDescriptor.column as keyof TypeActivities] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (activities: TypeActivities, columnKey: React.Key) => {
      const cellValue = activities[columnKey as keyof TypeActivities];

      switch (columnKey) {
        case "activity":
          return (
            <div className="text-bold text-xs md:text-small capitalize">
              {activities.descripcion}
            </div>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold  text-xs md:text-small  capitalize">
                {activities.contratista}
              </p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {activities.especialidad}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[activities.estado]}
              size="sm"
              variant="flat"
            >
              {activities.estado}
            </Chip>
          );
        case "inicioplan":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-xs md:text-small capitalize">
                Plan:{" "}
                {new Date(activities.inicioplan).toLocaleString("es-ES", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {activities.inicioreal && (
                <p className="text-bold text-tiny capitalize text-default-400">
                  Real:{" "}
                  {new Date(activities.inicioreal).toLocaleString("es-ES", {
                    timeZone: "America/Lima",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          );
        case "finplan":
          return (
            <div className="flex flex-col">
              <p className="text-bold  text-xs md:text-small  capitalize">
                Plan:{" "}
                {new Date(activities.finplan).toLocaleString("es-ES", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {activities.finreal && (
                <p className="text-bold text-tiny capitalize text-default-400">
                  Real:{" "}
                  {new Date(activities.finreal).toLocaleString("es-ES", {
                    timeZone: "America/Lima",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {/* <DropdownItem>View</DropdownItem>
                <DropdownItem>Delete</DropdownItem> */}
                  <DropdownItem
                    onClick={() =>
                      router.push(`/paradadeplanta/activities/${activities.id}`)
                    }
                  >
                    Actualizar
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          // return cellValue;
          if (cellValue !== undefined && typeof cellValue !== "object") {
            return <p className="text-xs md:text-small">{cellValue}</p>;
          }
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    // console.log(Array.from(statusFilter));
    // console.log(Array.from(especiliadadFilter));

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[30%]"
            placeholder="Buscar por actividad..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/*Reset*/}
            <Button
              endContent={<ClearFiltersIcon className="text-small" />}
              variant="faded"
              onClick={() => {
                setthirdPartyFilter(new Set([]));
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </Button>

            {/* Contratistas */}
            <Dropdown>
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  {Array.from(thirdPartyFilter).length === 0
                    ? "Contratistas"
                    : thirdPartyFilter}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={true}
                selectedKeys={thirdPartyFilter}
                selectionMode="single"
                onSelectionChange={setthirdPartyFilter}
              >
                {thirdparty.map((item) => (
                  <DropdownItem key={item.uid} className="capitalize">
                    {capitalize(item.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Status */}
            <Dropdown>
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Especialidad */}
            <Dropdown>
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  Especialidad
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={especiliadadFilter}
                selectionMode="multiple"
                onSelectionChange={setEspeciliadadFilter}
              >
                {especliadad.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {activities.length} activities
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              defaultValue={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    activities.length,
    hasSearchFilter,
    thirdparty,
    thirdPartyFilter,
    especiliadadFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center md:justify-between items-center">
        <span className="hidden sm:w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="solid"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="solid"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const exportToExcel = async () => {
    const dataPdP = activities.map(
      ({
        nivel,
        WBS,
        area,
        hh,
        curva,
        rutacritica,
        // inicioplan,
        // finplan,
        estado,
        deleted,
        createdAt,
        updatedAt,
        __v,
        lastupdate,
        OT,
        BloqueRC,
        Labor = {},
        NoLabor = {},
        ...rest
      }) => ({
        ...rest,
        ...Labor,
        ...NoLabor,
      })
    );

    const formatDate = (date?: string | null) => {
      if (!date) return null;

      const dateObj = new Date(date);
      dateObj.setHours(dateObj.getHours() - 5);

      return dateObj;
    };

    const formatDatePlan = (date?: string | null) => {
      if (!date) return null;

      const dateObj = new Date(date);

      return dateObj;
    };

    const dataPdPProcesada = dataPdP.map((item) => ({ 
      ...item,
      inicioreal: formatDate(item.inicioreal),
      finreal: formatDate(item.finreal),
      inicioplan: formatDatePlan(item.inicioplan),
      finplan: formatDatePlan(item.finplan),
    }));

    const workbook = new ExcelJS.Workbook();
    const sheetInstructivo = workbook.addWorksheet("Instrucciones");
    const sheet = workbook.addWorksheet("ReportePdP");

    const instrucciones = [
      "Este es el instructivo de actualización masiva de actividades de parada de planta. Favor de considerar los siguientes puntos:",
      "",
      "1. No cambiar el nombre de las hojas.",
      "2. No cambiar el nombre de los encabezados.",
      "3. Solo debe actualizar los datos de las columnas que están sombreadas de amarillo.",
      "4. Siempre debe agregar comentarios de avance.",
      "5. Para la parte de recursos labor (Andamieros, mecánicos, instrumentistas, etc), debe asignar un valor numérico.",
      '6. Para la parte de recursos no labor (Andamios, camión grúa, telescópica), colocar los valores de "Verdadero" o "Falso".',
      "7. No modificar el campo _id.",
      "8. No modificar el formato de las celdas",
      "9. El formato de fecha esta configurado como dd/mm/yyy hh:mm",
      "10. Sí es posible borrar filas. El sistema va a procesar todas las filas que se tengan en la hoja ReportePdP.",
    ];

    instrucciones.forEach((linea, index) => {
      sheetInstructivo.getCell(`A${index + 1}`).value = linea;
      sheetInstructivo.getCell(`A${index + 1}`).alignment = { wrapText: true };
    });

    sheetInstructivo.getColumn(1).width = 120;

    const headers = Object.keys(dataPdPProcesada[0]);
    sheet.addRow(headers);
    dataPdPProcesada.forEach((row: any) => {
      sheet.addRow(headers.map((key: any) => row[key]));
    });

    sheet.getColumn(5).numFmt = "dd/mm/yyyy hh:mm";
    sheet.getColumn(6).numFmt = "dd/mm/yyyy hh:mm";
    sheet.getColumn(11).numFmt = "dd/mm/yyyy hh:mm";
    sheet.getColumn(12).numFmt = "dd/mm/yyyy hh:mm";

    const columns = [
      "G",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
    ];

    columns.forEach((col) => {
      const cell = sheet.getCell(`${col}1`);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
    });

    sheet.columns.forEach((column: any) => {
      let maxLength = 10; // valor mínimo por defecto
      column.eachCell({ includeEmpty: true }, (cell: any) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength + 2; // margen adicional
    });

    // XLSX.utils.book_append_sheet(workbook, sheet, "ReportePdP");
    // XLSX.writeFile(workbook, "ReportePdP.xlsx");

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "ReportePdP.xlsx");
  };

  const handleResponse = async (status: number, datos: any) => {
    setModal(true);
    try {
      if (status === 200) {
        setModalLoader(false);
        setMessage("Se esta procesando la información...");
        if (datos.filter((item: any) => item.isValid === false).length > 0) {
          setMessage("Revisar los errores y volver a cargar el archivo");
          setLogError(datos.filter((item: any) => item.isValid === false));
          setErrorModal(true);
        }
      }
    } catch (error) {
      setModalLoader(false);
      setMessage("Error al cargar los datos");
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));
    setModalLoader(false);
  };

  const handleThirdParty = async (status: number, datos: any) => {
    console.log(datos);
    setCorreoEmpresa(datos.datos.empresa);
    setUserempresa(datos.datos.email);
  };

  return (
    <ProtectedRouteComponentemail empresa="Todos" OnResponse={handleThirdParty}>
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        {/* Titulo y boton */}
        <div className="text-white text-2xl mt-8 flex flex-col items-center w-4/5 px-4 py-2">
          <div className="flex justify-center">
            <Label className="text-4xl font-bold">
              ACTIVIDADES PARADA DE PLANTA
            </Label>
          </div>
          <div className="w-full flex flex-col items-center justify-center mt-12 rounded-2xl">
            <button
              onClick={() => {
                exportToExcel();
              }}
              // className="flex border-2 border-blue-600 items-center text-sm gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
              className="shiny-border flex border-none rounded-xl  items-center text-sm gap-2 bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-all"
            >
              <FileSpreadsheet size={20} />
              <span>Descargar Plantilla Excel de CARGA MASIVA</span>
            </button>
            <span className="text-xs mt-6">
              (Descarga la plantilla, actualiza tus actividades en el excel y
              cargalo aquí 👇🏻)
            </span>
          </div>
        </div>

        {/* Carga de archivos */}
        <div className="w-full mt-8 mb-8 items-center">
          <LoadFile
            title={"Cargar Plantilla actualizada de PdP"}
            MessageOk="Actividades cargadas correctamente"
            pathExcelProcess={`${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/massiveupdate`}
            OnResponse={handleResponse}
          />

          {/* Modal */}
          {modal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 max-w-sm w-full rounded-xl">
                {modalLoader && (
                  <div>
                    <h2 className="text-lg font-bold ">
                      Cargando datos a base de datos
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

        {/* Tabla de errores */}
        {errorModal && (
          <div className="bg-white p-4 mt-8 mb-8 border-8 border-red-500 rounded-xl w-5/6">
            {/* <div className="relative p-4 mt-8 mb-8 w-5/6 rounded-xl bg-white z-10">
  <div className="absolute inset-0 rounded-xl border-8 border-transparent z-[-1] animate-spin-slow bg-[conic-gradient(from_0deg,_#f00_0%,_#ff0_25%,_#0f0_50%,_#0ff_75%,_#f00_100%)] bg-[length:200%_200%] bg-no-repeat bg-center blur-sm"></div> */}

            <div className="flex flex-col">
              <Label className="text-2xl font-bold text-red-500">
                Resumen de actividades con Errores (No se ha cargado ninguna
                actividad del excel cargado)
              </Label>
              <Label className=" text-red-200">
                Corregir errores y cargar nuevamente toda la plantilla
              </Label>
            </div>
            <TableChadcn className="rounded-lg">
              <TableCaptionChadcn>Actividades con errores</TableCaptionChadcn>
              <TableHeaderChadcn>
                <TableRowChadcn>
                  <TableHeadChadcn>ID</TableHeadChadcn>
                  <TableHeadChadcn>Actividad</TableHeadChadcn>
                  <TableHeadChadcn>Mensaje Error</TableHeadChadcn>
                </TableRowChadcn>
              </TableHeaderChadcn>
              <TableBodyChadcn>
                {logerror.map((item) => (
                  <TableRowChadcn key={item.id}>
                    <TableCellChadcn className="font-medium">
                      {item.id}
                    </TableCellChadcn>
                    <TableCellChadcn>{item.descripcion}</TableCellChadcn>
                    <TableCellChadcn>{item.Message}</TableCellChadcn>
                  </TableRowChadcn>
                ))}
              </TableBodyChadcn>
              {/* <TableFooter>
              <TableRowCdn>
                <TableCellCdn colSpan={3}>Total</TableCellCdn>
                <TableCellCdn className="text-right">$2,500.00</TableCellCdn>
              </TableRowCdn>
            </TableFooter> */}
            </TableChadcn>
          </div>
        )}

        {/* Tabla de actividades */}
        <div className="w-5/6 mt-8 mb-8">
          <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[600px]",
            }}
            selectedKeys={selectedKeys}
            // selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No activities found"} items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </ProtectedRouteComponentemail>
  );
}
