import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { TaskFormComponent } from "../task-form/task-form.component";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { ITask } from "../../tasks.model";

@Component({
  selector: "app-show-task",
  standalone: true,
  imports: [ButtonModule, TaskFormComponent],
  templateUrl: "./show-task.component.html",
  styleUrl: "./show-task.component.scss",
})
export class ShowTaskComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: ITask = {
    id: "",
    type: "",
    date: "",
    sender: "",
    status: "",
  };

  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService) {}

  openShowDetailsModal(event: any) {
    event.stopPropagation();
    this.ref = this.dialogService.open(TaskFormComponent, {
      header: "عرض مهمة",
      styleClass: "crud-modal",
      data: {
        taskData: this.rowData,
        mode: "show",
        footer: {
          cancelLabel: "إلغاء",
          showSubmit: false,
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
