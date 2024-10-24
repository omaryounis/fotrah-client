import { Component, Input, OnInit } from '@angular/core';
import { ExcavationTypeFormComponent } from '../excavation-type-form/excavation-type-form.component';
import { IExcavationType } from '../../excavation-type.model';
import { ExcavationTypeService } from '@shared/services/main-data-management/excavation-type/excavation-type.service';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { MessagesResponse } from '@shared/enums/messages-response.enum';
import { LanguageService } from '@shared/services/language/language.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExcavationRoute } from '@shared/enums/excavation-route.enum';
import { CanComponent } from '@shared/components/can/can.component';

@Component({
  selector: 'app-edit-excavation-type',
  standalone: true,
  imports: [ButtonModule, ExcavationTypeFormComponent , CanComponent],
  templateUrl: './edit-excavation-type.component.html',
  styleUrls: ['./edit-excavation-type.component.scss']
})
export class EditExcavationTypeComponent implements OnInit {

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
    this.title = this.excavationRoute  == ExcavationRoute.EXCAVATIONTYPE ?  'excavation-type.update' : 'excavation-path.update'
 this.resource = this.excavationRoute  == ExcavationRoute.EXCAVATIONTYPE ?  'ExcavationType' : 'ExcavationPathType'
  }

  get excavationTypeData() {
    return this.excavationTypeService.rowData()
  }
  openEditModal(event: any) {
    this.ref = this.dialogService.open(ExcavationTypeFormComponent, {
      header: this.langService.getInstantTranslation(this.title),
      styleClass: "crud-modal",
      data: {
        excavationTypeData: this.rowData,
        excavationRoute: this.excavationRoute,
        mode: "edit",
        footer: {
          submitLabel: "edit",
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
     this.rowData = this.excavationTypeData;
    if(!this.rowData.formValidation  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }

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
