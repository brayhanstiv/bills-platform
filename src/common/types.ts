import { SidebarItemType } from "./enums";

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
  date: string;
  deudores: Deptor[];
  dpto_pagaduria: string;
  id: string;
  id_fideicomiso: string;
  id_pagaduria: string;
  nm_fideicomiso: string;
  nm_pagaduria: string;
  reading_date: string;
  total: number;
};

export type Deptor = {
  id_deudor: string;
  nm_deudor: string;
  valor?: number;
  date?: string;
  dpto_pagaduria?: string;
  id_fideicomiso?: string;
  id_pagaduria?: string;
  nm_fideicomiso?: string;
  nm_pagaduria?: string;
  reading_date?: string;
  total?: number;
};

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};
