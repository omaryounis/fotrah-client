import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import {
  IRegion,
  ITask,
  ITaskDetails,
  TFormModes,
} from "../../tasks/tasks.model";
import { TasksService } from "@shared/services/tasks/tasks.service";
import { TranslateModule } from "@ngx-translate/core";
import { InputTextareaModule } from "primeng/inputtextarea";
import { AttachmentTypes } from "@shared/enums/attachment-types.enum";
import {
  ObjectionStatusEnum,
  StatusEnum,
  StatusTypes,
} from "@shared/enums/status-types.enum";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { environment } from "@root/src/environments/environment";
import { MultiSelectModule } from "primeng/multiselect";
import { VoteReasonsService } from "@shared/services/loockups/vote_reasons.service";
import { ObjectionService } from "@shared/services/objection/objection.service";
import { IObjectionMission } from "../list-objections-tasks/objections.model";
import { LoginService } from "@shared/services/login/login.service";
import { MessageService } from "primeng/api";
import { LanguageService } from "@shared/services/language/language.service";
import { FileUploadModule,FileSelectEvent } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: "app-objection-form",
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
    FileUploadModule
  ],
  templateUrl: "./objection-form.component.html",
  styleUrl: "./objection-form.component.scss",
})
export class ObjectionFormComponent implements OnInit {
  mode: TFormModes = "edit";
  // details = [{ key: '', value: '' }];
  // votes = [{ key: '', value: '' }];
  attachments: any[] = [];
  votes: any[] = [];
  vote_reasons: any[] = [];
  selected_reasons: string[] = [];

  taskData: IObjectionMission = {
    objectionRequestLogId: 0,
    objectionNumber: "",
    objectorId: 0,
    objectorName: "",
    billNumber: "",
    objectorMobileNumber: "",
    note: "",
    status: 0,
    createdAt: new Date().toISOString(),
    finCategoryId: 0,
    finCategoryName: "",
    attachments: [],
    votes: [],
    reasons: [],
    currentStatus: "",
    uploadedFiles: [],
    lastStatus: 0,
    fieldVisitDate:"",
    financialItem:""
  };
  AttachmentTypes = AttachmentTypes
  requestTypes = RequestTypes;
  statusTypes = StatusEnum;
  ObjectionStatusTypes = ObjectionStatusEnum;

  regions: IRegion[] | undefined;
  // currentStatus: string = '';
  selectedRegions: IRegion | undefined;
  is_valid_reject: boolean = true;
  is_collapsed: boolean = false;
  is_voting: boolean = false;
  hasOperationsReview: boolean = false;

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private objectionService: ObjectionService,
    private reasonService: VoteReasonsService,
    private loginService: LoginService,
    private message: MessageService,
    private langService: LanguageService
  ) {}
  taskDataArray: { key: string; value: string }[] = [];

  ngOnInit(): void {
    this.taskData = this.dynamicDialogConfig.data.taskData;

    this.taskData.reasons = [];
    this.taskData.uploadedFiles = [];
    this.taskDataArray = Object.entries(this.taskData).map(([key, value]) => ({
      key,
      value,
    }));
    const dateLang = this.langService.getDateFormat();
    this.taskDataArray = [
      { key: "ObjectionNumber", value: this.taskData.objectionNumber },
      { key: "ObjectorId", value: this.taskData.objectorId.toString() },
      { key: "ObjectorName", value: this.taskData.objectorName },
      { key: "BillNumber", value: this.taskData.billNumber },
      {
        key: "ObjectorMobileNumber",
        value: this.taskData.objectorMobileNumber,
      },
      { key: "note", value: this.taskData.note },
      { key: "objection-creation-date" ,value: new Date(this.taskData.createdAt).toLocaleDateString(
        dateLang, { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true  
        })  
       },
      { key: "FinancialItem", value: this.taskData.financialItem },

      { key: "FinCategoryName", value: this.taskData.finCategoryName },
      { key:"Field-visit-date", value: new Date(this.taskData.fieldVisitDate).toLocaleDateString(dateLang, { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true  
      })  }
    ];
    this.attachments = this.groupingAttachments(this.taskData.attachments);

    this.updateData();
    if (
      this.taskData.status ==
      ObjectionStatusEnum.Under_Review_by_Comittee_Coordinator
    ) {
      this.taskData.currentStatus =
        ObjectionStatusEnum.Under_Evaluation.toString();
    } 
    else if (
      this.taskData.status == ObjectionStatusEnum.Accepted ||
      this.taskData.status == ObjectionStatusEnum.Rejected
    ) {
      this.taskData.currentStatus = ObjectionStatusEnum.Accepted.toString();
    }

    // this.attachments = this.groupingAttachments(this.taskData.attachments)
    this.votes = this.taskData.votes || [];
    this.reasonService
      .getAll()
      .subscribe((res) => (this.vote_reasons = res.data));
    this.mode = this.dynamicDialogConfig.data.mode || "edit";
    this.hasOperationsReview = this.attachments.some(attachment => attachment.type === AttachmentTypes.OPERATIONS_DOCUMENTS) || this.taskData.operationsReview;

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
      
      // for testing :
      // const fileUrl = base64File.replace(
      //   /\\\\ripctest\.loc\\ripctestdfs\\Objections\\|C:\\inetpub\\wwwroot\\Fotrah\\objections\\/g,
      //   window.origin + "/test/"
      // );
      window.open(fileUrl, "_blank");
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
  updateData = () => {
    this.objectionService.rowData.set(this.taskData);
  };
  // updateData = () => this.taskService.rowData.set(this.taskData);
  groupingAttachments(attachment_list: any[]): any[] {
    const formattedAttachments = attachment_list.reduce(
      (result, attachment) => {
        // Check if attachmentTypeId is null and replace with "4"
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

  // onFileUpload(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     this.taskData.uploadedFiles = Array.from(input.files);
  //   }
  // }
  // onFileUpload(event: FileSelectEvent): void {
  //   debugger;
  //   if (event.files) {
  //     let selectedFiles = Array.from(event.files);
  
  //     if (selectedFiles.length + this.taskData.uploadedFiles.length > 3) {
  //       // Reset 
  //       selectedFiles = [];
        
  //       this.message.add({
  //         severity: "error",
  //         summary: this.langService.getInstantTranslation("error"),
  //         detail: this.langService.getInstantTranslation("max-three-attachment"),
  //       });
  //       event.files = [];
  //       return;
  //     } else {
  //       this.taskData.uploadedFiles = [...this.taskData.uploadedFiles, ...selectedFiles];
  
       
  //     }
    
  
  //     // Limit to the first three files
  //     // this.taskData.uploadedFiles = selectedFiles.slice(0, 3);
  //     // input.value = "";
  //   }
  // }
  onFileUpload(event: FileSelectEvent): void {
    const selectedFiles = Array.from(event.files);
    const maxFiles = 3;
  
    // Check if the total number of files (existing + new) exceeds the limit
    if (this.taskData.uploadedFiles.length + selectedFiles.length > maxFiles) {
      // Show an error message
      this.message.add({
        severity: 'error',
        summary: 'File Limit Exceeded',
        detail: `You can only upload a maximum of ${maxFiles} files.`
      });
  
      // const filesToAdd = selectedFiles.slice(0, maxFiles - this.taskData.uploadedFiles.length);
      // this.taskData.uploadedFiles = [...this.taskData.uploadedFiles, ...filesToAdd];
      return
    } else {
      // Add all selected files if they do not exceed the limit
      this.taskData.uploadedFiles = [...this.taskData.uploadedFiles, ...selectedFiles];
    }
  }
  
  removeAttachment(index: number) {
    this.taskData.uploadedFiles.splice(index, 1);
  }
  splitString(data: string) {
    return data.split(/[&|]/);
  }
  clearAllFiles(): void {
    this.taskData.uploadedFiles = [];
  }
  onFileRemove(event: { file: File }): void {
    const fileIndex = this.taskData.uploadedFiles.indexOf(event.file);
    
    if (fileIndex !== -1) {
      this.taskData.uploadedFiles.splice(fileIndex, 1);
    }
  }
  isCoordinator(): boolean {
    return this.loginService.hasPermission([
      "Procceed_NotSerious_Objection_CommitteeCoordinator",
      "Procceed_Objection_CommitteeCoordinator",
    ]);
  }
  getAttachmnetTitle = (type: number): string =>
    type === AttachmentTypes.VIOLATION_REPORT
      ? "violation-report"
      : type === AttachmentTypes.SUPPORTED_DOCUMNETS
      ? "supported-documents"
      : type === AttachmentTypes.OPERATIONS_DOCUMENTS
      ? "operations-documents"
      : type === AttachmentTypes.COORDINATOR_DOCUMENTS
      ? "coordinator-documents"
      : "";
  // checkHasDescription = () :boolean =>  this.details.some(a => a.key.toLocaleLowerCase().includes('description'))
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
