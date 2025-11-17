export type Brand = {
  category: string;
  country: string;
  description: string;
  id: number;
  instagramUrl: string;
  logoUrl: string;
  name: string;
  officialUrl: string;
  sales: Sale[];
};

export type Sale = {
  brandId: number;
  brandName: string;
  saleId: number;
  saleType: string;
  saleDescription: string;
  saleStartDate: string;
  saleEndDate: string;
  isActive: boolean;
};

export type SaleEvent = {
  title: string;
  start: string;
  end?: string;
  description: string;
};
