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
    REJECTED = 4 ,          // Rejected
  }