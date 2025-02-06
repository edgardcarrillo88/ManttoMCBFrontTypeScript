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
import { User } from "@nextui-org/user";
import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";

import { PlusIcon } from "@/components/table/utils/PlusIcon";
import { VerticalDotsIcon } from "@/components/table/utils/VerticalDotsIcon";
import { ChevronDownIcon } from "@/components/table/utils/ChevronDownIcon";
import { ClearFiltersIcon } from "@/components/table/utils/ClearFiltersIcon";
import { SearchIcon } from "@/components/table/utils/SearchIcon";
import { capitalize } from "@/components/table/utils/utils";

import { useRouter } from "next/navigation";
import { StringToBoolean } from "class-variance-authority/types";

const columns = [
  { name: "GLOSA", uid: "Glosa", sortable: true },
  { name: "CONTRATISTA", uid: "NombreProveedor", sortable: true },
  { name: "ACTIVITY", uid: "activity", sortable: true },
  { name: "PLANTA/PARTIDA", uid: "role", sortable: false },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "MONTO", uid: "Monto", sortable: true },
  { name: "MONEDA", uid: "Moneda" },
  { name: "ENVIO", uid: "FechaEnvio", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Aprobado", uid: "Aprobado" },
  { name: "Pendiente aprobación", uid: "Pendiente Aprobación" },
  { name: "Pagado", uid: "Pagado" },
  { name: "Rechazado", uid: "Rechazado" },
];

const months = [
  { name: "Ene", uid: 1 },
  { name: "Feb", uid: 2 },
  { name: "Mar", uid: 3 },
  { name: "Abr", uid: 4 },
  { name: "May", uid: 5 },
  { name: "Jun", uid: 6 },
  { name: "Jul", uid: 7 },
  { name: "Ago", uid: 8 },
  { name: "Sep", uid: 9 },
  { name: "Oct", uid: 10 },
  { name: "Nov", uid: 11 },
  { name: "Dic", uid: 12 },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  Aprobado: "success",
  Pagado: "success",
  Pendiente: "danger",
  Rechazado: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "Glosa",
  "NombreProveedor",
  "activity",
  "role",
  "contratista",
  "status",
  "Monto",
  "Moneda",
  "actions",
  "FechaEnvio",
];

type TypeProvisiones = {
  Glosa: string;
  NombreProveedor: string;
  DescripcionServicio: string;
  Partida: number;
  Status: string;
  Monto: number;
  Moneda: string;
  FechaEnvio: Date;
};

type TypeThirdParty = {
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
  const [thirdPartyFilter, setthirdPartyFilter] = React.useState<Selection>(
    new Set([])
  );
  const [monthsfilter, setMonthsFilter] = React.useState<Selection>(
    new Set([])
  );
  const [UpdateStatusCount, SetUpdateStatusCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [activities, setActivities] = useState<TypeProvisiones[]>([]);
  const [thirdparty, setThirdparty] = useState<TypeThirdParty[]>([]);
  const [page, setPage] = React.useState(1);


  const router = useRouter();
  

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cost/getalldataprovisiones`
      );
      console.log(response.data.GroupProcesed);
      //console.log(response.data.data.docs);
      // setActivities(response.data.data.docs);
      setActivities(response.data.GroupProcesed);

      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cost/GetAllDataProvisionesContratistas`
      );
      // console.log(response2.data.Contratistas);
      // console.log(response2.data.Contratistas.length);
      setThirdparty(response2.data.Contratistas);
      console.log("Holi");
    };
    fetchData();
  }, [UpdateStatusCount]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...activities];
    console.log("Status filter:" , statusFilter);

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((activity) =>
        // activity.DescripcionServicio.toLowerCase().includes(
        //   filterValue.toLowerCase()
        // )
        activity.DescripcionServicio
          ? activity.DescripcionServicio.toLowerCase().includes(
              filterValue.toLowerCase()
            )
          : false
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((activity) =>
        Array.from(statusFilter).includes(activity.Status)
      );
    }

    if (
      Array.from(thirdPartyFilter).length !== 0 &&
      Array.from(thirdPartyFilter).length !== thirdparty.length
    ) {
      console.log("Filtro ahorita: ", thirdPartyFilter);
      filteredUsers = filteredUsers.filter((item) =>
        Array.from(thirdPartyFilter).includes(item.NombreProveedor)
      );
    }

    if (
      Array.from(monthsfilter).length !== 0 &&
      Array.from(monthsfilter).length !== months.length
    ) {
      filteredUsers = filteredUsers.filter((item) => {
        const fechaEnvio = new Date(item.FechaEnvio);
        const mesEnvio = fechaEnvio.getMonth() + 1;
        const monthsArray = Array.from(monthsfilter).map(Number);
        return monthsArray.includes(mesEnvio);
      });
    }

    // console.log(filteredUsers.length);
    return filteredUsers;
  }, [activities, filterValue, statusFilter, thirdPartyFilter, monthsfilter, rowsPerPage]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TypeProvisiones, b: TypeProvisiones) => {
      const first = a[sortDescriptor.column as keyof TypeProvisiones] as number;
      const second = b[
        sortDescriptor.column as keyof TypeProvisiones
      ] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const UpdateStatus = async (
    status: "Aprobado" | "Rechazado" | "Pagado",
    Glosa: string
  ) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cost/updatestatusprovisiones`,
      { status, Glosa }
    );

    if (response.status === 200) {
      SetUpdateStatusCount(prev => prev + 1);
      alert("Provisión Actualizada");
    } else {
      alert("Error al actualizar la glosa");
    }
  };

  const renderCell = React.useCallback(
    (activities: TypeProvisiones, columnKey: React.Key) => {
      const cellValue = activities[columnKey as keyof TypeProvisiones];

      switch (columnKey) {
        case "activity":
          return (
            //   <User
            //     avatarProps={{ radius: "lg", src: user.avatar }}
            //     description={user.email}
            //     name={cellValue}
            //   >
            //     {user.email}
            //   </User>
            <div className="text-bold text-xs capitalize">
              {activities.DescripcionServicio}
            </div>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold  text-xs capitalize">
                {activities.Partida}
              </p>
              {/* <p className="text-bold text-tiny capitalize text-default-400">
                {activities.Partida}
              </p> */}
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[activities.Status]}
              size="sm"
              variant="flat"
            >
              {activities.Status}
            </Chip>
          );
        case "Monto":
          return (
            <div className="flex flex-col">
              <p className="text-bold  text-xs capitalize">
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(activities.Monto)}
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
                  <DropdownItem
                    onClick={() => UpdateStatus("Aprobado", activities.Glosa)}
                  >
                    Aprobar
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => UpdateStatus("Rechazado", activities.Glosa)}
                  >
                    Rechazar
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => UpdateStatus("Pagado", activities.Glosa)}
                  >
                    Pagado
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "FechaEnvio":
          return (
            <div className="flex flex-col">
              <p className="text-bold  text-xs  capitalize">
                {new Date(activities.FechaEnvio).toLocaleDateString("es-ES", {
                  timeZone: "America/Lima",
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </p>
            </div>
          );
        default:
          // return cellValue;
          if (cellValue !== undefined && typeof cellValue !== "object") {
            return <p className="text-xs">{cellValue}</p>;
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
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[30%]"
            placeholder="Buscar por descripción de servicio..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              endContent={<ClearFiltersIcon className="text-small" />}
              variant="faded"
              onClick={() => {
                setthirdPartyFilter(new Set([]));
                setMonthsFilter(new Set([]));
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </Button>

            <Dropdown className="overflow-y-auto max-h-full">
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
                className="overflow-y-auto max-h-[200px]"
              >
                {thirdparty.map((item) => (
                  <DropdownItem key={item.uid} className="capitalize">
                    {capitalize(item.name)}
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
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="single"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown className="overflow-y-auto max-h-full">
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  {Array.from(monthsfilter).length === 0
                    ? "Fecha Envio"
                    : months.filter(
                        (item) =>
                          item.uid === Array.from(monthsfilter).map(Number)[0]
                      )[0].name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={true}
                selectedKeys={monthsfilter}
                selectionMode="single"
                onSelectionChange={setMonthsFilter}
              >
                {months.map((item) => (
                  <DropdownItem key={item.uid} className="capitalize">
                    {item.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="faded"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {activities.length} provisiones
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
    monthsfilter,
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
          color="default"
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
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      <div className="text-white text-2xl mt-8 flex items-start">
        Listado de provisiones
      </div>
      <div className="text-white">{thirdPartyFilter}</div>
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
              <TableRow key={item.Glosa}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
