export interface IOrder {
  type: string;
  id: string;
  date: string;
  sender: string;
  status: string;
}

export interface IOrderDetails {
  nameAr: string;
  nameEn: string;
  area: string;
  city: string;
  nic: string;
  isAccepted: boolean;
  rejectionReason: string;
}

export interface IRegion {
  name: string;
  code: string;
}

export interface IOrderResponse extends IOrder { }

export type TFormModes = "edit" | "show";
