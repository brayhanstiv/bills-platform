export type Invoice = {
  payer: string;
  discounts: number;
  invoice_number: string;
  vat: number;
  id: string;
  deferred_credit: number | null;
  issue_date: string;
  other_taxes: number;
  exemptions: number;
  issuer: string;
  tax_issuer_id: string;
  net_total: number;
  total: number;
  tax_payer_id: string;
  due_date: string;
  payment_method: string;
  reading_date: string;
};

export type Treasury = {
  id: string;
  reading_date: string;
  Deudores: Deptor[];
};

export type Deptor = {
  FECHA: string;
  AÑO: number;
  FIDEICOMISO: string;
  PAGADURIA: string;
  DEUDOR: string;
  MES: number;
  "ID PAGADURIA": string;
  "ID FIDEICOMISO": string;
  ID_DEUDOR: string;
  VALOR: number;
};
