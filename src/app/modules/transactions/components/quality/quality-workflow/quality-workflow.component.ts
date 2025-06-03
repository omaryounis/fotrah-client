import { Component, Input } from "@angular/core";
import { IQualityMission, IQualityProgressRequest, IReturnRequest, IVoteRequest } from "../models/quality.model";
import { QualityService } from "@shared/services/quality/quality.service";
import { LanguageService } from "@shared/services/language/language.service";
import { MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { QualityFormComponent } from "../quality-form/quality-form.component";
import { ButtonModule } from "primeng/button";
import { ObjectionStatusEnum } from "@shared/enums/status-types.enum";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Component({
  selector: "app-quality-workflow",
  standalone: true,
  imports: [QualityFormComponent, ButtonModule],
  templateUrl: "./quality-workflow.component.html",
  styleUrl: "./quality-workflow.component.scss",
})
export class QualityWorkflowComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() status?: number;
  @Input() queryParams?: { [key: string]: any };
  @Input() rowData: IQualityMission = {} as IQualityMission;

  userData: any;
  submitted: any;
  ref!: DynamicDialogRef;

  get taskData() {
    return this.qualityService.rowData();
  }

  constructor(
    private qualityService: QualityService,
    private langService: LanguageService,
    private message: MessageService,
    private dialogService: DialogService
  ) {}

  openEditModal(event: any) {
    event.stopPropagation;
    this.ref = this.dialogService.open(QualityFormComponent, {
      header: this.langService.getInstantTranslation(
        this.isVoting() ? "voting-stage" : "confirmation"
      ),
      styleClass: "crud-modal",
      maximizable: true,
      style: { width: "60rem" },
      data: {
        taskData: this.rowData,

        footer: {
          submitLabel: "confirm",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.submitted = true;
            if(!this.taskData.currentStatus){
              this.message.add({
                severity: "error",
                summary: this.langService.getInstantTranslation("error"),
                detail: "Please Select Option to proceed your request",
              });
            }

            if (this.taskData.status == ObjectionStatusEnum.Under_Review_by_Comittee_Coordinator && this.taskData.currentStatus == ObjectionStatusEnum.Under_Evaluation.toString()) {
              const formData = new FormData();
              formData.append('objectionRequestLogId', this.taskData.objectionRequestLogId.toString());
              
              if (this.taskData.uploadedFiles && this.taskData.uploadedFiles.length > 0) {
                this.taskData.uploadedFiles.forEach(file => {
                  formData.append('attachments', file, file.name);
                })};
              // var data = {
              //   objectionRequestLogId:this.taskData.objectionRequestLogId
              // } as IObjectionProgressRequest;

              this.qualityService.proceedObjection(formData).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.langService.getInstantTranslation("done"),
                    detail: this.langService.getInstantTranslation("done-process"),
                  });
                  
                  this.fillTasks();
                } else {
                  this.message.add({
                    severity: "error",
                    summary: this.langService.getInstantTranslation("error"),
                    detail: res.message,
                  });
                }
              });
            }else if(this.taskData.status == ObjectionStatusEnum.Under_Review_by_Comittee_Coordinator && this.taskData.currentStatus == ObjectionStatusEnum.Returned_Back_To_Objector.toString()){
              if ((!this.taskData.objectionReason || this.taskData.objectionReason == '')) {
                this.message.add({
                  severity: "error",
                  summary:
                    this.langService.getInstantTranslation("error"),
                  detail: this.langService.getInstantTranslation("return-reason-required"),
                });
                return;
              }
              const data: IReturnRequest = {
                objectionNumber: this.taskData.objectionNumber,
                returnReason: this.taskData.objectionReason
              };

              this.qualityService.sendBackToObjector(data).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.langService.getInstantTranslation("done"),
                    detail: this.langService.getInstantTranslation("done-process"),
                  });
                  this.fillTasks();
                } else {
                  this.message.add({
                    severity: "error",
                    summary: this.langService.getInstantTranslation("error"),
                    detail: res.message,
                  });
                }
              });
            }
            else if(this.taskData.status == ObjectionStatusEnum.Under_Evaluation
              &&(this.taskData.currentStatus == ObjectionStatusEnum.Accepted.toString()||this.taskData.currentStatus == ObjectionStatusEnum.Rejected.toString() ) ){
             var vote = this.taskData.currentStatus == ObjectionStatusEnum.Accepted.toString() ? true : false;
             if ((!this.taskData.objectionReason || this.taskData.objectionReason == '')) {
               this.message.add({
                 severity: "error",
                 summary:
                   this.langService.getInstantTranslation("error"),
                 detail: this.langService.getInstantTranslation("objection-reason-required"),
               });
               return;
             }
             
            // handle updating vote, get the vote id if exist
             var token = localStorage.getItem('accessToken')!;
             this.userData = jwtDecode(token) as JwtPayload & {sid : ''};
             let voteId: number | null = null;
             this.taskData.votes?.forEach(vote => {
               if (vote.createdBy === this.userData.sid) {
                 voteId = vote.id; 
               }
             });

             var voteRequest = {
               id:voteId,
               vote:vote,
               objectionRequestLogId :this.taskData.objectionRequestLogId
             } as IVoteRequest;
     
             
             if(this.taskData.objectionReason && this.taskData.objectionReason != ''){
               voteRequest.comment = this.taskData.objectionReason
             }
             this.qualityService.vote(voteRequest).subscribe((res) => {
               if (res.message == MessagesResponse.SUCCESS && voteId === null) {
                 this.ref?.close();
                 this.message.add({
                   severity: "success",
                   summary: this.langService.getInstantTranslation("done"),
                   detail: this.langService.getInstantTranslation("voting-succefully"),
                 });
                 this.fillTasks();
               }else if(res.message == MessagesResponse.SUCCESS && voteId !== null){
                 this.ref?.close();
                 this.message.add({
                   severity: "success",
                   summary: this.langService.getInstantTranslation("done"),
                   detail: this.langService.getInstantTranslation("update-voting-succefully"),
                 });
                 this.fillTasks();

               }
                else {
                 this.message.add({
                   severity: "error",
                   summary: this.langService.getInstantTranslation("error"),
                   detail: res.message,
                 });
               }
             });

           } 
           else if(this.taskData.currentStatus == "end-vote"){
             var data = {
               objectionRequestLogId:this.taskData.objectionRequestLogId,
               isEndVotingSession: true
             } as IQualityProgressRequest;
             this.qualityService.finalDesicision(data).subscribe((res) => {
               if (res.message == MessagesResponse.SUCCESS) {
                 this.ref?.close();
                 this.message.add({
                   severity: "success",
                   summary: this.langService.getInstantTranslation("done"),
                   detail: this.langService.getInstantTranslation("done-voting-session"),
                 });
                 this.fillTasks();
               } else {
                 this.message.add({
                   severity: "error",
                   summary: this.langService.getInstantTranslation("error"),
                   detail: res.message,
                 });
               }
             });
           }
           else if ((this.taskData.status.toString() == ObjectionStatusEnum.Accepted.toString()|| ObjectionStatusEnum.Rejected.toString()) && this.taskData.currentStatus == ObjectionStatusEnum.Accepted.toString())
            {
              var data = {
                objectionRequestLogId:this.taskData.objectionRequestLogId,
                isEndVotingSession: false,
                objectionReason:this.taskData.objectionReason
              } as IQualityProgressRequest;
              this.qualityService.finalDesicision(data).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.langService.getInstantTranslation("done"),
                    detail: this.langService.getInstantTranslation("done-process"),
                  });
                  this.fillTasks();
                } else {
                  this.message.add({
                    severity: "error",
                    summary: this.langService.getInstantTranslation("error"),
                    detail: res.message,
                  });
                }
              });
            } 
          },
          onCancel: () => {
            this.ref?.close();
          },
        },
      },
      templates: {
        footer: CrudModalFooterComponent,
      },
    });
   
  }
  isVoting = (): boolean =>
    this.taskData.status == ObjectionStatusEnum.Under_Evaluation
      ? true
      : false;
  fillTasks = () => {
    const {
      pageIndex,
      pageSize,
      voteStatus,
      objectionNumber,
      status,
      objectorName,
      finItemId,
    } = this.queryParams || {};

    const currentPageIndex = pageIndex ?? 1;
    const currentPageSize = pageSize ?? 10;
    const currentVoteStatus = voteStatus ?? undefined;
    const currentObjectionNumber = objectionNumber ?? undefined;
    const currentStatus = status ?? undefined;
    const currentObjectorName = objectorName ?? undefined;
    const currentFinItemId = finItemId ?? undefined;

    this.qualityService
      .getQualityMissions(
        currentPageIndex.toString(),
        currentPageSize,
        currentStatus,
        currentObjectionNumber,
        currentVoteStatus,
        currentObjectorName,
        currentFinItemId
      )
      .subscribe();
  };
}
