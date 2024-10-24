import { Component, Input, OnDestroy, OnInit, inject } from "@angular/core";

import { UserFormComponent } from "../user-form/user-form.component";
import {
  ICrudModLInputs,
  CrudModalComponent,
} from "@shared/components/crud-modal/crud-modal.component";

import { IUser, TFormModes } from "../../user-managment.model";

import { ModalService } from "@shared/services/modal/modal.service";
import { Subscription } from "rxjs";
import { UsersService } from "@shared/users/users.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-show-user",
  standalone: true,
  imports: [UserFormComponent, CrudModalComponent],
  templateUrl: "./show-user.component.html",
  styleUrl: "./show-user.component.scss",
})
export class ShowUserComponent {
  @Input() modalService!: ModalService;
  @Input() userData!: IUser;
  @Input() mode: TFormModes = "show";
  userService = inject(UsersService);
  messageService = inject(MessageService);
  modalServiceSubscription!: Subscription;

  modalConfig: ICrudModLInputs = {
    visible: false,
    title: "user-details",
    submitLable: "delete",
    cancelLabel: "cancel"
  };

  closeModal() {
    console.log('mode', this.mode);
    this.modalService.closeModal();
  }
  submitUser() {

  }

  ngOnInit(): void {
    this.modalServiceSubscription = this.modalService.isVisable$.subscribe(
      (isVisable) => {
        this.modalConfig.visible = isVisable;
      }
    );

  }

  ngOnDestroy(): void {
    this.modalServiceSubscription.unsubscribe();
  }
}
