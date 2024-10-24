import { Component, OnInit } from '@angular/core';
import { FinancialsPermitsService } from '@shared/services/main-data-management/financials-permits/financials-permits.service';
import { IFinancialsPermits } from '../../financials-permits.model';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { MessagesResponse } from '@shared/enums/messages-response.enum';
import { LanguageService } from '@shared/services/language/language.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { FinancialsPermitsFormComponent } from '../financials-permits-form/financials-permits-form.component';
import { CanComponent } from '@shared/components/can/can.component';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-financials-permits',
  standalone : true,
  imports : [CanComponent , ButtonModule , TranslateModule],
  templateUrl: './create-financials-permits.component.html',
  styleUrls: ['./create-financials-permits.component.scss']
})
export class CreateFinancialsPermitsComponent implements OnInit {

  ref: DynamicDialogRef | undefined;
  financialPermitsData: IFinancialsPermits = {

  };
  formValidation: boolean = false;
  constructor(public dialogService: DialogService, private langService: LanguageService, private financialPermitsService: FinancialsPermitsService, private messageService: MessageService) { }
  ngOnInit(): void {
  
  }

  onClickAddButton(event: any) {
    event.stopPropagation();
    this.financialPermitsData = {} as IFinancialsPermits;
    this.ref = this.dialogService.open(FinancialsPermitsFormComponent, {
      header: this.langService.getInstantTranslation('add-financial-item'),
      styleClass: "crud-modal",
      data: {
        financialData: this.financialPermitsData,
        formValidation: this.formValidation,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.addFinancialsPermits();
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
  addFinancialsPermits() {
    
    if(!this.financialPermitsData.formValidation || !this.financialPermitsData.excavationTypeId || !this.financialPermitsData.excavationPathTypeId  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    
    this.financialPermitsService.createFinIFinancialsPermit(this.financialPermitsData).pipe(take(1))
      .subscribe((res) => {
        // this.financialPermitsData.id = -1;
        if (res.message == MessagesResponse.SUCCESS) {
          this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-added-successfully') });
          this.financialPermitsService.getFinancialsPermits().subscribe();
          this.ref?.close();
        } else {
          this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message });
        }
      });
  }

}
