import { Component } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ButtonModule } from "primeng/button";

import { ActivityFormComponent } from "./../activity-form/activity-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { IActivity } from "../../activities.model";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";
import { ActivitiesService } from "@shared/services/main-data-management/activities/activities.service";
import { take } from "rxjs";
import { MessageService } from "primeng/api";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-create-activity",
  standalone: true,
  imports: [ButtonModule, ActivityFormComponent, TranslateModule, CanComponent],
  templateUrl: "./create-activity.component.html",
  styleUrl: "./create-activity.component.scss",
})
export class CreateActivityComponent {
  ref: DynamicDialogRef | undefined;
  activityData: IActivity = {
    nameAr: "",
    nameEn: "",
    code: "",
    sector: "",
    description: "",
  };
  formValidation: boolean = false;
  constructor(public dialogService: DialogService, private langService: LanguageService, private activityService: ActivitiesService, private messageService: MessageService) { }

  onClickAddButton(event: any) {
    event.stopPropagation();
    this.activityData = {} as IActivity;
    this.ref = this.dialogService.open(ActivityFormComponent, {
      header: this.langService.getInstantTranslation('add-activity'),
      styleClass: "crud-modal",
      data: {
        activityData: this.activityData,
        formValidation: this.formValidation,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.addActivity();
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
  addActivity() {
    if(!this.activityData.formValidation  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    if (!this.activityData.gfSsId || this.activityData.gfSsId < 0) {
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: this.langService.getInstantTranslation('choose-gfs') });
      return;
    }
    this.activityService.createActivity(this.activityData).pipe(take(1))
      .subscribe((res) => {
        // this.activityData.id = -1;
        if (res.message == MessagesResponse.SUCCESS) {
          this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-added-successfully') });
          this.activityService.getActivities().subscribe();
          this.ref?.close();
        } else {
          this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message });
        }
      });
  }
}

