export interface IQualityMission {
    objectionRequestLogId: number;
    objectionNumber: string;
    objectorId: number;
    objectorName: string;
    billNumber: string;
    objectorMobileNumber: string; 
    note: string;
    status: number;
    statusName: string;
    objectionReason: string | null;  
    createdAt: string;
    finCategoryId: number;
    finCategoryName: string;
    attachments: IAttachmentDetail[];
    votes: IVoteDetail[];
    returnDetails: IReturnDetail[];
    voteProgressStatus: string | null; 
    lastStatus: string | null; 
    fieldVisitDate: string;  
    financialItem: string;
    objectionCommunications: IObjectionCommunications[]; 
    currentStatus: string;
    uploadedFiles: File[];
    department:string;
    reason:string


  }
export interface IAttachmentDetail {
    fileName: string;
    contentType: string;
    filePath: string;
    attachmentTypeId: number;
    version?: number
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
  
 
  
  export interface IQualityMissionResponse {
    data: any;
  }

  export interface IVoteRequest {
    id?: number | null; //not null in case of update the vote
    objectionRequestLogId: number;
    vote: boolean;
    reasons?: string[];
    comment?: string;
  }
  export interface IReturnDetail {
      returnReason: string;
      objectorResponse: string;
      createdAt: string;
      createdBy: string;
      version: number;
  }
  export interface IObjectionCommunications{
    objectionCommunicationId: number;
    memberNotes?: string;
    operationsNotes?: string;
    senderId?: string;
    responderId?: string;
    sendDate?: string;
    responseDate?: string;
    version: number;
  }
  export interface IQualityProgressRequest {
    objectionRequestLogId: number;
    isEndVotingSession?: boolean;
    objectionReason?: string;
  }
  export interface IReturnRequest {
      objectionNumber: string;
      returnReason: string;
  }





export interface IObjectionCommunications{
    objectionCommunicationId: number;
    memberNotes?: string;
    operationsNotes?: string;
    senderId?: string;
    responderId?: string;
    sendDate?: string;
    responseDate?: string;
    version: number;
  }