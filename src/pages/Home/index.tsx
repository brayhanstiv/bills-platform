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
import axios from "axios";

const INITIAL_VISIBLE_COLUMNS = [
  "number",
  "date",
  "emisor",
  "receptor",
  "payment_method",
  "subtotal",
  "vat",
  "total",
];

type Invoice = {
  deferred_credit?: string;
  discounts: number;
  due_date: string;
  exemptions: number;
  invoice_number: string;
  issue_date: string;
  issuer: string;
  net_total: number;
  other_taxes: number;
  payer: string;
  payment_method: string;
  reading_date: string;
  tax_issuer_id: string;
  tax_payer_id: string;
  total: number;
  vat: number;
};

const columns = [
  { name: "NÚMERO", uid: "number", sortable: true },
  { name: "FECHA", uid: "date", sortable: true },
  { name: "EMISOR", uid: "emisor", sortable: true },
  { name: "RECEPTOR", uid: "receptor", sortable: true },
  { name: "MÉTODO DE PAGO", uid: "payment_method" },
  { name: "DESCUENTOS", uid: "discounts" },
  { name: "IMPUESTOS", uid: "taxes" },
  { name: "SUBTOTAL", uid: "subtotal" },
  { name: "IVA", uid: "vat", sortable: true },
  { name: "TOTAL", uid: "total" },
];

const paymentOptions = [
  { uid: 1, value: "credit", name: "crédito" },
  { uid: 2, value: "debit", name: "débito" },
];

const HomePage = () => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [paymentFilter, setPaymentFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<Invoice[]>([]);

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

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

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
    try {
      const url =
        "https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/Invoices/";
      const invoicesResponse = await axios.get(url);
      setData(invoicesResponse.data);
    } catch (error) {
      console.log("Unexpected error " + error);
    }
  };

  React.useEffect(() => {
    getAllInvoices();
  }, []);

  const renderCell = React.useCallback(
    (invoice: Invoice, columnKey: React.Key) => {
      const cellValue = invoice[columnKey as keyof Invoice];

      switch (columnKey) {
        case "number":
          return <p>{invoice.invoice_number}</p>;
        case "date":
          return <p>{invoice.due_date}</p>;
        case "emisor":
          return <p>{invoice.issuer}</p>;
        case "receptor":
          return <p>{invoice.payer}</p>;
        case "payment_method":
          return (
            <p>{invoice.payment_method === "credit" ? "Crédito" : "Débito"}</p>
          );
        case "subtotal":
          return <p>{invoice.net_total}</p>;
        case "vat":
          return <p>{invoice.vat}</p>;
        case "taxes":
          return <p>{invoice.other_taxes}</p>;
        case "total":
          return <p>{invoice.total}</p>;
        default:
          return cellValue;
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
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
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
          total={pages}
          onChange={setPage}
        />
        <div className='hidden sm:flex w-[30%] justify-end gap-2'>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label='Tabla de facturas'
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      classNames={{
        wrapper: "max-h-[724px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode='multiple'
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
            align={column.uid === "total" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No hay facturas encontradas"}
        loadingContent={<Spinner label='Cargando...' />}
      >
        {sortedItems.map((item, key) => (
          <TableRow key={key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HomePage;
