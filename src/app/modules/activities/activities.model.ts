export interface IActivity {
  code?: string;
  nameAr?: string;
  nameEn?: string;
  sector?: string;
  status?: boolean;
  formValidation?: boolean;
  activatedDate?: Date | null;
  expiryPeriods?: number;
  nicGroupId?: number;
  stopDate?: string;
  toBeActivatedDate?: string;
  toBeStopDate?: string;
  gfSsId?: number;
  gfsTitle?: string;
  id?: number;
  description?: string;
}

export interface IActivityResponse extends IActivity {
  data?: any;
}

export type TFormModes = "add" | "edit" | "show" | "toggleActivation";
