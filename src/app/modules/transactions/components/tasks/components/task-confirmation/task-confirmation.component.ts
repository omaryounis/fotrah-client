import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { TaskFormComponent } from "../task-form/task-form.component";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { ITask } from "../../tasks.model";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-task-confirmation",
  standalone: true,
  imports: [ButtonModule, TaskFormComponent , TranslateModule],
  templateUrl: "./task-confirmation.component.html",
  styleUrl: "./task-confirmation.component.scss",
})
export class TaskConfirmationComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  // @Input() taskData: ITask = {
  //   id: "",
  //   type: "",
  //   date: "",
  //   sender: "",
  //   status: "",
  //   requestTypeId : 0,
  // };

  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService) {}


}
