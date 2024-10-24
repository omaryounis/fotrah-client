import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IFinancialsPermits } from '../../financials-permits.model';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FinancialsPermitsFormComponent } from '../financials-permits-form/financials-permits-form.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-show-financials-permits',
  standalone : true,
  imports : [ButtonModule],
  templateUrl: './show-financials-permits.component.html',
  styleUrls: ['./show-financials-permits.component.scss']
})
export class ShowFinancialsPermitsComponent implements OnInit {

  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IFinancialsPermits = {
 
  };

  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService ,private translateService:TranslateService) {}
  ngOnInit(): void {
   
  }

  openShowModal(event: any) {
    this.ref = this.dialogService.open(FinancialsPermitsFormComponent, {
      header: this.translateService.instant('show-financial-item'),
      styleClass: "crud-modal",
      data: {
        financialData: this.rowData,
        mode: "show",
        footer: {
          showSubmit: false,
          cancelLabel: this.translateService.instant('cancel'),
          onSubmit: () => {
            this.ref?.close();
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
}
