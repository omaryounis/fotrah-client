export interface ITask {
  type: string;
  id?: string;
  date: string;
  sender: string;
  objectionReason?: string;
  status?: string;
  reasons? : string[];
  updatedVote? : boolean;
  requestTypeId?: number;
  requestType?: string;
  requestStatusId?: number;
  requestStatus?: string;
  createdAt?: string;
}

export interface ITaskDetails {
  id: string;
  nameAr: string;
  nameEn: string;
  area: string;
  city: string;
  nic: string;
  isAccepted: boolean;
  rejectionReason: string;
}
export interface ITaskConfirm {
  requestId: number;
  workflowType: number;
  vote?: boolean;
  comment?: string;
  reasons? : string[];
  objectionReason?: string;
}

export interface IRegion {
  name: string;
  code: string;
}

export interface ITaskResponse extends ITask {
  data: any;
}

export type TFormModes = "edit" | "show";
