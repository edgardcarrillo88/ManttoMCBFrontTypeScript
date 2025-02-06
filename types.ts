// types.d.ts
export interface ReportOptions {
  title: string;
  href: string;
  description: string;
}

export interface CostsOptions {
  title: string;
  href: string;
  description: string;
}

export interface Dashboard {
  title: string;
  href: string;
  description: string;
}


export interface Data {
  ReportOptions: ReportOptions[];
  CostsOptions: CostsOptions[];
  Dashboard: Dashboard[];
}
