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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

// Common
import { getInvoices, uploadInvoice } from "../../common/api/invoice";
import { Invoice } from "../../common/types";
import { currencyFormatter } from "../../common/methods";
import ModalUpload from "../../components/Modals/ModalUpload";
import ModalCode from "../../components/Modals/ModalCode";
import ModalResponse from "../../components/Modals/ModalResponse";

const INITIAL_VISIBLE_COLUMNS = [
  "invoice_number",
  "emisor",
  "due_date",
  "payment_method",
  "receptor",
  "total",
  "actions",
];

const columns = [
  { name: "NÚMERO", uid: "invoice_number", sortable: true },
  { name: "EMISOR", uid: "emisor", sortable: true },
  { name: "FECHA", uid: "due_date", sortable: true },
  { name: "MÉTODO DE PAGO", uid: "payment_method" },
  { name: "PAGADOR", uid: "receptor", sortable: true },
  { name: "DESCUENTOS", uid: "discounts" },
  { name: "IMPUESTOS", uid: "taxes" },
  { name: "IVA", uid: "vat", sortable: true },
  { name: "SUBTOTAL", uid: "subtotal" },
  { name: "TOTAL", uid: "total" },
  { name: "ACCIONES", uid: "actions" },
];

const paymentOptions = [
  { uid: 1, value: "credit", name: "crédito" },
  { uid: 2, value: "debit", name: "débito" },
];

const InvoicesPage = () => {
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
  const [total, setTotal] = React.useState(2);
  const [data, setData] = React.useState<Invoice[]>([]);
  const [invoice, setInvoice] = React.useState<Invoice>();
  const [file, setFile] = React.useState<File>();
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
  const [isOpenCode, onOpenCode] = React.useState<boolean>(false);
  const [isOpenReponse, onOpenReponse] = React.useState<boolean>(false);

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
        item.payer.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      paymentFilter !== "all" &&
      Array.from(paymentFilter).length !== paymentOptions.length
    ) {
      filteredInvoices = filteredInvoices.filter((item) =>
        Array.from(paymentFilter).includes(item.payment_method)
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
    return [...items].sort((a: Invoice, b: Invoice) => {
      const first = a[sortDescriptor.column as keyof Invoice] as number;
      const second = b[sortDescriptor.column as keyof Invoice] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const getAllInvoices = async () => {
    const response = await getInvoices();
    setData(response);
    setLoading(false);
  };

  const getInvoice = async (id: string) => {
    setInvoice(data.find((invoice) => invoice.id === id));
  };

  React.useEffect(() => {
    getAllInvoices();
    setTotal(Math.ceil(filteredItems.length / rowsPerPage));
  }, [data]);

  const renderCell = (invoice: Invoice, columnKey: React.Key) => {
    const cellValue = invoice[columnKey as keyof Invoice];

    switch (columnKey) {
      case "emisor":
        return <p className='text-start'>{invoice.issuer}</p>;
      case "receptor":
        return <p className='text-start'>{invoice.payer}</p>;
      case "payment_method":
        return (
          <p>{invoice.payment_method === "credit" ? "Crédito" : "Débito"}</p>
        );
      case "discounts":
        return (
          <p className='text-end'>{currencyFormatter(invoice.discounts)}</p>
        );
      case "subtotal":
        return (
          <p className='text-end'>{currencyFormatter(invoice.net_total)}</p>
        );
      case "vat":
        return <p className='text-end'>{currencyFormatter(invoice.vat)}</p>;
      case "taxes":
        return (
          <p className='text-end'>{currencyFormatter(invoice.other_taxes)}</p>
        );
      case "total":
        return <p className='text-end'>{currencyFormatter(invoice.total)}</p>;
      case "actions":
        return (
          <div className='flex justify-center cursor-pointer'>
            <Link
              onPress={() => {
                getInvoice(invoice.id);
                onOpenCode(true);
              }}
            >
              <Icon
                className='text-gray-500'
                icon={"solar:eye-linear"}
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

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file!);
    console.log(formData);
    setLoadingFile(true);
    const response = await uploadInvoice(formData);
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
              Subir factura
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>Total facturas</span>
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
        file={file}
        setFile={setFile}
        handleUpload={handleUpload}
        onClose={() => onOpenUpload(false)}
      />
      <ModalCode
        isOpen={isOpenCode}
        invoice={invoice!}
        onClose={() => onOpenCode(false)}
      />
      <ModalResponse
        type={modalResponse.type}
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
              align='center'
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No hay facturas encontradas"}
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

export default InvoicesPage;
