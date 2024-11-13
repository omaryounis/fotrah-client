import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { IRegion, ITask, ITaskDetails, TFormModes } from "./../../tasks.model";
import { TasksService } from "@shared/services/tasks/tasks.service";
import { TranslateModule } from "@ngx-translate/core";
import { InputTextareaModule } from "primeng/inputtextarea";
import { AttachmentTypes } from "@shared/enums/attachment-types.enum";
import { StatusEnum, StatusTypes } from "@shared/enums/status-types.enum";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { environment } from "@root/src/environments/environment";
import { MultiSelectModule } from "primeng/multiselect";
import { VoteReasonsService } from "@shared/services/loockups/vote_reasons.service";
import { LoginService } from "@shared/services/login/login.service";

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    CommonModule,
    InputTextModule,
    RadioButtonModule,
    TranslateModule,
    InputTextareaModule,
    CardModule,
  ],
  templateUrl: "./task-form.component.html",
  styleUrl: "./task-form.component.scss",
})
export class TaskFormComponent implements OnInit {
  mode: TFormModes = "edit";
  details = [{ key: "", value: "" }];
  // votes = [{ key: '', value: '' }];
  attachments: any[] = [];
  votes: any[] = [];
  vote_reasons: any[] = [];
  selected_reasons: string[] = [];
  taskData: ITask = {
    id: "",
    type: "",
    date: "",
    sender: "",
    requestStatus: "",
    objectionReason: "",
    reasons: [],
    status: "accept",
    requestTypeId: 0,
  };
  requestTypes = RequestTypes;
  statusTypes = StatusEnum;
  regions: IRegion[] | undefined;

  selectedRegions: IRegion | undefined;
  is_valid_reject: boolean = true;
  is_collapsed: boolean = false;
  is_voting: boolean = false;
  is_updating_vote: boolean = false;

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private taskService: TasksService,
    private reasonService: VoteReasonsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.taskData = this.dynamicDialogConfig.data.taskData;
    this.taskData.reasons = [];
    this.taskService
      .getTaskDetails(parseInt(this.taskData.id!))
      .subscribe((res) => {
        this.details = res.data.details;
        this.votes = res.data.votes || [];
        if (
          this.votes.some(
            (a) => a.voterName === this.loginService.getUserInfo()?.userName
          )
        ) {
          this.taskData.updatedVote = true;
        }
        this.attachments = this.groupingAttachments(res.data.attachments);
      });
    this.updateData();
    this.reasonService
      .getAll()
      .subscribe((res) => (this.vote_reasons = res.data));
    this.taskData.status = "accept";
    this.mode = this.dynamicDialogConfig.data.mode || "edit";
  }
  downloadFile(base64File: string, fileName: string, isBase64: boolean) {
    if (isBase64) {
      const mimeType = this.getMimeType(base64File); // Optionally detect mime type
      const byteCharacters = atob(base64File);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType.mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } else {
      const fileUrl = base64File.replace(environment.filePath, window.origin  + '/objections/'); // Convert backslashes to forward slashes for file protocol
      window.open( fileUrl , '_blank');
    }
  }

  // Optional: Function to detect MIME type
  getMimeType(base64: string): any {
    if (base64.charAt(0) === "/")
      return { mimeType: "image/jpeg", ext: ".jpeg" };
    else if (base64.charAt(0) === "i")
      return { mimeType: "image/png", ext: ".png" };
    else if (base64.charAt(0) === "R")
      return { mimeType: "application/pdf", ext: ".pdf" };
    else return { mimeType: "application/pdf", ext: ".pdf" };
    // return mimeType;
  }
  updateData = () => this.taskService.rowData.set(this.taskData);

  groupingAttachments(attachment_list: any[]): any[] {
    const formattedAttachments = attachment_list.reduce(
      (result, attachment) => {
        // Check if attachmentTypeId is null and replace with "3"
        const type =
          attachment.attachmentTypeId === null
            ? AttachmentTypes.OTHER_DOCUMNETS
            : attachment.attachmentTypeId;
        // Initialize the array for this attachmentTypeId if it doesn't exist
        if (!result[type]) {
          result[type] = { type: type, data: [] };
        }
        // Push the attachment into the appropriate array
        result[type].data.push(attachment);
        return result;
      },
      {}
    );

    // Convert the result object to an array
    const formattedArray = Object.values(formattedAttachments);
    return formattedArray;
  }
  getApproveLabel(): string {
    if (
      this.taskData.requestTypeId == this.requestTypes.OBJECTION &&
      this.taskData.requestStatusId == this.statusTypes.APPROVED &&
      this.loginService.hasPermission([
        "Procceed_NotSerious_Objection_CommitteeCoordinator",
        "Procceed_Objection_CommitteeCoordinator",
      ])
    ) {
      this.is_valid_reject = false;
      return 'end-voting';
    }
    if (
      this.taskData.requestStatusId == StatusEnum.PENDING &&
      this.taskData.requestTypeId == RequestTypes.OBJECTION
    ) {
      this.is_valid_reject = false;
      return "proceed";
    }
    if (
      this.taskData.requestStatusId == StatusEnum.APPROVED &&
      this.taskData.requestTypeId == RequestTypes.OBJECTION
    ) {
      this.is_valid_reject = true;
      this.is_voting = true;
      return "vote-accept";
    }
    if (
      (this.taskData.requestStatusId == StatusEnum.COMPLETED ||
        this.taskData.requestStatusId == StatusEnum.REJECTED) &&
      this.taskData.requestTypeId == RequestTypes.OBJECTION
    ) {
      this.is_valid_reject = false;
      return "accept-final-vote";
    }

    return "accept";
  }
  splitString(data: string) {
    return data.split(/[&|]/);
  }
  getAttachmnetTitle = (type: number): string =>
    type === AttachmentTypes.VIOLATION_REPORT
      ? "violation-report"
      : type === AttachmentTypes.SUPPORTED_DOCUMNETS
      ? "supported-documents"
      : "";
  checkHasDescription = (): boolean =>
    this.details.some((a) => a.key.toLocaleLowerCase().includes("description"));

  checkIsvisible(): boolean {
     
    if (
      this.taskData.requestTypeId == this.requestTypes.OBJECTION &&
      this.taskData.requestStatusId == this.statusTypes.APPROVED &&
      this.loginService.hasPermission([
        "Procceed_NotSerious_Objection_CommitteeCoordinator",
        "Procceed_Objection_CommitteeCoordinator",
      ])
    ) {
      return false;
    } 
     if (
      this.taskData.requestTypeId == this.requestTypes.OBJECTION &&
      (this.taskData.requestStatusId == this.statusTypes.PENDING || this.taskData.requestStatusId == this.statusTypes.COMPLETED)
    ) {
      return false;
    } 
    
    return true;
  }
}
export enum RequestTypes {
  OBJECTION = 28,
}
// const linkSource = `data:${mimeType.mimeType};base64,${base64File}`;
// window.open(linkSource, '_blank');
// const downloadLink = document.createElement('a');
// downloadLink.href = linkSource;
// downloadLink.target = "_blank"
// downloadLink.download = (fileName ?? 'file') + mimeType.ext;
// downloadLink.click();
