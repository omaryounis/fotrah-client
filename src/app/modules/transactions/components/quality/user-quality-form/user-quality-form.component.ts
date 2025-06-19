import { Component } from "@angular/core";
import { TFormModes } from "../../tasks/tasks.model";
import { IQualityMission } from "../models/quality.model";
import { AttachmentTypes } from "@shared/enums/attachment-types.enum";
import { RequestTypes } from "../../objections/objection-form/objection-form.component";
import {
  ObjectionStatusEnum,
  StatusEnum,
} from "@shared/enums/status-types.enum";
import { Button, ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { RadioButtonModule } from "primeng/radiobutton";
import { TranslateModule } from "@ngx-translate/core";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { QualityService } from "@shared/services/quality/quality.service";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { LoginService } from "@shared/services/login/login.service";
import { LanguageService } from "@shared/services/language/language.service";
import { environment } from "@root/src/environments/environment";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ProceedActionsComponent } from "../shared/proceed-actions/proceed-actions.component";
import { VotingActionsComponent } from "../shared/voting-actions/voting-actions.component";
import { CompleteActionsComponent } from "../shared/complete-actions/complete-actions.component";

@Component({
  selector: "app-user-quality-form",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    RadioButtonModule,
    TranslateModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ProceedActionsComponent,
    VotingActionsComponent,
    CompleteActionsComponent
  ],
  templateUrl: "./user-quality-form.component.html",
  styleUrl: "./user-quality-form.component.scss",
})
export class UserQualityFormComponent {
  mode: TFormModes = "edit";
  attachments: any[] = [];
  votes: any[] = [];
  vote_reasons: any[] = [];
  selected_reasons: string[] = [];

  taskData: IQualityMission = {
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
    currentStatus: null,
    uploadedFiles: [],
    lastStatus: "0",
    fieldVisitDate: "",
    financialItem: "",
    returnDetails: [],
    objectionCommunications: [],
    voteProgressStatus:"",
    objectionReason:"",
    statusName:"",
    reason:"",
    department:""
 
  };
  AttachmentTypes = AttachmentTypes;
  statusTypes = StatusEnum;
  ObjectionStatusTypes = ObjectionStatusEnum;

  is_valid_reject: boolean = true;
  is_collapsed: boolean = false;
  is_return_collapsed: boolean = false;
  is_objectionCommunication_collapsed: boolean = false;

  is_voting: boolean = false;
  hasOperationsReview: boolean = false;
  taskDataArray: { key: string; value: string }[] = [];

  /**
   *
   */
  constructor(
    private qualityService: QualityService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private loginService: LoginService,
    private langService: LanguageService
  ) {}
  ngOnInit(): void {
    // Get Data from parent Component
    this.taskData = this.dynamicDialogConfig.data.taskData;
    // this.taskData.uploadedFiles = [];
    this.taskDataArray = Object.entries(this.taskData).map(([key, value]) => ({
      key,
      value,
    }));
    const dateLang = this.langService.getDateFormat();
    this.taskDataArray = [
      { key: "quality-mission-number", value: this.taskData.objectionNumber },
      { key: "id-no", value: this.taskData.objectorId.toString() },
      { key: "company-name", value: this.taskData.objectorName },
      { key: "BillNumber", value: this.taskData.billNumber },
      {
        key: "mobileNumber",
        value: this.taskData.objectorMobileNumber,
      },
      { key: "note", value: this.taskData.note },
      {
        key: "request-date",
        value: new Date(this.taskData.createdAt).toLocaleDateString(dateLang, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
      { key: "FinancialItem", value: this.taskData.financialItem },

      { key: "FinCategoryName", value: this.taskData.finCategoryName },
      { key: "the-sector", value: this.taskData.department },
      { key: "request-reason", value: this.taskData.reason },
      {
        key: "Field-visit-date",
        value: new Date(this.taskData.fieldVisitDate).toLocaleDateString(
          dateLang,
          {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        ),
      },
    ];
    this.attachments = this.groupingAttachments(this.taskData.attachments);
    this.taskData.returnDetails;
    this.updateData();
    if (
      this.taskData.status ==
      ObjectionStatusEnum.Under_Review_by_Comittee_Coordinator
    ) {
      this.taskData.currentStatus =
        ObjectionStatusEnum.Under_Evaluation.toString();
    } else if (
      this.taskData.status == ObjectionStatusEnum.Accepted ||
      this.taskData.status == ObjectionStatusEnum.Rejected
    ) {
      this.taskData.currentStatus = ObjectionStatusEnum.Accepted.toString();
    }

     this.votes = this.taskData.votes || [];
   
    this.mode = this.dynamicDialogConfig.data.mode || "edit";
   }
  splitString(data: string) {
    return data.split(/[&|]/);
  }
  isCoordinator(): boolean {
    return this.loginService.hasPermission([
      "Procceed_Quality_CommitteeCoordinator",
     ]);
  }

  getAttachments(): any[] {
    return this.attachments
      .map((attachment: any) => {
        return {
          ...attachment,
          data: attachment.data.filter((item: any) => item.version === null), // Filter the data array
        };
      })
      .filter((attachment) => attachment.data.length > 0);
  }
  downloadFile(path: string, fileName: string) {    
      const fileUrl = path.replace(environment.filePath, window.origin + '/objections/'); // Convert backslashes to forward slashes for file protocol
      const encodedFileUrl = fileUrl.replace(/#/g, '%23'); // Replace # with %23 to avoid problem of not automatic converting
      window.open(encodedFileUrl, '_blank');

      
      // // for testing :
   /*  const fileUrl = path.replace(
       /\\\\ripctest\.loc\\ripctestdfs\\Objections\\|C:\\inetpub\\wwwroot\\Fotrah\\objections\\/g,
       window.origin + "/test/"
     );*/
   //  const encodedFileUrl = fileUrl.replace(/#/g, '%23'); // Replace # with %23 to avoid problem of not automatic converting
     //window.open(encodedFileUrl, '_blank');

  }

  getAttachmnetTitle = (type: number): string =>
    type === AttachmentTypes.Quality_Attachment
      ? "quality-attachment"
      : type === AttachmentTypes.Internal_Quality_Supported_Attachment
      ? "quality-supported-attachment"
      : "";

      updateData = () => {
        this.qualityService.rowData.set(this.taskData);
      };
 
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
}
