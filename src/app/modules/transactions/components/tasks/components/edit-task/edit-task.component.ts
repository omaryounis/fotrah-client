import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import {
  RequestTypes,
  TaskFormComponent,
} from "../task-form/task-form.component";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { ITask, ITaskConfirm } from "../../tasks.model";
import { TaskConfirmationComponent } from "../task-confirmation/task-confirmation.component";
import { TasksService } from "@shared/services/tasks/tasks.service";
import { MessageService } from "primeng/api";
import { LanguageService } from "@shared/services/language/language.service";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { StatusEnum, StatusTypes } from "@shared/enums/status-types.enum";
import { LoginService } from "@shared/services/login/login.service";

@Component({
  selector: "app-edit-task",
  standalone: true,
  imports: [ButtonModule, TaskFormComponent],
  templateUrl: "./edit-task.component.html",
  styleUrl: "./edit-task.component.scss",
})
export class EditTaskComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;

  @Input() rowData: ITask = {} as ITask;
  get taskData() {
    return this.taskService.rowData();
  }
  ref!: DynamicDialogRef;

  constructor(
    private dialogService: DialogService,
    private langService: LanguageService,
    private taskService: TasksService,
    private message: MessageService,
    private lang: LanguageService,
    private loginService: LoginService
  ) {}

  openEditModal(event: any) {
     
      event.stopPropagation();
    this.ref = this.dialogService.open(TaskFormComponent, {
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
             
            var status = this.taskData.requestStatusId;
            if (this.isVoting()) {
              var vote = this.taskData.status == "accept" ? true : false;
              var data = {
                requestId: parseInt(this.taskData.id!),
                workflowType: this.taskData.requestTypeId!,
                vote: vote,
              } as ITaskConfirm;
            
                if ((!this.taskData.objectionReason || this.taskData.objectionReason == '') && this.taskData.reasons?.length == 0) {
                  this.message.add({
                    severity: "error",
                    summary:
                      this.langService.getInstantTranslation("error"),
                    detail: this.langService.getInstantTranslation("objection-reason-required"),
                  });
                  return;
                }
                data.comment = this.taskData.objectionReason;
                data.reasons = this.taskData.reasons;
                this.onVoting(data)
            } else {
           
                if (this.taskData.status == "accept") {
                  var approveType =
                    status == StatusEnum.PENDING ? "InitialApprove"
                      : "FinalApprove";
                  var approve_data = {
                    requestId: parseInt(this.taskData.id!),
                    workflowType: this.taskData.requestTypeId!,
                  } as any;
                   
                  if (
                    this.taskData.requestTypeId == RequestTypes.OBJECTION && this.taskData.requestStatusId == StatusEnum.REJECTED
                  ) {
                     
                    if ((!this.taskData.objectionReason || this.taskData.objectionReason == '') && this.taskData.reasons?.length == 0) {
                      this.message.add({
                        severity: "error",
                        summary:
                          this.langService.getInstantTranslation("error"),
                        detail: this.langService.getInstantTranslation("objection-reason-required"),
                      });
                      return;
                    }
                    approve_data.objectionReason = this.taskData.objectionReason;
                  }
                  this.onConfirmTask(approve_data, approveType);
              
                } else {
                  this.taskService
                    .RejectTask(parseInt(this.taskData.id!))
                    .subscribe((res) => {
                      if (res.message == MessagesResponse.SUCCESS) {
                        this.ref?.close();
                        this.message.add({
                          severity: "info",
                          summary: this.lang.getInstantTranslation("done"),
                          detail:
                            this.lang.getInstantTranslation("reject-process"),
                        });
                        this.fillTasks();
                      } else {
                        this.message.add({
                          severity: "error",
                          summary:
                            this.langService.getInstantTranslation("error"),
                          detail: res.message,
                        });
                      }
                    });
                }
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
  onConfirmTask(approve_data: any, approveType: string ) {
    if (
      this.taskData.requestTypeId == RequestTypes.OBJECTION &&
      this.taskData.requestStatusId == StatusEnum.APPROVED 
    ) { 
      this.taskService
      .endVoteSession(approve_data)
      .subscribe((res) => {
        if (res.message == MessagesResponse.SUCCESS) {
          this.ref?.close();
          this.message.add({
            severity: "success",
            summary: this.lang.getInstantTranslation("done"),
            detail:
              this.lang.getInstantTranslation("done-process"),
          });
          this.fillTasks();
        } else {
          this.message.add({
            severity: "error",
            summary:
              this.langService.getInstantTranslation("error"),
            detail: res.message,
          });
        }
      });
      return;
    }
    this.taskService
    .ConfirmTask(approve_data, approveType)
    .subscribe((res) => {
      if (res.message == MessagesResponse.SUCCESS) {
        this.ref?.close();
        this.message.add({
          severity: "success",
          summary: this.lang.getInstantTranslation("done"),
          detail:
            this.lang.getInstantTranslation("done-process"),
        });
        this.fillTasks();
      } else {
        this.message.add({
          severity: "error",
          summary:
            this.langService.getInstantTranslation("error"),
          detail: res.message,
        });
      }
    });
  }
  onVoting(data: ITaskConfirm) {
    if (this.taskData.updatedVote) {
      this.taskService.updateVoteTask(data).subscribe((res) => {
        if (res.message == MessagesResponse.SUCCESS) {
          this.ref?.close();
          this.message.add({
            severity: "success",
            summary: this.lang.getInstantTranslation("done"),
            detail: this.lang.getInstantTranslation("update-voting-succefully"),
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
      return;
    }
    this.taskService.VoteTask(data).subscribe((res) => {
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
  isVoting = () :boolean => this.rowData.requestStatusId == StatusEnum.APPROVED && this.rowData?.requestTypeId == RequestTypes.OBJECTION &&  this.loginService.hasPermission([
    "Add_NotSerious_Objection_Member_Vote",
    "Add_Objection_Member_Vote",
  ]) ? true : false;
  fillTasks = () => this.taskService.getTasks("1", 10).subscribe();
}
