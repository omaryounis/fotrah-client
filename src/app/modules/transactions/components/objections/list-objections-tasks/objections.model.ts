export interface IAttachmentDetail {
  fileName: string;
  contentType: string;
  filePath: string;
  attachmentTypeId: number;
}

export interface IVoteDetail {
  id: number;
  createdBy: string;
  voterName: string;
  vote: boolean;
  comment: string;
  roleId: number;
  roleName: string;
  createdAt: string;
}

export interface IObjectionMission {
  objectionRequestLogId: number;
  objectionNumber: string;
  objectorId: number;
  objectorName: string;
  billNumber: string;
  objectorMobileNumber: string;
  note: string;
  status: number;
  statusName?: string;
  objectionReason?: any;
  createdAt: string;
  finCategoryId: number;
  finCategoryName: string;
  operationsReview?: any;
  attachments: IAttachmentDetail[];
  votes?: IVoteDetail[];
  reasons?: string[];
  currentStatus: string;
  uploadedFiles: File[];
  lastStatus: number;
  fieldVisitDate: string;
  financialItem:string
}

export interface IObjectionMissionResponse {
  data: any;
}

export interface IObjectionProgressRequest {
  objectionRequestLogId: number;
  isEndVotingSession?: boolean;
  objectionReason?: string;
}

export interface IVoteRequest {
  id?: number | null; //not null in case of update the vote
  objectionRequestLogId: number;
  vote: boolean;
  reasons?: string[];
  comment?: string;
}
