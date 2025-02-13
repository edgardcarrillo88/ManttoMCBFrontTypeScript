"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { LucideCalendarDays, DollarSign, CircleX } from "lucide-react";
import { Spinner } from "@nextui-org/spinner";

import { Input } from "@nextui-org/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { set } from "date-fns";
import {ProtectedRouteComponentemail} from "@/components/protected-route-email"

interface FormEditProps {
  activities: Partial<TypeActual>;
}

const columns = [
  { name: "Planta", uid: "Planta", sortable: true },
  { name: "Categoria", uid: "Categoria", sortable: true },
  { name: "TAG", uid: "TAG", sortable: true },
  { name: "Partida", uid: "Partida", sortable: false },
  { name: "Desc. Partida", uid: "DescripcionPartida", sortable: true },
  { name: "Detalle", uid: "TxtPedido" },
  { name: "Proveedor", uid: "Proveedor" },
  { name: "Monto", uid: "Monto", sortable: true },
  { name: "TipoGasto", uid: "CategoriaActual" },
  { name: "Mes", uid: "Mes" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Aprobado", uid: "Aprobado" },
  { name: "Pendiente aprobación", uid: "Pendiente" },
  { name: "Pagado", uid: "Pagado" },
  { name: "Rechazado", uid: "Rechazado" },
];

const Plantas = [
  { Planta: "Infraestructura", uid: "Infraestructura" },
  { Planta: "Planta de Sulfuros", uid: "Planta de Sulfuros" },
  { Planta: "Planta de Oxidos", uid: "Planta de Oxidos" },
  { Planta: "Gerencia Mantenimiento", uid: "Gerencia Mantenimiento" },
];

const Categorias = [
  { name: "Servicios", uid: "Servicios" },
  { name: "Consumibles", uid: "Consumibles" },
  { name: "Elementos de desgaste", uid: "Elementos de desgaste" },
];

const Especialidad = [
  { name: "E&I", uid: "E&I" },
  { name: "General", uid: "General" },
  { name: "Mecánico", uid: "Mecánico" },
  { name: "Mina", uid: "Mina" },
  { name: "Parada de Planta", uid: "Parada de Planta" },
  { name: "Potencia", uid: "Potencia" },
];

const Clasificacion = [
  { name: "Regular", uid: "Regular" },
  { name: "Adelanto", uid: "Adelanto" },
  { name: "Diferido", uid: "Diferido" },
  { name: "Desestimado", uid: "Desestimado" },
];

const CategoriaActual = [
  { name: "Flat", uid: "Flat" },
  { name: "Forecast", uid: "Forecast" },
  { name: "Real", uid: "Real" },
  { name: "SP", uid: "SP" },
  { name: "OC", uid: "OC" },
  { name: "ProvAnt", uid: "ProvAnt" },
];

const months = [
  { name: "Cero", uid: 0 },
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
  "Planta",
  "Categoria",
  "TAG",
  "Partida",
  "DescripcionPartida",
  "TxtPedido",
  "Proveedor",
  "Monto",
  "CategoriaActual",
  "Mes",
  "actions",
];

type TypeActual = {
  _id: string;
  IdPpto: string;
  Gerencia: string;
  Planta: string;
  Area: string;
  SubArea: string;
  Categoria: string;
  CeCo: string;
  DescripcionCeCo: string;
  ClaseCosto: string;
  DescripcionClaseCosto: string;
  Responsable: string;
  Especialidad: string;
  TAG: string;
  Partida: string;
  DescripcionPartida: string;
  CategoriaActual: string;
  Mes: Number | null;
  Monto: Number;
  PptoForecast: string;
  Proveedor: string;
  TxtPedido: string;
  OC: string;
  Posicion: string;
  Fecha: string;
  Justificacion: string;
  CN: string;
  MesBase: Number;
  MontoBase: Number;
  SPConOC: string;
  SPConOCPos: string;
  Clasificacion: string;
};

type TypeFilters = {
  Planta: string;
  Categoria: string;
  Partida: string;
  CategoriaActual: string;
  OC: string;
  Mes: number | null;
  Proveedor: string;
  TAG: string;
  TxtPedido: string;
  MesEdit: number | null;
};

type TypeUpdateForm = {
  Categoria: string;
  Responsable: string | null;
  Especialidad: string;
  TAG: string;
  Partida: string;
  DescripcionPartida: string;
  Mes: number | null;
  Monto: number;
  Proveedor: string;
  TxtPedido: string;
  OC: string;
  Posicion: string;
  Fecha: string; //Mejorar esto ya que sirve para la parte de las partidas
  Clasificacion: string;
};

export default function page(params: any) {
  //--------------------------------------------------------------------------------
  //UseState
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [filterValue, setFilterValue] = React.useState<TypeFilters>({
    Planta: "",
    Categoria: "",
    Partida: "",
    CategoriaActual: "",
    OC: "",
    Mes: null,
    Proveedor: "",
    TAG: "",
    TxtPedido: "",
    MesEdit: null,
  });
  const [UpdateStatusCount, SetUpdateStatusCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [activities, setActivities] = useState<TypeActual[]>([]);
  const [formData, setFormData] = useState<Partial<TypeActual>>({
    _id: "",
    Categoria: "",
    Responsable: "",
    Especialidad: "",
    TAG: "",
    Partida: "",
    Mes: null,
    Monto: 0,
    Proveedor: "",
    TxtPedido: "",
    OC: "",
    Posicion: "",

    Fecha: "",
    Clasificacion: "",
  });

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalDocs, setTotalDocs] = React.useState(0);

  const [ModalVisible, setModalVisible] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);

  //--------------------------------------------------------------------------------

  //UseEffect
  async function fetchData(pagina: number = 1, RowPerPage = rowsPerPage) {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cost/getalldataactualplanta`
    );
    const params = new URLSearchParams({
      page: pagina.toString(),
      perPage: RowPerPage.toString(),
    });

    Object.entries(filterValue).forEach(([key, value]) => {
      if (value) {
        params.append(key, String(value));
      }
    });

    url.search = params.toString();
    console.log("URL generada:", url.toString());

    try {
      const response = await axios.get(url.toString());
      const { docs, totalDocs, totalPages } = response.data;
      setActivities(docs);
      setTotalDocs(totalDocs);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }

  useEffect(() => {
    fetchData(page);
  }, [page, rowsPerPage, filterValue]);

  //--------------------------------------------------------------------------------

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const items = React.useMemo(() => {
    // const start = (page - 1) * rowsPerPage;
    const start = 0;
    const end = start + rowsPerPage;

    return activities.slice(start, end);
  }, [page, activities, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TypeActual, b: TypeActual) => {
      const first = a[sortDescriptor.column as keyof TypeActual] as number;
      const second = b[sortDescriptor.column as keyof TypeActual] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const UpdateStatus = async (
    status: "Aprobado" | "Rechazado" | "Pagado",
    Glosa: String
  ) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cost/updatestatusprovisiones`,
      { status, Glosa }
    );

    if (response.status === 200) {
      SetUpdateStatusCount((prev) => prev + 1);
      alert("Provisión Actualizada");
    } else {
      alert("Error al actualizar la glosa");
    }
  };

  const renderCell = React.useCallback(
    (activities: TypeActual, columnKey: React.Key) => {
      const cellValue = activities[columnKey as keyof TypeActual];

      switch (columnKey) {
        case "CategoriaActual":
          return (
            <div className="text-bold text-xs capitalize">
              {activities.CategoriaActual
                ? `${activities.CategoriaActual}` +
                  (activities.OC ? `/${activities.OC}` : "") +
                  (activities.Posicion ? `-${activities.Posicion}` : "")
                : null}
            </div>
          );
        case "Monto":
          return (
            <div className="flex flex-col">
              <p className="text-bold  text-xs capitalize">
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(activities.Monto))}
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
                    onClick={(e) => {
                      setFormData(activities);
                      setModalVisible(true);
                    }}
                  >
                    Editar
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          if (cellValue !== undefined && typeof cellValue !== "object") {
            return <p className="text-xs">{cellValue}</p>;
          }
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

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

  const OnSearchValues = React.useCallback(
    (key: keyof TypeFilters, value?: string | number | null) => {
      console.log("Key: ", key, "Value: ", value);
      console.log(filterValue);
      setFilterValue((prev) => ({
        ...prev,
        [key]: value !== undefined ? value : "",
      }));
      setPage(1);
    },
    []
  );

  const onClear = React.useCallback(() => {
    console.log("Borrando filtros");
    setFilterValue((prev) => ({
      ...prev,
      TxtPedido: "",
    }));
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-3 items-start ">
          <div className="flex flex-col gap-3 w-80 ">
            <Input
              isClearable
              className="w-full sm:max-w-[100%]"
              placeholder="Buscar por descripción..."
              startContent={<SearchIcon />}
              value={filterValue.TxtPedido}
              onClear={() => onClear()}
              onValueChange={(e) => {
                OnSearchValues("TxtPedido", e);
              }}
            />

            <div className="flex grid grid-cols-2 gap-3">
              <Input
                isClearable
                className="w-full sm:max-w-[100%]"
                placeholder="TAG"
                startContent={<SearchIcon />}
                value={filterValue.TAG}
                onClear={() => onClear()}
                onValueChange={(e) => {
                  OnSearchValues("TAG", e);
                }}
              />

              <Input
                isClearable
                className="w-full sm:max-w-[100%]"
                placeholder="Partida"
                startContent={<SearchIcon />}
                value={filterValue.Partida}
                onClear={() => onClear()}
                onValueChange={(e) => {
                  OnSearchValues("Partida", e);
                }}
              />
              <Input
                isClearable
                className="w-full sm:max-w-[100%]"
                placeholder="Proveedor"
                startContent={<SearchIcon />}
                value={filterValue.Proveedor}
                onClear={() => onClear()}
                onValueChange={(e) => {
                  OnSearchValues("Proveedor", e);
                }}
              />
              <Input
                isClearable
                className="w-full sm:max-w-[100%]"
                placeholder="OC/SP"
                startContent={<SearchIcon />}
                value={filterValue.OC}
                onClear={() => onClear()}
                onValueChange={(e) => {
                  OnSearchValues("OC", e);
                }}
              />
            </div>
          </div>

          <div className="flex-col grid gap-y-3 w-80 sm:w-4/5 md:w-1/3">
            <div className="flex justify-end grid grid-cols-2 sm:grid-cols-3 gap-3 border-b-1 pb-3">
              {/* Reset */}
              <Button
                className="w-40"
                endContent={<ClearFiltersIcon className="text-small" />}
                variant="faded"
                onClick={() => {
                  setFilterValue({
                    Planta: "",
                    Categoria: "",
                    Partida: "",
                    CategoriaActual: "",
                    OC: "",
                    Mes: null,
                    Proveedor: "",
                    TAG: "",
                    TxtPedido: "",
                    MesEdit: null,
                  });
                }}
              >
                Reset Filters
              </Button>

              {/* Planta */}
              <Dropdown className="w-40">
                <DropdownTrigger className="w-40">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="faded"
                  >
                    {filterValue.Planta === "" ||
                    filterValue.Planta === undefined
                      ? "Planta"
                      : filterValue.Planta}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={true}
                  selectedKeys={
                    filterValue.Planta ? new Set([filterValue.Planta]) : "all"
                  }
                  selectionMode="single"
                  onSelectionChange={(e) => {
                    console.log("e: ", e);
                    OnSearchValues("Planta", String(e.anchorKey));
                  }}
                >
                  {Plantas.map((planta) => (
                    <DropdownItem key={planta.uid} className="capitalize">
                      {capitalize(planta.Planta)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Categoria */}
              <Dropdown>
                <DropdownTrigger className="w-40">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="faded"
                  >
                    {filterValue.Categoria === "" ||
                    filterValue.Categoria === undefined
                      ? "Categoria"
                      : filterValue.Categoria}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={true}
                  selectedKeys={new Set([filterValue.Categoria]) || "all"}
                  selectionMode="single"
                  onSelectionChange={(e) => {
                    OnSearchValues("Categoria", String(e.anchorKey));
                  }}
                >
                  {Categorias.map((categoria) => (
                    <DropdownItem key={categoria.uid} className="capitalize">
                      {capitalize(categoria.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Tipo de gasto   */}
              <Dropdown>
                <DropdownTrigger className="w-40">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="faded"
                  >
                    {filterValue.CategoriaActual === "" ||
                    filterValue.CategoriaActual === null
                      ? "Tipo de Gasto"
                      : filterValue.CategoriaActual}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={true}
                  selectedKeys={new Set([filterValue.CategoriaActual]) || "all"}
                  selectionMode="single"
                  onSelectionChange={(e) => {
                    OnSearchValues("CategoriaActual", String(e.anchorKey));
                  }}
                >
                  {CategoriaActual.map((tipo) => (
                    <DropdownItem key={tipo.uid} className="capitalize">
                      {capitalize(tipo.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Meses */}
              <Dropdown>
                <DropdownTrigger className="w-40">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="faded"
                  >
                    {filterValue.Mes === 0 ||
                    filterValue.Mes === undefined ||
                    filterValue.Mes === null
                      ? "Mes"
                      : months.filter((item) => item.uid === filterValue.Mes)[0]
                          .name}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={true}
                  selectedKeys={new Set([String(filterValue.Mes) || "all"])}
                  selectionMode="single"
                  onSelectionChange={(e) => {
                    OnSearchValues("Mes", Number(e.anchorKey));
                  }}
                >
                  {months.map((item) => (
                    <DropdownItem key={item.uid} className="capitalize">
                      {item.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="">
              <Label>
                <span className="text-white text-small">Actualizar Meses</span>
              </Label>
              <div className="flex justify-end grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Editar Meses */}
                <Dropdown>
                  <DropdownTrigger className="w-40">
                    <Button
                      endContent={<LucideCalendarDays className="text-small" />}
                      variant="faded"
                    >
                      {
                        // filterValue.MesEdit === 0 ||
                        filterValue.MesEdit === undefined ||
                        filterValue.MesEdit === null
                          ? "Mes Edit"
                          : months.filter(
                              (item) => item.uid === filterValue.MesEdit
                            )[0].name
                      }
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Table Columns"
                    closeOnSelect={true}
                    selectedKeys={
                      new Set([String(filterValue.MesEdit) || "all"])
                    }
                    selectionMode="single"
                    onSelectionChange={(e) => {
                      console.log("e: ", e);
                      OnSearchValues("MesEdit", Number(e.anchorKey));
                    }}
                  >
                    {months.map((item) => (
                      <DropdownItem key={item.uid} className="capitalize">
                        {item.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                {/* Editar Meses  Boton*/}
                <Button
                  className={`text-small w-40 ${
                    filterValue?.MesEdit !== null && filterValue.MesEdit >= 0
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  endContent={<DollarSign className="text-small" />}
                  variant={
                    filterValue?.MesEdit !== null && filterValue.MesEdit >= 0
                      ? "shadow"
                      : "ghost"
                  }
                  onClick={() => {
                    alert("Actualizar Meses");
                    // setFilterValue({
                    //   Planta: "",
                    //   Categoria: "",
                    //   Partida: "",
                    //   CategoriaActual: "",
                    //   OC: "",
                    //   Mes: null,
                    //   Proveedor: "",
                    //   TAG: "",
                    //   TxtPedido: "",
                    //   MesEdit: null,
                    // });
                  }}
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalDocs} filas
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
    visibleColumns,
    onRowsPerPageChange,
    totalDocs,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center md:justify-between items-center">
        <span className="hidden sm:w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${activities.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="default"
          page={page}
          total={totalPages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={totalPages === 1}
            size="sm"
            variant="solid"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={totalPages === 1}
            size="sm"
            variant="solid"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, totalPages, hasSearchFilter]);

  const HandleChangeForm = React.useCallback(
    (key: keyof TypeActual, value?: string | number | null) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value !== undefined ? value : "",
      }));
    },
    []
  );

  const HandleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Form Actualziado");
  };

  return (
    <ProtectedRouteComponentemail>
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        {/* Modal */}
        {ModalVisible && (
          <div>
            <div className="fixed inset-0 flex items-center justify-center bg-slate-200 bg-opacity-50 z-50">
              {/* <FormEdit /> */}
              <div className="h-[77vh] from-gray-900 via-gray-800 to-black flex flex-col items-center bg-white p-6 rounded-xl">
                <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-lg shadow-xl mt-2 mb-2 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-white">
                      Actualizar Datos
                    </h1>
                    <CircleX
                      className="h-10 w-10 text-white"
                      onClick={() => setModalVisible(false)}
                    />
                  </div>

                  <form onSubmit={HandleSubmitForm} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Categoria */}
                      <div className="space-y-2 flex flex-col w-40">
                        <Label className="text-white">Categoria</Label>
                        <Dropdown>
                          <DropdownTrigger className="w-40">
                            <Button
                              endContent={
                                <ChevronDownIcon className="text-small" />
                              }
                              variant="faded"
                            >
                              {formData.Categoria === "" ||
                              formData.Categoria === undefined
                                ? "Categoria"
                                : formData.Categoria}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={true}
                            selectedKeys={
                              new Set([String(formData.Categoria)]) || "all"
                            }
                            selectionMode="single"
                            onSelectionChange={(e) => {
                              HandleChangeForm(
                                "Categoria",
                                String(e.anchorKey)
                              );
                            }}
                          >
                            {Categorias.map((categoria) => (
                              <DropdownItem
                                key={categoria.uid}
                                className="capitalize"
                              >
                                {capitalize(categoria.name)}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>

                      {/* Especialidad */}
                      <div className="space-y-2 flex flex-col w-40">
                        <Label className="text-white">Especialidad</Label>
                        <Dropdown>
                          <DropdownTrigger className="w-40">
                            <Button
                              endContent={
                                <ChevronDownIcon className="text-small" />
                              }
                              variant="faded"
                              className="w-full"
                            >
                              {formData.Especialidad === "" ||
                              formData.Especialidad === undefined
                                ? "Especialidad"
                                : formData.Especialidad}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={true}
                            selectedKeys={
                              new Set([String(formData.Especialidad) || "all"])
                            }
                            selectionMode="single"
                            onSelectionChange={(e) => {
                              HandleChangeForm(
                                "Especialidad",
                                String(e.anchorKey)
                              );
                            }}
                          >
                            {Especialidad.map((especialidad) => (
                              <DropdownItem
                                key={especialidad.uid}
                                className="capitalize"
                              >
                                {capitalize(especialidad.name)}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>

                      {/* Responsable */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Responsable</Label>
                        <Input
                          type={"text"}
                          name="Responsable"
                          value={formData.Responsable as string}
                          onChange={(e) => {
                            HandleChangeForm("Responsable", e.target.value);
                          }}
                          className="w-40 bg-gray-700 text-white border-gray-600"
                        />
                      </div>

                      {/* TAG */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">TAG</Label>
                        <Input
                          type={"text"}
                          name="TAG"
                          value={formData.TAG as string}
                          onChange={(e) => {
                            HandleChangeForm("TAG", e.target.value);
                          }}
                          className="w-40 bg-gray-700 text-white border-gray-600"
                        />
                      </div>

                      {/* Partida */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Partida</Label>
                        <Input
                          type={"text"}
                          name="Partida"
                          value={formData.Partida as string}
                          onChange={(e) => {
                            HandleChangeForm("Partida", e.target.value);
                          }}
                          className="w-40 bg-gray-700 text-white border-gray-600"
                        />
                      </div>

                      {/* Mes */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Mes</Label>
                        <Dropdown>
                          <DropdownTrigger className="w-40">
                            <Button
                              endContent={
                                <ChevronDownIcon className="text-small" />
                              }
                              variant="faded"
                            >
                              {formData.Mes === 0 ||
                              formData.Mes === undefined ||
                              formData.Mes === null
                                ? "Mes"
                                : months.filter(
                                    (item) => item.uid === formData.Mes
                                  )[0].name}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={true}
                            selectedKeys={
                              new Set([String(formData.Mes) || "all"])
                            }
                            selectionMode="single"
                            onSelectionChange={(e) => {
                              HandleChangeForm("Mes", Number(e.anchorKey));
                            }}
                          >
                            {months.map((item) => (
                              <DropdownItem
                                key={item.uid}
                                className="capitalize"
                              >
                                {item.name}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>

                      {/* Monto */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Monto</Label>
                        <Input
                          type={"number"}
                          id={"Monto"}
                          name={"Monto"}
                          value={String(formData.Monto) as string}
                          onChange={(e) => {
                            HandleChangeForm("Monto", e.target.value);
                          }}
                          className="w-40 bg-gray-700 text-white border-gray-600"
                        />
                      </div>

                      {/* Proveedor */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Proovedor</Label>
                        <Input
                          type={"text"}
                          name="Proveedor"
                          value={formData.Proveedor as string}
                          onChange={(e) => {
                            HandleChangeForm("Proveedor", e.target.value);
                          }}
                          className="w-40 bg-gray-700 text-white border-gray-600"
                        />
                      </div>

                      {/* OC/SP/OT */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">OC/SP/OT</Label>
                        <Input
                          type={"text"}
                          name="OC"
                          value={formData.OC as string}
                          onChange={(e) => {
                            HandleChangeForm("OC", e.target.value);
                          }}
                          className="w-40 bg-gray-700 text-white border-gray-600"
                        />
                      </div>

                      {/* Posicion */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Posicion</Label>
                        <Input
                          type={"text"}
                          name="Posicion"
                          value={formData.Posicion as string}
                          onChange={(e) => {
                            HandleChangeForm("Posicion", e.target.value);
                          }}
                          className="w-40 bg-gray-700 text-white border-gray-600"
                        />
                      </div>

                      {/* Fecha OC/SP*/}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Fecha OC/SP</Label>
                        <Input
                          type={"text"}
                          name="Fecha"
                          value={formData.Fecha as string}
                          onChange={(e) => {
                            HandleChangeForm("Fecha", e.target.value);
                          }}
                          className="w-40 bg-gray-700 text-white border-gray-600"
                        />
                      </div>

                      {/* Clasificacion */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Clasificación</Label>
                        <Dropdown>
                          <DropdownTrigger className="w-40">
                            <Button
                              endContent={
                                <ChevronDownIcon className="text-small" />
                              }
                              variant="faded"
                            >
                              {formData.Clasificacion === undefined ||
                              formData.Clasificacion === null
                                ? "Clasificacion"
                                : Clasificacion.filter(
                                    (item) =>
                                      item.uid === formData.Clasificacion
                                  )[0].name}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={true}
                            selectedKeys={
                              new Set([String(formData.Clasificacion) || "all"])
                            }
                            selectionMode="single"
                            onSelectionChange={(e) => {
                              HandleChangeForm(
                                "Clasificacion",
                                String(e.anchorKey)
                              );
                            }}
                          >
                            {Clasificacion.map((item) => (
                              <DropdownItem
                                key={item.uid}
                                className="capitalize"
                              >
                                {item.name}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>

                      {/* Descripcion Pedido */}
                      <div className="space-y-2  flex flex-col">
                        <Label className="text-white">Descripcion Pedido</Label>
                        <Textarea
                          className="w-40 h-40 bg-gray-700 text-white border-gray-600"
                          id="TxtPedido"
                          name="TxtPedido"
                          value={formData.TxtPedido as string}
                          onChange={(e) => {
                            HandleChangeForm("TxtPedido", e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Actualizar Fila
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="text-white text-2xl mt-8 flex items-start">
          Detalle Costos Mantto Planta
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
