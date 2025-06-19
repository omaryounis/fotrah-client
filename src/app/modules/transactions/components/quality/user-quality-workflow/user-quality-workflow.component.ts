import { Component, Input } from "@angular/core";
import { IQualityMission, IQualityProgressRequest, IReturnRequest, IVoteRequest } from "../models/quality.model";
import { QualityService } from "@shared/services/quality/quality.service";
import { LanguageService } from "@shared/services/language/language.service";
import { MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { UserQualityFormComponent } from "../user-quality-form/user-quality-form.component";
import { ButtonModule } from "primeng/button";
import { ObjectionStatusEnum } from "@shared/enums/status-types.enum";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Component({
  selector: "app-user-quality-workflow",
  standalone: true,
  imports: [UserQualityFormComponent, ButtonModule],
  templateUrl: "./user-quality-workflow.component.html",
  styleUrl: "./user-quality-workflow.component.scss",
})
export class UserQualityWorkflowComponent {
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
    this.ref = this.dialogService.open(UserQualityFormComponent, {
      header: this.langService.getInstantTranslation(
        this.isVoting() ? "voting-stage" : "confirmation"
      ),
      styleClass: "crud-modal",
      maximizable: true,
      style: { width: "60rem" },
      data: {
        taskData: this.rowData,

        /*
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
 if(this.taskData.status == ObjectionStatusEnum.Under_Review_by_Comittee_Coordinator && this.taskData.currentStatus == ObjectionStatusEnum.Returned_Back_To_Objector.toString()){
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
          },
          onCancel: () => {
            this.ref?.close();
          },
        },

*/
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
    const currentVoteStatus = voteStatus ?? null;
    const currentObjectionNumber = objectionNumber ?? null;
    const currentStatus = status ?? null;
    const currentObjectorName = objectorName ?? null;
    const currentFinItemId = finItemId ?? null;

    this.qualityService
      .getUserQualityMissions(
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
