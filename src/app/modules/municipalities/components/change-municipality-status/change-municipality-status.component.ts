import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { LanguageService } from "@shared/services/language/language.service";
import { MunicipalsService } from "@shared/services/main-data-management/municipals/municipals.service";
import { MessageService } from "primeng/api";
import { DynamicDialogRef, DialogService } from "primeng/dynamicdialog";

import { InputSwitchModule } from "primeng/inputswitch";
import { take } from "rxjs";
import { IMunicipalities } from "../../municipalities.model";
import { MunicipalityFormComponent } from "../municipality-form/municipality-form.component";
import { TranslateModule } from "@ngx-translate/core";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-change-municipality-status",
  standalone: true,
  imports: [FormsModule, InputSwitchModule , TranslateModule ,CanComponent],
  templateUrl: "./change-municipality-status.component.html",
  styleUrl: "./change-municipality-status.component.scss",
})
export class ChangeMunicipalityStatusComponent {

  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IMunicipalities = {
    id : 0,
    nameAr: "",
    nameEn: "",
    regionId: 0,
    classificationId:0,
    code: 0,
  };

  ref!: DynamicDialogRef;
  formValidation: boolean = false;
  get municipalityData() {
    return this.municipalityService.rowData()
  }
  constructor(private dialogService: DialogService, private langService:LanguageService,private municipalityService:MunicipalsService , private messageService : MessageService) {}
  ngOnInit(): void {
   
  }

  openEditModal(event: any) {
    this.ref = this.dialogService.open(MunicipalityFormComponent, {
      header: this.langService.getInstantTranslation('activation-deactivation'),
      styleClass: "crud-modal",
      data: {
        municipalityData: this.rowData,
        mode: "toggleActivation",
        footer: {
          formValidation: this.formValidation,
          submitLabel: "confirm",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.updateMuIMunicipalities();
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
  updateMuIMunicipalities() {
    this.rowData.status = !this.rowData.status;
    this.municipalityService.updateMunicipals(this.rowData).pipe(take(1))
    .subscribe((res) => {
      // this.rowData.id = -1;
      if (res.message == MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-success') });
        this.municipalityService.getMunicipals().subscribe();
        this.ref?.close();
      } else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message});
         
      }
    });
  }
}
