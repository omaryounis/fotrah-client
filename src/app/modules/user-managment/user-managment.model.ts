import { IRole } from "../roles-management/role.model";

export interface IUser {
  id?: number;
  name: string;
  fullName?: string;
  email: string;
  nationalId?: string;
  identityNumber?: string;
  phoneNumber: string;
  mobileNumber?: string;
  userName?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  status?: boolean;
  roles?: any[];
  permissions?: any[];
}

export interface IUserResponse extends IUser { }

export type TFormModes = "add" | "edit" | "show" | "delete" | "toggleActivation";
