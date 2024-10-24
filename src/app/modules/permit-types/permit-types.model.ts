export interface IPermitTypes {
  id? : number;
  nameAr? : string;
  nameEn? : string; 
  validityBillPaymentPeriodInDays? : number;
  code? : string;
  descriptionEn?: string,
  descriptionAr?: string,
  formValidation? : boolean;
  status? : boolean;
}

export interface IPermitTypesResponse extends IPermitTypes {
  data?: any;
}

export type TFormModes = "add" | "edit" | "show" | "toggleActivation";
