export interface IEconomicClassification {
  code: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  beneficiaryAgencyName?: string;
  beneficiaryAgencyId: number;
  status?: boolean;
  formValidation?: boolean;
  id? : number;
}

export interface IEconomicClassificationResponse
  extends IEconomicClassification {
    data : any;
  }

export type TFormModes = "add" | "edit" | "show" | "toggleActivation";
