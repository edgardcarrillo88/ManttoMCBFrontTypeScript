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
import * as XLSX from "xlsx";

import LoadFile from "@/components/loadfile/page";
import { Spinner } from "@nextui-org/spinner";

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
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/schedule`
      );
      setActivities(response.data.data);

      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/thirdparty`
      );
      setThirdparty(response2.data.Contratistas);

      const response3 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_2}/data/especialidad`
      );
      setEspecialidad(response3.data.Especialidades);
    };
    fetchData();
  }, []);

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
                    Edit
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

  const exportToExcel = () => {
    const dataPdP = activities.map(
      ({
        nivel,
        WBS,
        area,
        hh,
        curva,
        rutacritica,
        inicioplan,
        finplan,
        estado,
        ActividadCancelada,
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
      return new Date(date);
      // .toLocaleString("es-PE", {
      //   timeZone: "America/Lima",
      //   year: "numeric",
      //   month: "2-digit",
      //   day: "2-digit",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   second: "2-digit",
      //   hour12: false,
      // });
    };

    const dataPdPProcesada = dataPdP.map((item) => ({
      ...item,
      inicioreal: formatDate(item.inicioreal),
      finreal: formatDate(item.finreal),
    }));

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(dataPdPProcesada);

    Object.keys(sheet).forEach((cell) => {
      if (cell[0] === "!") return;
      const col = cell.replace(/[0-9]/g, "");
      if (col === "J" || col === "K") {
        sheet[cell].z = "dd/mm/yyyy hh:mm";
      }
    });

    XLSX.utils.book_append_sheet(workbook, sheet, "ReportePdP");
    XLSX.writeFile(workbook, "ReportePdP.xlsx");
  };

  const handleResponse = async (status: number, datos: any) => {
    setModal(true);
    console.log(status);
    console.log(datos);
    console.log(datos.filter((item: any)=> item.isValid===false));
    try {
      if (status === 200) {
        setModalLoader(false);
        setMessage("Datos cargados correctamente");
      }
    } catch (error) {
      setModalLoader(false);
      setMessage("Error al cargar los datos");
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));
    setModalLoader(false);
  };

  return (
    <ProtectedRouteComponentemail empresa="Todos">
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        <div className="text-white text-2xl mt-8 flex flex-col items-center w-4/5 px-4 py-2">
          <div className="flex justify-center">
            <Label className="text-2xl font-bold">
              Actividades Parada de Planta
            </Label>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={() => exportToExcel()}
              className="flex border-2 border-blue-600 items-center text-sm gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              <FileSpreadsheet size={20} />
              <span>Plantilla Excel</span>
            </button>
          </div>
        </div>
        <div className="w-5/6 mt-8">
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

        <div className="w-full mt-8 items-center">
          <LoadFile
            title={
              "Actualización de actividades PDP (descargar la plantilla excel y actualizarla)"
            }
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
      </div>
    </ProtectedRouteComponentemail>
  );
}
