import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { LanguageService } from "@shared/services/language/language.service";
import { ActivitiesService } from "@shared/services/main-data-management/activities/activities.service";
import { MessageService } from "primeng/api";
import { DynamicDialogRef, DialogService } from "primeng/dynamicdialog";

import { InputSwitchModule } from "primeng/inputswitch";
import { take } from "rxjs";
import { IActivity } from "../../activities.model";
import { ActivityFormComponent } from "../activity-form/activity-form.component";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-change-status-activity",
  standalone: true,
  imports: [FormsModule, InputSwitchModule , TranslateModule ,CanComponent],
  templateUrl: "./change-status-activity.component.html",
  styleUrl: "./change-status-activity.component.scss",
})
export class ChangeStatusActivityComponent {


  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IActivity = {
    nameAr: "",
    gfsTitle: "",
    code: "",
  };
  checked: boolean = false;
  ref!: DynamicDialogRef;
  formValidation: boolean = false;

  constructor(private dialogService: DialogService, private langService:LanguageService,private activityService:ActivitiesService , private messageService : MessageService) {}

  openModal(event: any) {
    this.ref = this.dialogService.open(ActivityFormComponent, {
      header: this.langService.getInstantTranslation('activation-deactivation'),
      styleClass: "crud-modal",
      data: {
        activityData: this.rowData,
        formValidation: this.formValidation,
        mode: "toggleActivation",
        footer: {
          submitLabel: "confirm",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.updateActivity();
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
  updateActivity() {
    this.rowData.status = !this.rowData.status;
    this.activityService.updateActivity(this.rowData).pipe(take(1))
    .subscribe((res) => {
      if (res.message == MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-success') });
        this.activityService.getActivities().subscribe();
        this.ref?.close();
      } else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message});
      }
    });
  }
}
