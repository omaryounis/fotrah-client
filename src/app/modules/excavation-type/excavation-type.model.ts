export interface IExcavationType {
  nameAr?: string,
  nameEn?: string,
  code?: string,
  descriptionEn?: string,
  descriptionAr?: string,
  formValidation? : boolean;
  status? : boolean;
}

export interface IExcavationTypeResponse extends IExcavationType {
  data?: any;
}

export type TFormModes = "add" | "edit" | "show" | "toggleActivation";
