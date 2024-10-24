export interface IPayment{
  action? :string,
  trandata? :string,
  tranportalId? : string,
  responseURL? : string,
  errorURL? : string,
  redirectURL? : string
}

export interface IPaymentResponse extends IPayment{
  data?: any;
}

export type TFormModes = "add" | "edit" | "show";
