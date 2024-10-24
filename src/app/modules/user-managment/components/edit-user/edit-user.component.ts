import { Component, Input, OnDestroy, OnInit, inject } from "@angular/core";

import { UserFormComponent } from "../user-form/user-form.component";
import {
  ICrudModLInputs,
  CrudModalComponent,
} from "@shared/components/crud-modal/crud-modal.component";

import { IUser } from "../../user-managment.model";

import { ModalService } from "@shared/services/modal/modal.service";
import { Subscription, take } from "rxjs";
import { UsersService } from "@shared/users/users.service";
import { MessageService } from "primeng/api";
import { LanguageService } from "@shared/services/language/language.service";
import { MessagesResponse } from "@shared/enums/messages-response.enum";

@Component({
  selector: "app-edit-user",
  standalone: true,
  imports: [UserFormComponent, CrudModalComponent],
  templateUrl: "./edit-user.component.html",
  styleUrl: "./edit-user.component.scss",
})
export class EditUserComponent implements OnInit, OnDestroy {
  userService = inject(UsersService);
  messageService = inject(MessageService);
  translateService = inject(LanguageService);
  get pageIndex()  { return  this.userService.pageIndex() }
  @Input() modalService!: ModalService;
  @Input() userData: IUser = {
    name: "",
    email: "",
    nationalId: "",
    phoneNumber: "",
    userName: "",
    roles : [],
    permissions : []
  };

  modalServiceSubscription!: Subscription;
  modalConfig: ICrudModLInputs = {
    visible: false,
    title: "edit-user", 
    submitLable: "edit",
    cancelLabel: "cancel"
  };

  closeModal() {
    this.modalService.closeModal();
  }
  submitUser() {
    var data = {
      id : this.userData.id,
      roles : this.userData.roles || [],
      permissions : this.userData.permissions || []
    } as IUser

    if (Object.keys(data).length === 0 || !data.roles || data.roles?.length == 0 ) {
      this.messageService.add({ severity: 'error', summary: this.translateService.getInstantTranslation('sorry'), detail: this.translateService.getInstantTranslation('sure-etenred-data') });
      return;
    }

    this.userService
    .updateUser(data)
    .pipe(take(1))
    .subscribe((res) => {
      // this.userData.id = -1;
      if (res.message === MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.translateService.getInstantTranslation('done'), detail: this.translateService.getInstantTranslation('user-updated-successfully') });
        // this.userService.getUsers(10 ,this.pageIndex).subscribe();
        this.modalService.closeModal();
      }
     
    });
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
