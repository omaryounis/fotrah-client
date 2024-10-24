export interface IUserCredentials {
  userName: string;
  password: string;
}

export interface IUserInfo {
  email: string;
  pwdHash: string | null
  pwdSalt: string | null;
  roleId: string | null;
  fullName: string;
  userName: string;
  mobileNumber: string;
  accessToken: string;
  refreshToken: string;
}
