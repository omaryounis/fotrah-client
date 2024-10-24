import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { MunicipalityFormComponent } from "../municipality-form/municipality-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { IMunicipalities } from "../../municipalities.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-show-municipality",
  standalone: true,
  imports: [ButtonModule, MunicipalityFormComponent],
  templateUrl: "./show-municipality.component.html",
  styleUrl: "./show-municipality.component.scss",
})
export class ShowMunicipalityComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IMunicipalities = {
    nameAr: "",
    nameEn: "",
    regionName: "",
    classificationName: "",
    code: 0,
  };

  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService, private transalteService:TranslateService) {}

  openShowModal(event: any) {
    this.ref = this.dialogService.open(MunicipalityFormComponent, {
      header: this.transalteService.instant('show-municipality'),
      styleClass: "crud-modal",
      data: {
        municipalityData: this.rowData,
        mode: "show",
        footer: {
          showSubmit: false,
          cancelLabel:  this.transalteService.instant('cancel'),
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
