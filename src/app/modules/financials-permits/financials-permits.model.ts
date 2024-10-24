
export interface IFinancialsPermits {
    id? : number;
    excavationPathTypeId?: number,
    excavationTypeId?: number,
    excavationPathTypeNameAr? : string;
    excavationPathTypeNameEn? : string;
    excavationTypeNameAr?: string;
    excavationTypeNameEn?: string;
    code? :string;
    maxDaysNumber?: number,
    feesPerDay?: number,
    level?: number,
    formValidation? :boolean;
  }
  
  export interface IFinancialsPermitsResponse extends IFinancialsPermits {
    data : any;
   }
  
  export type TFormModes = "add" | "edit" | "show";
  