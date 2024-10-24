export interface IMunicipalities {
  code?: number;
  nameEn?: string;
  nameAr?: string;
  regionName?: string;
  regionNameAr?: string;
  classificationName?: string;
  classificationNameAr?: string;
  regionId?: number;
  classificationId?: number;
  status?: boolean;
  formValidation?: boolean;
  id? :number;
}

export interface IMunicipalitiesResponse extends IMunicipalities {
  data : any;
}

export type TFormModes = "add" | "show" | "edit" | "toggleActivation";
