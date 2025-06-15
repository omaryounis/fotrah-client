import { DatePipe } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { BillPrintComponent } from "@shared/components/bill-print/bill-print.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { BillService } from "@shared/services/bill/bill.service";
import { LanguageService } from "@shared/services/language/language.service";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FileSelectEvent, FileUploadModule,FileUpload } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ISelectValue } from "../../../roles-management/role.model";
import { BillsStatus } from "@shared/enums/bills-status.enum";
import { Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { CancelTypes } from "@shared/enums/cancel-types.enum";
import { QualityService } from "@shared/services/quality/quality.service";
import { environment } from "@root/src/environments/environment";

interface IFileObject {
  name: string;
  size: number;
  type: string;
  objectURL?: string;
  file?: File;
  filePath?: string;
}

@Component({
  selector: "app-quality-cancel-violation",
  standalone: true,
  imports: [
    BillPrintComponent,
    SearchBarComponent,
    PageHeaderComponent,
    DatePipe,
    FormsModule,
    ButtonModule,
    DialogModule,
    FileUploadModule,
    InputTextareaModule,
    InputTextModule,
    DropdownModule,
    TranslateModule,
  ],
  templateUrl: "./quality-cancel-violation.component.html",
  styleUrl: "./quality-cancel-violation.component.scss",
})
export class QualityCancelViolationComponent {
 
  /**
   *
   */
  constructor(
    private langService: LanguageService,
    private billService: BillService,
    private qualityService: QualityService,
    private messageService: MessageService
  ) {
    this.generateReasons();
    billService.showBill.set(false);
  }

  billNumber: string = "";
  cancelType: string = "";
  Notes?: string | null;

  returnReason?: string | null;
  objectorResponse?: string | null;
  visible: boolean = false;
  showBill = this.billService.showBill;
  billInformation: any = {};
  billInformation$ = this.billService.billInformation$;
  billInformationSubscription!: Subscription;
  attachment: any = null;
  supportedAttachments: any[] = [];
  displayAttachments: IFileObject[] = [];
  displaySupportedAttachments: IFileObject[] = [];
  reasonsList: ISelectValue[] = [];
  departmentList: ISelectValue[] = [];
  billStatus = BillsStatus;
  messages = [
    {
      severity: "info",
      summary: this.langService.getInstantTranslation("sorry"),
      detail: this.langService.getInstantTranslation(
        "cannot-display-bill-details"
      ),
    },
  ];
  selectedReason = {} as ISelectValue;
  selectedDepartment = {} as ISelectValue;
  qualityObjection: any = null; 
  deletedFiles: string[] = [];

  generateReasons() {
    const nums = Array.from({ length: 3 }, (_, index) => index + 1);
    nums.forEach((element) => {
      const name = this.langService.getInstantTranslation(
        "quality-reason." + element
      );
      this.reasonsList.push({ value: element, name: name });
    });

    nums.forEach((element) => {
      const name = this.langService.getInstantTranslation(
        "quality-department." + element
      );
      this.departmentList.push({ value: element, name: name });
    });
  }

  search() {
    this.billService.searchBill(this.billNumber).subscribe((response) => {});
    this.selectedReason = {};
    this.selectedDepartment = {};
    this.attachment = null;
    this.supportedAttachments = [];
   }

  changeSearchValue(value: string) {
    this.billNumber = value;
  }

  async handleBillRequest() {
    if (!this.selectedReason.value || !this.selectedDepartment || (!this.objectorResponse && this.returnReason)) {
      this.messageService.add({
        severity: "error",
        summary: this.langService.getInstantTranslation("sorry"),
        detail: this.langService.getInstantTranslation("sure-required-fields"),
      });
      return;
    }
    var formData = new FormData();
    formData.append("BillNumber", this.billNumber);
    formData.append("DepartmentId", String(this.selectedDepartment.value));
    formData.append("ReasonId", String(this.selectedReason.value));
    formData.append("ObjectorResponse", this.objectorResponse || '');
    if (this.Notes != null) {
      formData.append("Notes", this.Notes);
    }

    if (this.deletedFiles.length > 0) {
      this.deletedFiles.forEach((filePath, index) => {
        formData.append(`DeletedFiles[${index}]`, filePath);
      });
    }

    if (this.attachment) {
      formData.append("QualityReport", this.attachment.file || this.attachment);
    }

    // Prepare promises for old file downloads
    const attachmentPromises = (this.supportedAttachments || []).map(async (fileObj: any) => {
      if (fileObj.file) {
        // New file: send as is
        formData.append("SupportedAttachments", fileObj.file);
      } else if (fileObj.filePath) {
        // Old file: fetch and convert to File
        const response = await fetch(fileObj.filePath);
        const blob = await response.blob();
        // Use the original name and type if available
        const file = new File([blob], fileObj.name, { type: fileObj.type || blob.type });
        formData.append("SupportedAttachments", file);
      }
    });

    await Promise.all(attachmentPromises);

    this.qualityService
      .cancelBill(formData, this.cancelType)
      .subscribe((res) => {
        if (res) {
          this.visible = false;
          this.resetSearchResults();
          this.messageService.add({
            severity: "info",
            summary: this.langService.getInstantTranslation("cancel-bill-request"),
            detail: this.langService.getInstantTranslation("cancel-bill-request-success"),
          });
          this.selectedReason = {};
          this.selectedDepartment = {};
          this.attachment = null;
          this.supportedAttachments = [];
          this.deletedFiles = [];
          this.objectorResponse = null;
        }
      });
  }

  resetSearchResults() {
    this.billNumber = "";
    this.billService.hideBillInfo();
  }

  ngOnInit(): void {
    this.billInformationSubscription = this.billInformation$.subscribe({
      next: (value) => {
        this.billInformation = value;
      },
    });
  }

  ngOnDestroy(): void {
    this.billInformationSubscription.unsubscribe();
  }
  // Optional: Function to detect MIME type
  downloadFile(fileObj: any) {
    if (fileObj.filePath) {
      // Old file or file saved on server
      const fileUrl = fileObj.filePath.replace(environment.filePath, window.origin + '/objections/');
      const encodedFileUrl = fileUrl.replace(/#/g, '%23');
      window.open(encodedFileUrl, '_blank');
    } else {
      // New file, not yet uploaded to server
      this.messageService.add({
        severity: 'warn',
        summary: this.langService.getInstantTranslation('warning'),
        detail: this.langService.getInstantTranslation('file-download-after-save')
      });
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
  toggleModal() {
    this.attachment = null;
    this.supportedAttachments = [];
    this.displaySupportedAttachments = [];
    this.deletedFiles = [];
    this.selectedReason = {};
    this.selectedDepartment = {};
    this.visible = !this.visible;

    if (this.visible) {
      this.qualityService.getQualityObjectionByBillNumber(Number(this.billNumber)).subscribe({
        next: (response) => {
          if (response.data) {
            this.qualityObjection = response.data;
            const qualityData = response.data;
            
            // Debug logs
            console.log('Main Attachment:', qualityData.attachment);
            console.log('Supported Attachments:', qualityData.attachments);

            this.selectedReason = { 
              value: qualityData.reasonId, 
              name: this.reasonsList.find(r => r.value === qualityData.reasonId)?.name || '' 
            };
            this.selectedDepartment = { 
              value: qualityData.departmentId, 
              name: this.departmentList.find(d => d.value === qualityData.departmentId)?.name || '' 
            };

            // Handle main attachment
            if (qualityData.attachment) {
              this.attachment = {
                name: qualityData.attachment.fileName,
                size: 0,
                type: qualityData.attachment.contentType,
                filePath: qualityData.attachment.filePath
              };
            }

            // Handle supported attachments - add to display list only
            if (qualityData.attachments && qualityData.attachments.length > 0) {
              this.displaySupportedAttachments = qualityData.attachments.map((attachment: any) => ({
                name: attachment.fileName,
                size: 0,
                type: attachment.contentType,
                filePath: attachment.filePath
              }));
            }

            // Set return reason if exists
            if (qualityData.returnReason) {
              this.returnReason = qualityData.returnReason;
            }
          }
        },
        error: (error) => {
          console.error('Error loading quality data:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.langService.getInstantTranslation('error'),
            detail: this.langService.getInstantTranslation('error-loading-quality-data')
          });
        }
      });
    } else {
      this.qualityObjection = null;
      const overlay = document.querySelector(".ui-widget-overlay");
      if (overlay) {
        overlay.remove();
      }
    }
  }

  onFileUpload(event: any): void {
    if (event.files && event.files.length > 0) {
      this.attachment = event.files[0];
    }
  }

  onFileRemove(): void {
    this.attachment = null;
  }

  onSupportedFileUpload(event: any): void {
    if (!event.files) {
      return;
    }

    // Convert FileList to array and ensure it's typed as File[]
    const files = Array.from(event.files) as File[];
    
    // Calculate how many more files we can add
    const remainingSlots = 3 - this.supportedAttachments.length;
    if (remainingSlots <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: this.langService.getInstantTranslation('warning'),
        detail: this.langService.getInstantTranslation('maximum-files-reached')
      });
      return;
    }

    // Take only the number of files that fit within the limit
    const filesToAdd = files.slice(0, remainingSlots);
    
    // Format new files
    const newFiles = filesToAdd.map((file: File) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));

    // Add new files to supportedAttachments (for upload)
    this.supportedAttachments = [...this.supportedAttachments, ...newFiles];
    
    // Add to display list for preview
    this.displaySupportedAttachments = [...this.displaySupportedAttachments, ...newFiles];
    
    console.log('New Files for Upload:', this.supportedAttachments);
    console.log('Display Files:', this.displaySupportedAttachments);
  }

  onSupportedFileRemove(event: any): void {
    if (!this.displaySupportedAttachments) {
      return;
    }
    const fileIndex = this.displaySupportedAttachments.findIndex(f => f.name === event.file.name);
    if (fileIndex !== -1) {
      const removedFile = this.displaySupportedAttachments[fileIndex];
      
      // If it's an old file (has filePath), add to deletedFiles list
      if (removedFile.filePath) {
        this.deletedFiles.push(removedFile.filePath);
      }
      
      // Remove from display list
      this.displaySupportedAttachments.splice(fileIndex, 1);
      
      // If it's a new file (has file property), remove from supportedAttachments too
      if (removedFile.file) {
        const uploadIndex = this.supportedAttachments.findIndex(f => f.name === removedFile.name);
        if (uploadIndex !== -1) {
          this.supportedAttachments.splice(uploadIndex, 1);
        }
      }
      
      console.log('After Remove - Display Files:', this.displaySupportedAttachments);
      console.log('After Remove - Upload Files:', this.supportedAttachments);
      console.log('Deleted Files:', this.deletedFiles);
    }
  }

  clearAllFiles(): void {
    // Clear both lists
    this.supportedAttachments = [];
    this.displaySupportedAttachments = [];
    this.deletedFiles = [];
    console.log('Cleared All Files');
  }

  resetForm() {
    this.deletedFiles = [];
  }
  checkBillType() :boolean { return this.billInformation?.billCategory.toLowerCase() == 'violation' || this.billInformation?.billCategory.toLowerCase() == 'مخالفة'};

}
 