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

import { VerticalDotsIcon } from "@/components/table/utils/VerticalDotsIcon";
import { ChevronDownIcon } from "@/components/table/utils/ChevronDownIcon";
import { ClearFiltersIcon } from "@/components/table/utils/ClearFiltersIcon";
import { SearchIcon } from "@/components/table/utils/SearchIcon";
import { capitalize } from "@/components/table/utils/utils";

import { ProtectedRouteComponentemail } from "@/components/protected-route-email";

import { useRouter } from "next/navigation";
import { Pen } from "lucide-react";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "DESCRIPCION", uid: "descripcion", sortable: true },
  { name: "PLANTA", uid: "planta" },
  { name: "TAG", uid: "tag" },
  { name: "FECHA REQ.", uid: "fecharequerida", sortable: true },
  { name: "TIPO AVISO", uid: "tipoaviso", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "PROGRESS", uid: "avance" },
  { name: "START", uid: "inicioplan" },
  { name: "FINISH", uid: "finplan" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Pendiente", uid: "Pendiente" },
  { name: "Aprobado", uid: "Aprobado" },
  { name: "Con aviso", uid: "Con aviso" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  Pendiente: "default",
  Aprobado: "warning",
  "Con aviso": "success",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "descripcion",
  "planta",
  "tag",
  "fecharequerida",
  "tipoaviso",
  "status",
  "actions",
];

interface FormData {
  codSAP: string;
  noParte: string;
  descripcion: string;
  cantidad: string;
  um: string;
  caracteristicas: string;
}

type TypePreAvisos = {
  _id: string;
  DescripcionBreve: string;
  DescripcionDetallada: string;
  TipoAviso: string;
  TipoPlanta: string;
  Equipo: string;
  Prioridad: string;
  PuestoTrabajo: string;
  FechaRequerida: Date;
  TiempoEjecucion: 3;
  ToggleAndamios: boolean;
  ToggleCamionGrua: boolean;
  ToggleTelescopica: boolean;
  ToggleServicioEspecializado: boolean;
  CantidadCamionGrua: number;
  CantidadTelescopica: number;
  ServicioEspecializado: string;
  ToggleParadaEquipo: boolean;
  ToggleParadaNoAplica: boolean;
  ToggleParadaProceso: boolean;
  ToggleParadaPlanta: boolean;
  LaborMecanicos: number;
  LaborSoldadores: number;
  LaborElectricistas: number;
  LaborInstrumentistas: number;
  LaborVigias: number;
  ToggleMateriales: boolean;
  ArrayMateriales: Array<FormData>;
  FilesData: File;
  deleted: boolean;
  Status: string;
};

type TypeTAG = {
  TAG: string;
};

type TypePlanta = {
  name: string;
  uid: string;
};

export default function page(params: any) {
  const [filterValue, setFilterValue] = React.useState("");
  const [filterValueTAG, setFilterValueTAG] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");

  const [thirdPartyFilter, setthirdPartyFilter] = React.useState<Selection>(
    new Set([])
  );

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [preAvisos, setPreavisos] = useState<TypePreAvisos[]>([]);
  const [tagSelect, setTagSelect] = useState<TypeTAG[]>([]);

  const [plantaFilter, setPlantaFilter] = React.useState<Selection>("all");
  const [planta, setPlanta] = useState<TypePlanta[]>([]);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response0 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/getdataequiposplanta`
      );
      setTagSelect(response0.data);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/getalldataBacklog`
      );
      console.log(response.data.data);
      setPreavisos(response.data.data);

      setPlanta([
        { name: "Sulfuros", uid: "Sulfuros" },
        { name: "Oxidos", uid: "Oxidos" },
        { name: "Infraestructura", uid: "Infraestructura" },
        { name: "Puerto", uid: "Puerto" },
      ]);
    };
    fetchData();
  }, []);

  const hasSearchFilter = Boolean(filterValue);
  const hasSearchFilterTAG = Boolean(filterValueTAG);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredPreAvisos = [...preAvisos];

    if (hasSearchFilter) {
      filteredPreAvisos = filteredPreAvisos.filter((preaviso) =>
        preaviso.DescripcionBreve.toLowerCase().includes(
          filterValue.toLowerCase()
        )
      );
    }

    if (hasSearchFilterTAG) {
      filteredPreAvisos = filteredPreAvisos.filter((preaviso) =>
        preaviso.Equipo.toLowerCase().includes(
          filterValueTAG.toLowerCase()
        )
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredPreAvisos = filteredPreAvisos.filter((preaviso) =>
        Array.from(statusFilter).includes(preaviso.Status)
      );
    }

    // if (
    //   Array.from(thirdPartyFilter).length !== 0 &&
    //   Array.from(thirdPartyFilter).length !== thirdparty.length
    // ) {
    //   filteredPreAvisos = filteredPreAvisos.filter((item) =>
    //     Array.from(thirdPartyFilter).includes(item.contratista)
    //   );
    // }

    if (
      plantaFilter !== "all" &&
      Array.from(plantaFilter).length !== planta.length
    ) {
      filteredPreAvisos = filteredPreAvisos.filter((item) =>
        Array.from(plantaFilter).includes(item.TipoPlanta || "")
      );
    }

    setPage(1);

    return filteredPreAvisos;
  }, [preAvisos, filterValue,filterValueTAG, statusFilter, thirdPartyFilter, plantaFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TypePreAvisos, b: TypePreAvisos) => {
      const first = a[sortDescriptor.column as keyof TypePreAvisos] as number;
      const second = b[sortDescriptor.column as keyof TypePreAvisos] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (preavisos: TypePreAvisos, columnKey: React.Key) => {
      const cellValue = preavisos[columnKey as keyof TypePreAvisos];

      switch (columnKey) {
        case "descripcion":
          return (
            <div className="text-bold text-black text-xs md:text-small capitalize">
              {preavisos.DescripcionBreve}
            </div>
          );
        case "planta":
          return (
            <div className="text-bold text-black text-xs md:text-small capitalize">
              {preavisos.TipoPlanta}
            </div>
          );
        case "tag":
          return (
            <div className="text-bold text-black text-xs md:text-small capitalize">
              {preavisos.Equipo}
            </div>
          );
        case "tipoaviso":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-black  text-xs md:text-small  capitalize">
                {preavisos.TipoAviso}
              </p>
              {/* <p className="text-bold text-black text-tiny capitalize text-default-400">
                {preavisos.TipoPlanta}
              </p> */}
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[preavisos.Status]}
              size="sm"
              variant="flat"
            >
              {preavisos.Status}
            </Chip>
          );
        case "fecharequerida":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-black text-xs md:text-small capitalize">
                {new Date(preavisos.FechaRequerida).toLocaleString("es-ES", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
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
                      router.push(`/reportes/avisos/historial/${preavisos._id}`)
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

  
  const onSearchChangeTAG = React.useCallback((value?: string) => {
    if (value) {
      setFilterValueTAG(value);
      setPage(1);
    } else {
      setFilterValueTAG("");
    }
  }, []);

  const onClearTAG = React.useCallback(() => {
    setFilterValueTAG("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-3 items-end">
          <div className="flex flex-col w-full gap-3">
            {/* Buscar por descripcion */}
            <Input
              isClearable
              className="w-full sm:max-w-[30%]"
              placeholder="Buscar por descripción..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />

            {/* Buscar por TAG */}
            <Input
              isClearable
              className="w-full sm:max-w-[30%]"
              placeholder="Buscar por TAG..."
              startContent={<SearchIcon />}
              value={filterValueTAG}
              onClear={() => onClearTAG()}
              onValueChange={onSearchChangeTAG}
            />
          </div>

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

            {/* TAG */}
            {/* <Dropdown>
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  {Array.from(thirdPartyFilter).length === 0
                    ? "TAG"
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
                {tagSelect.map((item) => (
                  <DropdownItem key={item.TAG} className="capitalize">
                    {capitalize(item.TAG)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}

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

            {/* Planta */}
            <Dropdown>
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  Planta
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={plantaFilter}
                selectionMode="multiple"
                onSelectionChange={setPlantaFilter}
              >
                {planta.map((status) => (
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
            Total {preAvisos.length} activities
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
    filterValueTAG,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    preAvisos.length,
    hasSearchFilter,
    tagSelect,
    thirdPartyFilter,
    plantaFilter,
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

  return (
    <ProtectedRouteComponentemail>
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        <div className="text-white text-2xl mt-8 flex items-start">
          Listado de tareas de Parada de Planta
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
                <TableRow key={item._id}>
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
