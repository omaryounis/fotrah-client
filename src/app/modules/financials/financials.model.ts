export interface IFinancial {
  id? : number;
  activityName? :  string;
  categoryName? :  string;
  status? :  boolean
  code? : string;
  nameAr? : string;
  nameEn? : string;
  activityId? : number;
  categoryId? : number;
  gfsId? : number;
  amount? : number;
  isRecurring? : boolean;
  formValidation? : boolean;
}

export interface IFinancialResponse extends IFinancial {
  data : any;
 }

export type TFormModes = "add" | "edit" | "show" | "toggleActivation";
