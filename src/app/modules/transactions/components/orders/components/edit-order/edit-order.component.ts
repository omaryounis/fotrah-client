import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { TasksService } from "@shared/services/tasks/tasks.service";
import { MessageService } from "primeng/api";
import { LanguageService } from "@shared/services/language/language.service";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { StatusTypes } from "@shared/enums/status-types.enum";
import { LoginService } from "@shared/services/login/login.service";
import { TaskFormComponent } from "../../../tasks/components/task-form/task-form.component";
import { ITask } from "../../../tasks/tasks.model";
import { OrderFormComponent } from "../order-form/order-form.component";

@Component({
  selector: "app-edit-order",
  standalone: true,
  imports: [ButtonModule],
  templateUrl: "./edit-order.component.html",
  styleUrl: "./edit-order.component.scss",
})
export class EditOrderComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;

  @Input() rowData: ITask = {} as ITask;
  get orderData() {
    return this.taskService.rowData();
  }
  ref!: DynamicDialogRef;

  constructor(
    private dialogService: DialogService,
    private langService: LanguageService,
    private taskService: TasksService,
    private message: MessageService,
    private lang: LanguageService,
    private loginService: LoginService
  ) {}

  openEditModal(event: any) {
    event.stopPropagation();
    this.ref = this.dialogService.open(OrderFormComponent, {
      header: this.langService.getInstantTranslation("show-data"),
      styleClass: "crud-modal",
      data: {
        orderData: this.rowData,
        mode: "show",
        footer: {
          // submitLabel: false,
          showSubmit: false,
          cancelLabel:this.langService.getInstantTranslation('cancel'),
          onsubmit: () => {},
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
