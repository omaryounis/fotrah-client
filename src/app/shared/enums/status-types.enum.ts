export enum StatusTypes {
    PENDING = "Pending" ,
    APPROVED = "Approved" ,
    COMPLETED ="Completed" ,
    REJECTED = "Rejected",
    UNDER_EVALUATE = "Under Evaluation",
    UNDER_REVIEW = "Under Review by Comittee Coordinator",
    PENDING_AR = "تحت الاجراء",
    COMPLETED_AR =  "مكتمل",
    APPROVED_AR = "موافقة مبدئية" ,
    UNDER_EVALUATE_AR = "تحت التدقيق",
    UNDER_REVIEW_AR = "محال للأمين",
    REJECTED_AR = "مرفوض",
}
export enum StatusEnum {
    PENDING = 1,           // Pending
    APPROVED = 2,          // Initial Approval
    COMPLETED = 3,         // Completed
    REJECTED = 4           // Rejected
  }

  export enum ObjectionStatusEnum {
    PENDING = 1,           // Pending
    Under_Review_by_Comittee_Coordinator = 2,          // coordinator
    Under_Evaluation = 3,         // voting phase
    Accepted = 4,           // accepted 
    Rejected = 5,           // Rejected
    Under_Operational_Review = 6          
  }