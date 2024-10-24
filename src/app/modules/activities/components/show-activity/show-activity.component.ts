import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { ActivityFormComponent } from "./../activity-form/activity-form.component";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { IActivity } from "../../activities.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-show-activity",
  standalone: true,
  imports: [ButtonModule, ActivityFormComponent],
  templateUrl: "./show-activity.component.html",
  styleUrl: "./show-activity.component.scss",
})
export class ShowActivityComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IActivity = {
    nameAr: "",
    gfsTitle: "",
    gfSsId : 0 ,
    code: "",
  };

  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService ,private transalteService: TranslateService) {}

  openShowModal(event: any) {
    this.ref = this.dialogService.open(ActivityFormComponent, {
      header: this.transalteService.instant('show-data'),
      styleClass: "crud-modal",
      data: {
        activityData: this.rowData,
        mode: "show",
        footer: {
          showSubmit: false,
          cancelLabel:this.transalteService.instant('cancel'),
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
