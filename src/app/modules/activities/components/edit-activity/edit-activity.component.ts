import { Component, Input, ViewChild } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { ActivityFormComponent } from "./../activity-form/activity-form.component";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { IActivity } from "../../activities.model";
import { LanguageService } from "@shared/services/language/language.service";
import { ActivitiesService } from "@shared/services/main-data-management/activities/activities.service";
import { MessageService } from "primeng/api";
import { take } from "rxjs";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-edit-activity",
  standalone: true,
  imports: [ButtonModule, ActivityFormComponent ,CanComponent],
  templateUrl: "./edit-activity.component.html",
  styleUrl: "./edit-activity.component.scss",
})
export class EditActivityComponent {


  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IActivity = {
    nameAr: "",
    gfsTitle: "",
    code: "",
  };

  ref!: DynamicDialogRef;
  formValidation: boolean = false;

  constructor(private dialogService: DialogService, private langService:LanguageService,private activityService:ActivitiesService , private messageService : MessageService) {}
  get activityData() {
    return this.activityService.rowData()
  }
  openEditModal(event: any) {
    this.ref = this.dialogService.open(ActivityFormComponent, {
      header: this.langService.getInstantTranslation('update-activity'),
      styleClass: "crud-modal",
      data: {
        activityData: this.rowData,
        formValidation: this.formValidation,
        mode: "edit",
        footer: {
          submitLabel: "edit",
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
     this.rowData = this.activityData;
    if(!this.rowData.formValidation  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    if (!this.rowData.gfSsId || this.rowData.gfSsId < 0) {
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: this.langService.getInstantTranslation('choose-gfs') });
      return;
    }
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
