import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { ExcavationRoute } from '@shared/enums/excavation-route.enum';
import { MessagesResponse } from '@shared/enums/messages-response.enum';
import { LanguageService } from '@shared/services/language/language.service';
import { ExcavationTypeService } from '@shared/services/main-data-management/excavation-type/excavation-type.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { IExcavationType } from '../../excavation-type.model';
import { ExcavationTypeFormComponent } from '../excavation-type-form/excavation-type-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { CanComponent } from '@shared/components/can/can.component';

@Component({
  selector: 'app-excavation-change-status',
  standalone : true,
  imports : [TranslateModule , InputSwitchModule ,FormsModule ,CanComponent],
  templateUrl: './excavation-change-status.component.html',
  styleUrls: ['./excavation-change-status.component.scss']
})
export class ExcavationChangeStatusComponent implements OnInit {

 
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IExcavationType = {
    nameAr: "",
    nameEn : "",
    code: "",
  };

  ref!: DynamicDialogRef;
  formValidation: boolean = false;
  @Input() excavationRoute: string = ExcavationRoute.EXCAVATIONTYPE;
  title: string = "";
  resource: string = "";

  constructor(private dialogService: DialogService, private router :ActivatedRoute, private langService:LanguageService,private excavationTypeService:ExcavationTypeService , private messageService : MessageService) {}
  ngOnInit(): void {
    this.router.params.subscribe(res => this.excavationRoute = res['excavationRoute'])
    this.title = this.excavationRoute  == ExcavationRoute.EXCAVATIONTYPE ?  'excavation-type.update' : 'excavation-path.update';
     this.resource = this.excavationRoute  == ExcavationRoute.EXCAVATIONTYPE ?  'ExcavationType' : 'ExcavationPathType'

  }

  get excavationTypeData() {
    return this.excavationTypeService.rowData()
  }
  openModal(event: any) {
    this.ref = this.dialogService.open(ExcavationTypeFormComponent, {
      header: this.langService.getInstantTranslation('activation-deactivation'),
      styleClass: "crud-modal",
      data: {
        excavationTypeData: this.rowData,
        excavationRoute: this.excavationRoute,
        mode: "toggleActivation",
        footer: {
          submitLabel: "confirm",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.updateExcavationType();
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
  updateExcavationType() {
    this.rowData.status = !this.rowData.status;
    this.excavationTypeService.updateExcavationType(this.rowData , this.excavationRoute).pipe(take(1))
    .subscribe((res) => {
      if (res.message == MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-success') });
        this.excavationTypeService.getExcavationTypes(this.excavationRoute).subscribe();
        this.ref?.close();
      } else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message});
      }
    });
  }

}
