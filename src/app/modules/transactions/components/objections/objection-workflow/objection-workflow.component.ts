import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";


import { RequestTypes,TaskFormComponent } from "../../tasks/components/task-form/task-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { ITask,ITaskConfirm } from "../../tasks/tasks.model";
import { TaskConfirmationComponent } from "../../tasks/components/task-confirmation/task-confirmation.component";
import { TasksService } from "@shared/services/tasks/tasks.service";
import { MessageService } from "primeng/api";
import { LanguageService } from "@shared/services/language/language.service";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { ObjectionStatusEnum, StatusEnum, StatusTypes } from "@shared/enums/status-types.enum";
import { LoginService } from "@shared/services/login/login.service";
import { ObjectionFormComponent } from "../objection-form/objection-form.component";
import { ObjectionService } from "@shared/services/objection/objection.service";
import { IObjectionMission,IAttachmentDetail, IObjectionProgressRequest, IVoteDetail ,IVoteRequest} from "../list-objections-tasks/objections.model";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { takeWhile } from "rxjs";

@Component({
  selector: 'app-objection-workflow',
standalone: true,
  imports: [ButtonModule, TaskFormComponent],
  templateUrl: './objection-workflow.component.html',
  styleUrl: './objection-workflow.component.scss'
})
export class ObjectionWorkflowComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  userData: any;
  submitted:any;

  @Input() rowData: IObjectionMission = {} as IObjectionMission;
  get taskData() {
    return this.objctionService.rowData();
  }

  ref!: DynamicDialogRef;

  constructor(
    private dialogService: DialogService,
    private langService: LanguageService,
    private taskService: TasksService,
    private message: MessageService,
    private lang: LanguageService,
    private loginService: LoginService,
    private objctionService:ObjectionService
  ) {}

  openEditModal(event: any) {
    
      event.stopPropagation();
    this.ref = this.dialogService.open(ObjectionFormComponent, {
      header: this.langService.getInstantTranslation(this.isVoting() ? "voting-stage" : "confirmation"),
      styleClass: "crud-modal",
      maximizable : true,
      style : {width : "60rem"},
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
            if (this.taskData.currentStatus == ObjectionStatusEnum.Under_Evaluation.toString()) {
              const formData = new FormData();
              formData.append('objectionRequestLogId', this.taskData.objectionRequestLogId.toString());
              
              if (this.taskData.uploadedFiles && this.taskData.uploadedFiles.length > 0) {
                this.taskData.uploadedFiles.forEach(file => {
                  formData.append('attachments', file, file.name);
                })};
              // var data = {
              //   objectionRequestLogId:this.taskData.objectionRequestLogId
              // } as IObjectionProgressRequest;

              this.objctionService.proceedObjection(formData).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.lang.getInstantTranslation("done"),
                    detail: this.lang.getInstantTranslation("done-process"),
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
            else if(this.taskData.currentStatus==ObjectionStatusEnum.Under_Operational_Review.toString()){
              var data = {
                objectionRequestLogId:this.taskData.objectionRequestLogId
              } as IObjectionProgressRequest;
              this.objctionService.sendtoOperations(data).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.lang.getInstantTranslation("done"),
                    detail: this.lang.getInstantTranslation("done-process"),
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
              debugger;
              if ((!this.taskData.objectionReason || this.taskData.objectionReason == '') && this.taskData.reasons?.length == 0) {
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
                reasons:this.taskData.reasons,
                objectionRequestLogId :this.taskData.objectionRequestLogId
              } as IVoteRequest;
              if(this.taskData.objectionReason && this.taskData.objectionReason != ''){
                voteRequest.comment = this.taskData.objectionReason
              }
              this.objctionService.vote(voteRequest).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.lang.getInstantTranslation("done"),
                    detail: this.lang.getInstantTranslation("voting-succefully"),
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
            else if(this.taskData.currentStatus == "end-vote"){
              var data = {
                objectionRequestLogId:this.taskData.objectionRequestLogId,
                isEndVotingSession: true
              } as IObjectionProgressRequest;
              this.objctionService.finalDesicision(data).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.lang.getInstantTranslation("done"),
                    detail: this.lang.getInstantTranslation("done-process"),
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
            else if(this.taskData.status == ObjectionStatusEnum.Under_Operational_Review && this.taskData.currentStatus == ObjectionStatusEnum.Under_Review_by_Comittee_Coordinator.toString()){
              const formData = new FormData();
              formData.append('objectionRequestLogId', this.taskData.objectionRequestLogId.toString());
              formData.append('comment', this.taskData.operationsReview);
          
              if (this.taskData.uploadedFiles && this.taskData.uploadedFiles.length > 0) {
                this.taskData.uploadedFiles.forEach(file => {
                  formData.append('attachments', file, file.name);
                })};
                console.log("objectionRequestLogId:", formData.get('objectionRequestLogId'));
                console.log("comment:", formData.get('comment'));
                
                console.log("attachments:", formData.getAll('attachments'));
                
              this.objctionService.OperationReview(formData).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.lang.getInstantTranslation("done"),
                    detail: this.lang.getInstantTranslation("done-process"),
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
              } as IObjectionProgressRequest;
              this.objctionService.finalDesicision(data).subscribe((res) => {
                if (res.message == MessagesResponse.SUCCESS) {
                  this.ref?.close();
                  this.message.add({
                    severity: "success",
                    summary: this.lang.getInstantTranslation("done"),
                    detail: this.lang.getInstantTranslation("done-process"),
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
    console.log(`objection ${this.taskData.currentStatus}`)
    console.log('objection Status>>', this.taskData.status);

  }
  isVoting = () :boolean => this.taskData.status == ObjectionStatusEnum.Under_Evaluation ? true : false ;
  fillTasks = () => this.objctionService.getObjections("1", 10).subscribe();
}
