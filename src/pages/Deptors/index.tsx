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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";

// Common
import { Deptor } from "../../common/types";
import { getTreasuryById } from "../../common/api/treasury";
import { currencyFormatter } from "../../common/methods";

const INITIAL_VISIBLE_COLUMNS = [
  "date",
  "id_fideicomiso",
  "nm_fideicomiso",
  "id_pagaduria",
  "nm_pagaduria",
  "year",
  "month",
  "id_deudor",
  "nm_deudor",
  "valor",
];

const columns = [
  { name: "FECHA", uid: "date" },
  { name: "ID FIDEICOMISO", uid: "id_fideicomiso" },
  { name: "FIDEICOMISO", uid: "nm_fideicomiso", sortable: true },
  { name: "ID PAGADURIA", uid: "id_pagaduria" },
  { name: "PAGADURIA", uid: "nm_pagaduria", sortable: true },
  { name: "AÑO", uid: "year" },
  { name: "MES", uid: "month" },
  { name: "ID DEUDOR", uid: "id_deudor" },
  { name: "DEUDOR", uid: "nm_deudor" },
  { name: "VALOR", uid: "valor" },
];

const DeptorsPage = () => {
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
  const [total, setTotal] = React.useState(2);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Deptor[]>([]);

  const { id } = useParams();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredDeptors = [...data];

    if (hasSearchFilter) {
      filteredDeptors = filteredDeptors.filter((item) => {
        item.nm_deudor.toLowerCase().includes(filterValue.toLowerCase());
      });
    }

    return filteredDeptors;
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

  const getAllDeptors = async () => {
    const response = await getTreasuryById(id!);
    if (response) {
      let deptors: Deptor[] = [];
      response.deudores.map((item) =>
        deptors.push({
          ...item,
          date: response.date,
          dpto_pagaduria: response.dpto_pagaduria,
          id_fideicomiso: response.id_fideicomiso,
          id_pagaduria: response.id_pagaduria,
          nm_fideicomiso: response.nm_fideicomiso,
          nm_pagaduria: response.nm_pagaduria,
        })
      );
      setData(deptors);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getAllDeptors();
    setTotal(Math.ceil(filteredItems.length / rowsPerPage));
  }, [data]);

  const renderCell: any = (deptor: Deptor, columnKey: React.Key) => {
    const cellValue = deptor[columnKey as keyof Deptor];
    let date = new Date();
    if (deptor.date) {
      date = new Date(deptor.date);
    }
    switch (columnKey) {
      case "date":
        return (
          <p>{`${date.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}`}</p>
        );
      case "year":
        return <p>{`${date.getFullYear()}`}</p>;
      case "month":
        return (
          <p className='capitalize'>{`${date.toLocaleDateString("es-CO", {
            month: "long",
          })}`}</p>
        );
      case "valor":
        return <p>{deptor.valor && currencyFormatter(deptor.valor)}</p>;
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

  const topContent = React.useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[30%]'
            placeholder='Buscar por nombre...'
            startContent={
              <Icon
                className='text-default-300'
                icon='hugeicons:search-01'
                width={20}
              />
            }
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className='flex gap-3'>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button
                  endContent={
                    <Icon
                      className='text-default-300'
                      icon='hugeicons:arrow-down-01'
                      width={20}
                    />
                  }
                  variant='flat'
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode='multiple'
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className='capitalize'>
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>Total deudores</span>
          <label className='flex items-center text-default-400 text-small'>
            Filas por página:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              onChange={onRowsPerPageChange}
            >
              <option value='10'>10</option>
              <option value='15'>15</option>
              <option value='20'>20</option>
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
      <div className='py-2 px-2 flex justify-between items-center'>
        <span className='w-[30%] text-small text-default-400'>
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={total}
          onChange={setPage}
        />
        <div className='hidden sm:flex w-[30%] justify-end gap-2'>
          <Button
            isDisabled={total === 1}
            size='sm'
            variant='flat'
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={total === 1}
            size='sm'
            variant='flat'
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
      <Table
        aria-label='Tabla de facturas'
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement='outside'
        className='bg-background'
        classNames={{
          wrapper: "max-h-[724px]",
        }}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement='outside'
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align='center'
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No hay deudores para este recaudo"}
          items={sortedItems}
          isLoading={loading}
          loadingContent={<Spinner label='Cargando...' />}
        >
          {sortedItems.map((item) => (
            <TableRow key={item.id_deudor}>
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

export default DeptorsPage;
