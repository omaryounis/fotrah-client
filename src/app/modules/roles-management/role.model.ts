import { IPermission } from "@shared/models/permission.model";

export interface IRole {
  id?: number;
  nameAr: string;
  nameEn: string;
  permissions?: number[];
  usersPerRoleCount?: number;
  status?: string;
  formValidation? : boolean;
}

export interface IRoleResponse {
  code: string;
  message: string;

  data: {
    roles: IRole[];
    totalCount : number;

  };
}
export interface ISelectValue {
  value?: number;
  name?: string;
}
export type TFormModes = "add" | "edit" | "show";
