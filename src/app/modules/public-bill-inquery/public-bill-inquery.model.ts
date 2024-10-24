export interface ISearchByBill {
  billNumber?: string,
  identityType?: number | null,
  identityNumber: string,
}

export interface ISearchByIdentity {
  identityType: number | null,
  identityNumber: string,
}

export interface IBill {
  billNumber: number;
  billDate: string;
  totalAmount: number;
  status: string;
  isARBPaid?: string;
}