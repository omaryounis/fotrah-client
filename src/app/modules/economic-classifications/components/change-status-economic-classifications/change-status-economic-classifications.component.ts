import { Component, Input, OnInit } from '@angular/core';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { MessagesResponse } from '@shared/enums/messages-response.enum';
import { LanguageService } from '@shared/services/language/language.service';
import { EconomicClassificationsService } from '@shared/services/main-data-management/economic-classifications/economic-classifications.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { IEconomicClassification } from '../../economic-classifications.model';
import { EconomicClassificationFormComponent } from '../economic-classification-form/economic-classification-form.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CanComponent } from '@shared/components/can/can.component';

@Component({
  selector: 'app-change-status-economic-classifications',
  standalone : true,
  imports : [InputSwitchModule , TranslateModule ,FormsModule,CanComponent],
  templateUrl: './change-status-economic-classifications.component.html',
  styleUrls: ['./change-status-economic-classifications.component.scss']
})
export class ChangeStatusEconomicClassificationsComponent implements OnInit {

  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IEconomicClassification = {
    name: "",
    code: "",
    beneficiaryAgencyId : 0,
  };
  get ecData() {
    return this.ecService.rowData()
  }
  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService,  private langService:LanguageService , private ecService:EconomicClassificationsService , private messageService : MessageService) {}

  openModal(event: any) {
    this.ref = this.dialogService.open(EconomicClassificationFormComponent, {
      header: this.langService.getInstantTranslation("activation-deactivation"),
      styleClass: "crud-modal",
      data: {
        economicClassification: this.rowData,
        mode: "toggleActivation",
        footer: {
          submitLabel: "confirm",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.updateClassification();
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
  updateClassification() {
    this.rowData.status = !this.rowData.status;
    this.ecService.updateEconomicClassification(this.rowData).pipe(take(1))
    .subscribe((res) => {
      // this.activityData.id = -1;
      if (res.message === MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-success') });
        this.ecService.getEconomicClassifications().subscribe();
        this.ref?.close();
      } else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message });
        this.rowData.status = !this.rowData.status;
      }
    });
  }
  ngOnInit() {
  }

}
