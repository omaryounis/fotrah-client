import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BillPrintComponent } from '@shared/components/bill-print/bill-print.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { BillService } from '@shared/services/bill/bill.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ISelectValue } from '../../../roles-management/role.model';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@shared/services/language/language.service';
import { ActivatedRoute } from '@angular/router';
import { CancelTypes } from '@shared/enums/cancel-types.enum';
import { BillsStatus } from '@shared/enums/bills-status.enum';

@Component({
  selector: "app-cancel-violation",
  standalone: true,
  imports: [BillPrintComponent, SearchBarComponent, PageHeaderComponent, DatePipe, FormsModule, ButtonModule, DialogModule, FileUploadModule, InputTextareaModule, InputTextModule, DropdownModule, TranslateModule],
  templateUrl: "./cancel-violation.component.html",
  styleUrls: ["./cancel-violation.component.scss"],
  providers: [ConfirmationService]
})
export class CancelViolationComponent implements OnInit, OnDestroy {
  billNumber: string = '';
  cancelButtonLabel: string = '';
  cancelType: string = '';
  visible: boolean = false;
  showBill = this.billService.showBill;
  billInformation: any = {};
  billInformation$ = this.billService.billInformation$;
  billInformationSubscription!: Subscription;
  attachments: File[] = [];
  attachments_validations: any[] = [];
  reasonsList: ISelectValue[] = [];
  billStatus = BillsStatus;
  messages = [
    { severity: 'info', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('cannot-display-bill-details') },
  ];

  selectedReason = {} as ISelectValue;
  constructor(private billService: BillService, public langService: LanguageService, private messageService: MessageService, private router: ActivatedRoute) {
    this.generateReasons();
    billService.showBill.set(false);
  }
  generateReasons() {
    const nums = Array.from({ length: 12 }, (_, index) => index + 1);
    nums.push(90, 99);
    nums.forEach(element => {
      const name = this.langService.getInstantTranslation('reasons.' + element)
      this.reasonsList.push({ value: element, name: name });
    });

  }

  search() {
    this.billService.searchBill(this.billNumber).subscribe((response) => {
    });
  }

  changeSearchValue(value: string) {
    this.billNumber = value;
  }

  resetSearchResults() {
    this.billNumber = "";
    this.billService.hideBillInfo();
  }

  ngOnInit(): void {
    this.router.params.subscribe(data => {
      this.cancelType = data['cancelType'];
      this.checkValidRoute()
      this.cancelButtonLabel = this.cancelType === CancelTypes.CANCELBILL ? 'cancel-bill-request' : this.cancelType === CancelTypes.CANCELREFUND ? 'cancel-refund-request' : 'refund-request';
    })
    this.billInformationSubscription = this.billInformation$.subscribe({
      next: (value) => {
        this.billInformation = value;
      }
    })
  }


  ngOnDestroy(): void {
    this.billInformationSubscription.unsubscribe();
  }

  handleBillRequest() {
    if (!this.selectedReason.value) {
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-required-fields') });
      return;
    }
    if (this.attachments_validations.some(item => item.type === true || item.size === true) || (this.attachments.length > 0 && this.attachments.some(a => a.name === ''))) {
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    var formData = new FormData();
    formData.append('BillNumber', this.billNumber);
    formData.append(this.cancelType === CancelTypes.REFUND ? 'RefundReason' : 'CancelReason', String(this.selectedReason.value));
    if (this.attachments.length > 0) {
      this.attachments.forEach(file => {
        formData.append('Attachments', file)
      });
    }
    this.billService.cancelBill(formData, this.cancelType).subscribe(res => {
      if (res) {
        
        this.visible = false;
        this.resetSearchResults();
        this.messageService.add({ severity: 'info', summary: this.langService.getInstantTranslation('cancel-bill-request'), detail: this.langService.getInstantTranslation('cancel-bill-request-success') });
        this.addOrInitializeAttachment()
        this.selectedReason = {};
      }
    })
  }

  toggleModal() {
    this.attachments = [];
    this.attachments_validations = [];
    this.selectedReason = {};
    this.visible = !this.visible;
    if (!this.visible) {
      const overlay = document.querySelector('.ui-widget-overlay');
      if (overlay) {
        overlay.remove();
      }

    }
  }

  fileUpoaded(file: any, index: number) {
    this.attachments[index] = file[0];
    this.attachments_validations[index].type = this.validateFile(file[0], 'type')
    this.attachments_validations[index].size = this.validateFile(file[0], 'size')
  }
  /* Files */

  addOrInitializeAttachment() {
    if (this.attachments.length < 4 ) {
      this.attachments.push(new File([], ''));
      this.attachments_validations.push({ size: false, type: false });
    }
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1)
    this.attachments_validations.splice(index, 1)

  }

  checkValidRoute() {
    if (!(this.cancelType === CancelTypes.CANCELBILL || this.cancelType === CancelTypes.CANCELREFUND || this.cancelType === CancelTypes.REFUND)) {
      history.back();
    }
  }
  validateFile(file: File, validationType: string) {
    const allowedExtensions = ['pdf']; // Allowed file types
    const maxSize = 4 * 1024 * 1024; // Maximum file size in bytes (1 MB)
    if (validationType == 'type') {
      // Check file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(extension!)) {
        return true; // Indicate validation failure
      }

    }
    if (validationType == 'size') {
      // Check file size
      if (file.size > maxSize) {
        // File size exceeds limit, display error message
        return true; // Indicate validation failure
      }
    }
    return false; // Indicate validation success
  }
  checkBillType() :boolean { return this.billInformation?.billCategory.toLowerCase() == 'violation' || this.billInformation?.billCategory.toLowerCase() == 'مخالفة'};

}
