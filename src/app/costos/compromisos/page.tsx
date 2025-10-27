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
import { Pen, FileSpreadsheet } from "lucide-react";
import {
  Table as TableCdn,
  TableBody as TableBodyCdn,
  TableCaption,
  TableCell as TableCellCdn,
  TableFooter,
  TableHead,
  TableHeader as TableHeaderCdn,
  TableRow as TableRowCdn,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { set } from "date-fns";
import * as XLSX from "xlsx";

const columns = [
  { name: "PARTIDA", uid: "partida", sortable: true },
  { name: "DESCRIPCION", uid: "descripcion" },
  { name: "CATEGORIA", uid: "categoria" },
  { name: "MONTO SP", uid: "montosp" },
  { name: "MONTO OC", uid: "montooc" },
  { name: "TOTAL COMPR", uid: "totalcompromiso" },
  { name: "Q3", uid: "forecast" },
  { name: "SALDO", uid: "saldo" },
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
  "partida",
  "descripcion",
  "categoria",
  "montosp",
  "montooc",
  "totalcompromiso",
  "forecast",
  "saldo",
];

type TypeCompromisos = {
  monto: number;
  totalSP: number;
  totalOC: number;
  totalCompromiso: number;
  saldo: number;
  partida: string;
  descripcionPartida: string;
  especialidad: string;
};

type TypeEspecialidad = {
  especialidad: string;
};

type TypeSPs = {
  _id: string;
  SP: string;
  PosSP: string;
  Partida: string;
  TextoBreve: string;
  FechaSolicitud: Date;
  IndicadorBorrado?: string;
  Concluida?: string;
  Periodo: number;
  Monto: number;
  Forecast: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  Especialidad: string;
  DescripcionPartida: string;
};

type TypeOCs = {
  _id: string;
  OC: string;
  OCPos: string;
  Fecha: Date;
  Proveedor: string;
  TextoBreve: string;
  IndicadorBorrado?: string;
  ValorOC: number;
  PorEntregar: number;
  Moneda: string;
  CarryOverUSD: number;
  TipoCompromiso: string;
  Monto: number;
  Partida: string;
  Periodo: number;
  Forecast: string;
  deleted: false;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  Especialidad: string;
  DescripcionPartida: string;
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

  const [compromisoSPs, setCompromisoSPs] = useState<TypeSPs[]>([]);
  const [compromisoOCs, setCompromisoOCs] = useState<TypeOCs[]>([]);

  const [filtercompromisoSPs, setFilterCompromisoSPs] = useState<TypeSPs[]>([]);
  const [filtercompromisoOCs, setFilterCompromisoOCs] = useState<TypeOCs[]>([]);

  const [thirdparty, setThirdparty] = useState<TypeEspecialidad[]>([
    { especialidad: "E&I" },
    { especialidad: "General" },
    { especialidad: "Mecánico" },
    { especialidad: "Parada de Planta" },
    { especialidad: "Potencia" },
  ]);
  const [thirdPartyFilter, setthirdPartyFilter] = React.useState<Selection>(
    new Set([])
  );

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [compromisosPartidas, setCompromisosPartidas] = useState<
    TypeCompromisos[]
  >([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cost/getprocesscompromisosdata`
      );

      response.data.dataSP = response.data.dataSP.map((item: TypeSPs) => ({
        ...item,
        FechaSolicitud: new Date(item.FechaSolicitud),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      setCompromisoSPs(response.data.dataSP);
      setFilterCompromisoSPs(response.data.dataSP);



      response.data.dataOC = response.data.dataOC.map((item: TypeOCs) => ({
        ...item,
        Fecha: new Date(item.Fecha),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));


      setCompromisoOCs(response.data.dataOC);
      setFilterCompromisoOCs(response.data.dataOC);
      
      console.log("Holi");
      console.log(response.data.dataOC.filter((item: any) => item.Partida === "MPLT-208"));
      setCompromisosPartidas(response.data.data);
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
    let filteredPreAvisos = [...compromisosPartidas];
    let filteredSPs = [...compromisoSPs];
    let filteredOCs = [...compromisoOCs];

 


    if (hasSearchFilter) {
      filteredPreAvisos = filteredPreAvisos.filter((preaviso) =>
        preaviso.descripcionPartida
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );

      console.log(filteredSPs);
      console.log("holi");
      console.log(filterValue);

      filteredSPs = filteredSPs.filter((item) =>
        (item.DescripcionPartida || "")
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );

      setFilterCompromisoSPs(filteredSPs);

      filteredOCs = filteredOCs.filter((item) =>
        (item.DescripcionPartida || "")
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
      setFilterCompromisoOCs(filteredOCs);
    }

    if (hasSearchFilterTAG) {
      filteredPreAvisos = filteredPreAvisos.filter((preaviso) =>
        preaviso.partida.toLowerCase().includes(filterValueTAG.toLowerCase())
      );

      filteredSPs = filteredSPs.filter((item) =>
        item.Partida?.toLowerCase().includes(filterValueTAG.toLowerCase())
      );
      setFilterCompromisoSPs(filteredSPs);

      filteredOCs = filteredOCs.filter((item) =>
        item.Partida?.toLowerCase().includes(filterValueTAG.toLowerCase())
      );
      setFilterCompromisoOCs(filteredOCs);
    }

    if (
      Array.from(thirdPartyFilter).length !== 0 &&
      Array.from(thirdPartyFilter).length !== thirdparty.length
    ) {
      filteredPreAvisos = filteredPreAvisos.filter((item) =>
        Array.from(thirdPartyFilter).includes(item.especialidad)
      );

      filteredSPs = filteredSPs.filter((item) =>
        Array.from(thirdPartyFilter).includes(item.Especialidad)
      );
      setFilterCompromisoSPs(filteredSPs);

      filteredOCs = filteredOCs.filter((item) =>
        Array.from(thirdPartyFilter).includes(item.Especialidad)
      );
      setFilterCompromisoOCs(filteredOCs);
    }

    // if (
    //   statusFilter !== "all" &&
    //   Array.from(statusFilter).length !== statusOptions.length
    // ) {
    //   filteredPreAvisos = filteredPreAvisos.filter((preaviso) =>
    //     Array.from(statusFilter).includes(preaviso.Status)
    //   );
    // }

    setPage(1);

    return { filteredPreAvisos, filteredSPs, filteredOCs };
  }, [
    compromisosPartidas,
    filterValue,
    filterValueTAG,
    statusFilter,
    thirdPartyFilter,
  ]);

  const pages = Math.ceil(filteredItems.filteredPreAvisos.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.filteredPreAvisos.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TypeCompromisos, b: TypeCompromisos) => {
      const first = a[sortDescriptor.column as keyof TypeCompromisos] as number;
      const second = b[
        sortDescriptor.column as keyof TypeCompromisos
      ] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (partidas: TypeCompromisos, columnKey: React.Key) => {
      const cellValue = partidas[columnKey as keyof TypeCompromisos];

      switch (columnKey) {
        case "descripcion":
          return (
            <div className="text-bold text-black text-xs md:text-small capitalize">
              {partidas.descripcionPartida}
            </div>
          );
        case "partida":
          return (
            <div className="text-bold text-black text-xs md:text-small capitalize">
              {partidas.partida}
            </div>
          );
        case "categoria":
          return (
            <div className="text-bold text-black text-xs md:text-small capitalize">
              {partidas.especialidad}
            </div>
          );
        case "montosp":
          return (
            <div className="text-bold text-xs text-black md:text-small capitalize text-right">
              {new Intl.NumberFormat("es-US", {
                maximumFractionDigits: 2,
              }).format(partidas.totalSP)}
            </div>
          );
        case "montooc":
          return (
            <div className="text-bold text-black text-xs md:text-small capitalize text-right">
              {new Intl.NumberFormat("es-US", {
                maximumFractionDigits: 2,
              }).format(partidas.totalOC)}
            </div>
          );
        case "totalcompromiso":
          return (
            <div className="text-bold text-xs text-black md:text-small capitalize text-right">
              {new Intl.NumberFormat("es-US", {
                maximumFractionDigits: 2,
              }).format(partidas.totalCompromiso)}
            </div>
          );

        case "forecast":
          return (
            <div className="text-bold text-xs text-black md:text-small capitalize text-right">
              {new Intl.NumberFormat("es-US", {
                maximumFractionDigits: 2,
              }).format(partidas.monto)}
            </div>
          );
        case "saldo":
          return (
            <div className="text-bold text-xs text-black md:text-small capitalize text-right">
              {new Intl.NumberFormat("es-US", {
                maximumFractionDigits: 2,
              }).format(partidas.saldo)}
            </div>
          );
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
              onClear={() => {
                onClear();
                setFilterCompromisoOCs(compromisoOCs);
                setFilterCompromisoSPs(compromisoSPs);
              }}
              onValueChange={onSearchChange}
            />

            {/* Buscar por TAG */}
            <Input
              isClearable
              className="w-full sm:max-w-[30%]"
              placeholder="Buscar por Partida..."
              startContent={<SearchIcon />}
              value={filterValueTAG}
              onClear={() => {
                onClearTAG();
                setFilterCompromisoOCs(compromisoOCs);
                setFilterCompromisoSPs(compromisoSPs);
              }}
              onValueChange={onSearchChangeTAG}
            />
          </div>

          <div className="flex gap-3">
            {/*Reset*/}
            <Button
              endContent={<ClearFiltersIcon className="text-small" />}
              variant="faded"
              onClick={() => {
                onClearTAG(), onClear();
                setthirdPartyFilter(new Set([]));
                setFilterCompromisoOCs(compromisoOCs);
                setFilterCompromisoSPs(compromisoSPs);
              }}
            >
              Reset Filters
            </Button>

            {/* Especialidad */}
            <Dropdown>
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  {Array.from(thirdPartyFilter).length === 0
                    ? "Especialidad"
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
                  <DropdownItem key={item.especialidad} className="capitalize">
                    {capitalize(item.especialidad)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {compromisosPartidas.length} activities
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
    compromisosPartidas.length,
    hasSearchFilter,
    thirdparty,
    thirdPartyFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center md:justify-between items-center">
        <span className="hidden sm:w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.filteredPreAvisos.length} selected`}
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
    const compromisos = filteredItems.filteredPreAvisos;
    const sps = filtercompromisoSPs;
    const ocs = filtercompromisoOCs;
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(compromisos), "Compromisos");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sps), "SPs");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(ocs), "OCs");
  
    XLSX.writeFile(workbook, "Reporte.xlsx");
  };

  return (
    <ProtectedRouteComponentemail empresa="Marcobre">
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        <div className="text-white text-2xl mt-8 flex flex-col items-center w-4/5 px-4 py-2">
          <div className="flex justify-center">
            <Label className="text-2xl font-bold">Control de Compromisos</Label>
          </div>
          <div className="w-full flex justify-end">
          <button 
          onClick={() => exportToExcel()}
          className="flex border-2 border-blue-600 items-center text-sm gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all">
            <FileSpreadsheet size={20} />
            <span>Exportar a Excel</span>
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
                <TableRow key={item.partida}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="bg-white p-4 text-black mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
            <Label className="text-2xl font-bold">Listado de SP</Label>
            <TableCdn className="rounded-lg">
              <TableCaption>
                Solamente se muestran las SPs aprobadas (todos los montos estan
                en USD)
              </TableCaption>
              <TableHeaderCdn>
                <TableRowCdn>
                  <TableHead className="w-[100px]">SP</TableHead>
                  <TableHead>Pos</TableHead>
                  <TableHead>Partida</TableHead>
                  <TableHead>Texto Breve</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRowCdn>
              </TableHeaderCdn>
              <TableBodyCdn>
                {filtercompromisoSPs.map((item) => (
                  <TableRowCdn key={item._id}>
                    <TableCellCdn className="font-medium">
                      {item.SP}
                    </TableCellCdn>
                    <TableCellCdn>{item.PosSP}</TableCellCdn>
                    <TableCellCdn>{item.Partida}</TableCellCdn>
                    <TableCellCdn>{item.TextoBreve}</TableCellCdn>
                    <TableCellCdn className="text-right">
                      <div className="text-bold text-xs md:text-small capitalize text-right">
                        {new Intl.NumberFormat("es-US", {
                          maximumFractionDigits: 2,
                        }).format(item.Monto)}
                      </div>
                    </TableCellCdn>
                  </TableRowCdn>
                ))}
              </TableBodyCdn>
              {/* <TableFooter>
              <TableRowCdn>
                <TableCellCdn colSpan={3}>Total</TableCellCdn>
                <TableCellCdn className="text-right">$2,500.00</TableCellCdn>
              </TableRowCdn>
            </TableFooter> */}
            </TableCdn>
          </div>

          <div className="bg-white p-4 text-black mt-8 mb-8 border-2 border-gray-500 rounded-xl w-5/6">
            <Label className="text-2xl font-bold">Listado de OC</Label>
            <TableCdn className="rounded-lg">
              <TableCaption>(todos los montos estan en USD)</TableCaption>
              <TableHeaderCdn>
                <TableRowCdn>
                  <TableHead className="w-[100px]">OC</TableHead>
                  <TableHead>Pos</TableHead>
                  <TableHead>Partida</TableHead>
                  <TableHead>Texto Breve</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRowCdn>
              </TableHeaderCdn>
              <TableBodyCdn>
                {filtercompromisoOCs.map((item) => (
                  <TableRowCdn key={item._id}>
                    <TableCellCdn className="font-medium">
                      {item.OC}
                    </TableCellCdn>
                    <TableCellCdn>{item.OCPos}</TableCellCdn>
                    <TableCellCdn>{item.Partida}</TableCellCdn>
                    <TableCellCdn>{item.TextoBreve}</TableCellCdn>
                    <TableCellCdn>{item.Proveedor}</TableCellCdn>
                    <TableCellCdn className="text-right">
                      <div className="text-bold text-xs md:text-small capitalize text-right">
                        {new Intl.NumberFormat("es-US", {
                          maximumFractionDigits: 2,
                        }).format(item.Monto)}
                      </div>
                    </TableCellCdn>
                  </TableRowCdn>
                ))}
              </TableBodyCdn>
              {/* <TableFooter>
              <TableRowCdn>
                <TableCellCdn colSpan={3}>Total</TableCellCdn>
                <TableCellCdn className="text-right">$2,500.00</TableCellCdn>
              </TableRowCdn>
            </TableFooter> */}
            </TableCdn>
          </div>
        </div>
      </div>
    </ProtectedRouteComponentemail>
  );
}
