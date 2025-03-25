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

  visible: boolean = false;
  showBill = this.billService.showBill;
  billInformation: any = {};
  billInformation$ = this.billService.billInformation$;
  billInformationSubscription!: Subscription;
  attachment: File[] = [];
  supportedAttachments: File[] = [];
  attachments_validations: any[] = [];
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
    this.attachment = [];
    this.supportedAttachments = [];
   }

  changeSearchValue(value: string) {
    this.billNumber = value;
  }

  handleBillRequest() {
    debugger;
    if (!this.selectedReason.value || !this.selectedDepartment) {
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
    if (this.Notes != null) {
      formData.append("Notes", this.Notes);
    }

    if (this.attachment) {
      // this.attachments.forEach((file) => {
      formData.append("QualityReport", this.attachment[0]);
      // });
    }

    if (this.supportedAttachments && this.supportedAttachments.length > 0) {
      this.supportedAttachments.forEach((file) => {
        formData.append("SupportedAttachments", file);
      });
    }
    this.qualityService
      .cancelBill(formData, this.cancelType)
      .subscribe((res) => {
        if (res) {
          this.visible = false;
          this.resetSearchResults();
          this.messageService.add({
            severity: "info",
            summary: this.langService.getInstantTranslation(
              "cancel-bill-request"
            ),
            detail: this.langService.getInstantTranslation(
              "cancel-bill-request-success"
            ),
          });
          // this.addOrInitializeAttachment();
          this.selectedReason = {};
          this.selectedDepartment = {};
          this.attachment = [];
          this.supportedAttachments = [];
        }
      });
  }

  // addOrInitializeAttachment() {
  //   if (this.attachments.length < 4) {
  //     this.attachments.push(new File([], ""));
  //     this.attachments_validations.push({ size: false, type: false });
  //   }
  // }

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

  toggleModal() {
    this.attachment = [];
    this.supportedAttachments = [];
    this.selectedReason = {};
    this.selectedDepartment = {};
    this.visible = !this.visible;
    if (!this.visible) {
      const overlay = document.querySelector(".ui-widget-overlay");
      if (overlay) {
        overlay.remove();
      }
    }
  }

  onFileUpload(event: FileSelectEvent): void {
    const selectedFiles = Array.from(event.files);
    const maxFiles = 1;
    debugger;
    // Check if the total number of files (existing + new) exceeds the limit
    if (selectedFiles.length > 1) {
      // Show an error message
      this.messageService.add({
        severity: "error",
        summary: "File Limit Exceeded",
        detail: `You can only upload a maximum of ${maxFiles} files.`,
      });

      return;
    } else {
      this.attachment = [
        ...this.attachment,
        ...selectedFiles,
      ];    }
  }

  onFileRemove(): void {
    if (this.attachment) {
      this.attachment = [];
    }
  }

  onSupportedFileRemove(event: { file: File }): void {
    if (!this.supportedAttachments) {
      return;
    }
    const fileIndex = this.supportedAttachments.indexOf(event.file);

    if (fileIndex !== -1) {
      this.supportedAttachments.splice(fileIndex, 1);
    }
  }

  onSupportedFileUpload(event: FileSelectEvent): void {
    const selectedFiles = Array.from(event.files);
    const maxFiles = 3;

    debugger;
    // Check if the total number of files (existing + new) exceeds the limit
    if (this.supportedAttachments.length + selectedFiles.length > maxFiles) {
      // Show an error message
      debugger;

      this.messageService.add({
        severity: "error",
        summary: "File Limit Exceeded",
        detail: `You can only upload a maximum of ${maxFiles} files.`,
      });

      return;
    } else {
      // Add all selected files if they do not exceed the limit
      this.supportedAttachments = [
        ...this.supportedAttachments,
        ...selectedFiles,
      ];
    }
  }
  clearAllFiles(): void {
    this.supportedAttachments = [];
  }
 resetForm(){

 }
 checkBillType() :boolean { return this.billInformation?.billCategory.toLowerCase() == 'violation' || this.billInformation?.billCategory.toLowerCase() == 'مخالفة'};

}
 