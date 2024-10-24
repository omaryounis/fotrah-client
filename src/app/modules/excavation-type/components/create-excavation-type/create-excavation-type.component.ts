import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CanComponent } from '@shared/components/can/can.component';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { MessagesResponse } from '@shared/enums/messages-response.enum';
import { LanguageService } from '@shared/services/language/language.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { IExcavationType } from '../../excavation-type.model';
import { ExcavationTypeFormComponent } from '../excavation-type-form/excavation-type-form.component';
import { ExcavationTypeService } from '@shared/services/main-data-management/excavation-type/excavation-type.service';
import { ActivatedRoute } from '@angular/router';
import { ExcavationRoute } from '@shared/enums/excavation-route.enum';
import { ModalService } from '@shared/services/modal/modal.service';

@Component({
  selector: 'app-create-excavation-type',
  standalone : true,
  imports: [ButtonModule, ExcavationTypeFormComponent, TranslateModule, CanComponent],
  templateUrl: './create-excavation-type.component.html',
  styleUrls: ['./create-excavation-type.component.scss']
})
export class CreateExcavationTypeComponent implements OnInit {
  modalService :ModalService = new ModalService();
  ref: DynamicDialogRef | undefined;
  excavationTypeData: IExcavationType = {
    nameAr: "",
    nameEn: "",
    code: "",
    descriptionAr: "",
    descriptionEn: "",
  };
  excavationRoute: string = ExcavationRoute.EXCAVATIONTYPE;

  formValidation: boolean = false;
  title: string = "";
  resource: string = "";
  constructor(public dialogService: DialogService, private router :ActivatedRoute,  private langService: LanguageService, private excavationTypeService: ExcavationTypeService, private messageService: MessageService) { }
  ngOnInit(): void {
    this.router.params.subscribe(res => 
      {
        this.excavationRoute = res['excavationRoute'];
        this.title = this.excavationRoute  == ExcavationRoute.EXCAVATIONTYPE ?  'excavation-type.add' : 'excavation-path.add'
        this.resource = this.excavationRoute  == ExcavationRoute.EXCAVATIONTYPE ?  'ExcavationType' : 'ExcavationPathType'
      })
  }

  onClickAddButton(event: any) {
    event.stopPropagation();
    this.excavationTypeData = {} as IExcavationType;
    this.ref = this.dialogService.open(ExcavationTypeFormComponent, {
      header: this.langService.getInstantTranslation(this.title),
      styleClass: "crud-modal",
      data: {
        excavationTypeData: this.excavationTypeData,
        excavationRoute: this.excavationRoute,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.addExcavationType();
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
  addExcavationType() {
    if(!this.excavationTypeData.formValidation  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    // if (!this.excavationTypeData.gfSsId || this.excavationTypeData.gfSsId < 0) {
    //   this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: this.langService.getInstantTranslation('choose-gfs') });
    //   return;
    // }
    this.excavationTypeService.createExcavationType(this.excavationTypeData ,this.excavationRoute).pipe(take(1))
      .subscribe((res) => {
        // this.excavationTypeData.id = -1;
        if (res.message == MessagesResponse.SUCCESS) {
          this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-added-successfully') });
          this.excavationTypeService.getExcavationTypes(this.excavationRoute).subscribe();
          this.ref?.close();
        } else {
          this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message });
        }
      });
  }

}
