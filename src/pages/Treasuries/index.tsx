// Packages
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Link,
  DateRangePicker,
  RangeValue,
  CalendarDate,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

// Common
import { Deptor, Treasury } from "../../common/types";
import { currencyFormatter } from "../../common/methods";
import { getAllTreasuries, uploadTreasuries } from "../../common/api/treasury";

// Components
import ModalResponse from "../../components/Modals/ModalResponse";
import ModalUpload from "../../components/Modals/ModalUpload";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "date",
  "reading_date",
  "deudores",
  "total",
  "actions",
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "FECHA", uid: "date" },
  { name: "FECHA LECTURA", uid: "reading_date" },
  { name: "CANT. DEUDORES", uid: "deudores" },
  { name: "TOTAL", uid: "total" },
  { name: "ACCIONES", uid: "actions" },
];

const TreasuriesPage = () => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(1);
  const [data, setData] = React.useState<Treasury[]>([]);
  const [files, setFiles] = React.useState<FileList>();
  const [modalResponse, setModalResponse] = React.useState<{
    type: "success" | "error";
    message: string;
  }>({
    type: "success",
    message: "Se subió la factura correctamente",
  });
  const [date, setDate] =
    React.useState<RangeValue<CalendarDate | CalendarDate>>();

  // Loadings
  const [loading, setLoading] = React.useState(true);
  const [loadingFile, setLoadingFile] = React.useState(false);

  // Modals
  const [isOpenUpload, onOpenUpload] = React.useState<boolean>(false);
  const [isOpenReponse, onOpenReponse] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredTreasuries = [...data];

    if (hasSearchFilter) {
      filteredTreasuries = filteredTreasuries.filter((item) =>
        item.id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (date) {
      filteredTreasuries = filteredTreasuries.filter((item) => {
        const fecha = new Date(item.date!);
        console.log(fecha.toLocaleDateString("en-US"));
        return (
          item.date! >= date.start.toString() &&
          item.date! <= date.end.toString()
        );
      });
    }

    return filteredTreasuries;
  }, [data, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof any] as number;
      const second = b[sortDescriptor.column as keyof any] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const getTreasuries = async () => {
    const data = await getAllTreasuries();
    setData(data);
  };

  React.useEffect(() => {
    getTreasuries();
    setTotal(Math.ceil(filteredItems.length / rowsPerPage));
    setLoading(false);
  }, [data]);

  const renderCell: any = (treasury: Treasury, columnKey: React.Key) => {
    const cellValue = treasury[columnKey as keyof Treasury];

    let date = new Date();
    if (treasury.date) {
      date = new Date(treasury.date);
    }

    switch (columnKey) {
      case "date":
        return <p>{date.toLocaleDateString()}</p>;
      case "total":
        return <p>{currencyFormatter(treasury.total)}</p>;
      case "deudores":
        return <p>{treasury.deudores.length}</p>;
      case "actions":
        return (
          <div className="flex justify-center cursor-pointer">
            <Link onPress={() => navigate(`deptors/${treasury.id}`)}>
              <Icon
                className="text-gray-500"
                icon={"solar:square-arrow-right-linear"}
                width={24}
              />
            </Link>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const onNextPage = React.useCallback(() => {
    if (page < total) {
      setPage(page + 1);
    }
  }, [page, total]);

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

  const packFiles = (files: FileList) => {
    const formData = new FormData();
    [...files].forEach((file, i) => {
      formData.append(`file-${i}`, file, file.name);
    });
    return formData;
  };

  const handleUpload = () => {
    if (files!.length) {
      const data = packFiles(files!);
      uploadFiles(data);
    }
  };

  const uploadFiles = async (data: FormData) => {
    setLoadingFile(true);
    const response = await uploadTreasuries(data);
    setLoadingFile(false);
    onOpenReponse(true);
    if (response) {
      setModalResponse({
        type: "success",
        message: "Se subió la factura exitosamente",
      });
    } else {
      setModalResponse({
        type: "error",
        message: "No se pudo subir la factura correctamente",
      });
    }
  };

  /*  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file!);
    console.log(formData);
    setLoadingFile(true);
    const response = await uploadTreasury(formData);
    setLoadingFile(false);
    onOpenReponse(true);
    if (response) {
      setModalResponse({
        type: "success",
        message: "Se subió la factura exitosamente",
      });
    } else {
      setModalResponse({
        type: "error",
        message: "No se pudo subir la factura correctamente",
      });
    }
  }; */

  const formatData = () => {
    let deptors: Deptor[] = [];
    filteredItems.map((item) => {
      return item.deudores.map((i) => {
        return deptors.push({
          ...i,
          date: item.date,
          dpto_pagaduria: item.dpto_pagaduria,
          id_fideicomiso: item.id_fideicomiso,
          id_pagaduria: item.id_pagaduria,
          nm_fideicomiso: item.nm_fideicomiso,
          nm_pagaduria: item.nm_pagaduria,
        });
      });
    });

    const titleKeys = Object.keys(deptors[0]);

    const refinedData = [];
    refinedData.push(titleKeys);

    deptors.forEach((item) => {
      refinedData.push(Object.values(item));
    });
    return refinedData;
  };

  const downloadCSV = () => {
    const formatItems = formatData();

    // Creating csv
    let csvContent = "";

    formatItems.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
    const objUrl = URL.createObjectURL(blob);
    const date = new Date();
    const link = document.createElement("a");
    link.href = objUrl;
    link.download = `Lait-${date.toLocaleDateString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    // Get data
    const formatItems = formatData();

    // Creating Sheet
    const book = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(formatItems);
    const date = new Date();

    XLSX.utils.book_append_sheet(book, sheet, "deudores");

    XLSX.writeFile(book, `Lait-${date.toLocaleDateString()}.xlsx`);
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={
              <Icon
                className="text-default-300"
                icon="hugeicons:search-01"
                width={20}
              />
            }
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <DateRangePicker
              value={date}
              aria-label="Date Range Picker"
              onChange={setDate}
              className="max-w-[248px]"
            />
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  color="danger"
                  endContent={
                    <Icon
                      icon={"solar:download-minimalistic-linear"}
                      width={20}
                    />
                  }
                >
                  Exportar
                </Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Table Columns">
                <DropdownItem
                  startContent={<Icon icon="bi:filetype-csv" width={24} />}
                  className="capitalize"
                  onClick={downloadCSV}
                >
                  CSV
                </DropdownItem>
                <DropdownItem
                  startContent={
                    <Icon icon="vscode-icons:file-type-excel" width={24} />
                  }
                  className="capitalize"
                  onClick={downloadExcel}
                >
                  Excel
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon
                      className="text-default-300"
                      icon="hugeicons:arrow-down-01"
                      width={20}
                    />
                  }
                  variant="flat"
                >
                  Columnas
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
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              onClick={() => onOpenUpload(true)}
              endContent={<Icon icon={"hugeicons:upload-04"} width={20} />}
            >
              Subir recaudo
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total recaudos</span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
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
    onSearchChange,
    onRowsPerPageChange,
    data.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
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
          total={total}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={total === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={total === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, total, hasSearchFilter]);

  return (
    <>
      <ModalUpload
        isOpen={isOpenUpload}
        loading={loadingFile}
        files={files}
        setFiles={setFiles}
        handleUpload={handleUpload}
        onClose={() => onOpenUpload(false)}
      />
      <ModalResponse
        type={modalResponse.type}
        title={modalResponse.message}
        isOpen={isOpenReponse}
        onClose={() => onOpenReponse(false)}
      />
      <Table
        aria-label="Tabla de facturas"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        className="bg-background"
        classNames={{
          wrapper: "max-h-[724px]",
        }}
        selectedKeys={selectedKeys}
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
              align={
                column.uid === "actions" || column.uid === "total"
                  ? "center"
                  : "start"
              }
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No hay recaudos encontrados"}
          items={sortedItems}
          isLoading={loading}
          loadingContent={<Spinner label="Cargando..." />}
        >
          {sortedItems.map((item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TreasuriesPage;
