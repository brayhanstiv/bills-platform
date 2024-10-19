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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Treasury } from "../../common/types";
import { getAllTreasuries, uploadTreasury } from "../../common/api/treasury";
import { useNavigate } from "react-router-dom";
import ModalResponse from "../../components/Modals/ModalResponse";
import ModalUpload from "../../components/Modals/ModalUpload";

const INITIAL_VISIBLE_COLUMNS = ["id", "reading_date", "deudores", "actions"];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "FECHA LECTURA", uid: "reading_date" },
  { name: "CANT. DEUDORES", uid: "deudores" },
  { name: "ACCIONES", uid: "actions" },
];

const paymentOptions = [
  { uid: 1, value: "credit", name: "crédito" },
  { uid: 2, value: "debit", name: "débito" },
];

const TreasuriesPage = () => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [paymentFilter, setPaymentFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(1);
  const [data, setData] = React.useState<Treasury[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<string | Blob>();
  const [modalResponse, setModalResponse] = React.useState<{
    type: "success" | "error";
    message: string;
  }>({
    type: "success",
    message: "Se subió la factura correctamente",
  });

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
    let filteredInvoices = [...data];

    if (hasSearchFilter) {
      filteredInvoices = filteredInvoices.filter((item) =>
        item.id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      paymentFilter !== "all" &&
      Array.from(paymentFilter).length !== paymentOptions.length
    ) {
      filteredInvoices = filteredInvoices.filter((item) =>
        Array.from(paymentFilter).includes(item.id)
      );
    }

    return filteredInvoices;
  }, [data, filterValue, paymentFilter]);

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

    switch (columnKey) {
      case "deudores":
        return <p>{treasury.Deudores.length}</p>;
      case "actions":
        return (
          <div className='flex justify-center cursor-pointer'>
            <Link onPress={() => navigate(`deptors/${treasury.id}`)}>
              <Icon
                className='text-gray-500'
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files![0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile!);
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
  };

  const topContent = React.useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[44%]'
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
                  Método de pago
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={paymentFilter}
                selectionMode='multiple'
                onSelectionChange={setPaymentFilter}
              >
                {paymentOptions.map((payment) => (
                  <DropdownItem key={payment.value} className='capitalize'>
                    {payment.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
            <Button
              color='primary'
              onClick={() => onOpenUpload(true)}
              endContent={<Icon icon={"hugeicons:upload-04"} width={20} />}
            >
              Subir recaudo
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>Total recaudos</span>
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
    paymentFilter,
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
      <ModalUpload
        isOpen={isOpenUpload}
        loading={loadingFile}
        handleFileUpload={handleFileUpload}
        handleUpload={handleUpload}
        onClose={() => onOpenUpload(false)}
      />
      <ModalResponse
        type={modalResponse.type}
        icon={"solar:close-circle-linear"}
        title={modalResponse.message}
        isOpen={isOpenReponse}
        onClose={() => onOpenReponse(false)}
      />
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
              align={column.uid === "actions" ? "center" : "start"}
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
          loadingContent={<Spinner label='Cargando...' />}
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
