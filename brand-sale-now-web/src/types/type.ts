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
  saleId: number;
  saleType: string;
  saleDescription: string;
  saleStartDate: string;
  saleEndDate: string;
  isActive: boolean;
};
