import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, take } from "rxjs";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { UserFormComponent } from "../user-form/user-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { AbilityService } from "@casl/angular";
import { AppAbility } from "@shared/services/ability/ability.service";
import { IRole } from "../../../roles-management/role.model";
import { UsersService } from "@shared/users/users.service";
import { IUser } from "../../user-managment.model";
import { MessageService } from "primeng/api";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-create-user",
  standalone: true,
  imports: [CommonModule, ButtonModule, UserFormComponent, TranslateModule ,CanComponent],
  templateUrl: "./create-user.component.html",
  styleUrl: "./create-user.component.scss",
})
export class CreateUserComponent {
  ref: DynamicDialogRef | undefined;
  userService = inject(UsersService);
  messageService = inject(MessageService);
  readonly ability$: Observable<AppAbility> = new Observable<AppAbility>();
  userData = {} as IUser;

  constructor(
    private translateService: LanguageService,
    public dialogService: DialogService,
    abilityService: AbilityService<AppAbility>
  ) {
    this.ability$ = abilityService.ability$;
  }

  onClickAddUserButton(event: any) {
    this.userData = {} as IUser;
    event.stopPropagation();
    this.ref = this.dialogService.open(UserFormComponent, {
      header: this.translateService.getInstantTranslation('add-user'),
      styleClass: "crud-modal",
      data: {
        userData: this.userData,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.createUser(this.userData);
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

  private createUser(user: IUser) {
    if (Object.keys(user).length === 0 || !user.roles || !user.userName || user.userName?.trim() == '' || user.roles?.length == 0 ) {
      this.messageService.add({ severity: 'error', summary: this.translateService.getInstantTranslation('sorry'), detail: this.translateService.getInstantTranslation('sure-etenred-data') });
    } else {
      this.userService
        .createUser(user)
        .pipe(take(1))
        .subscribe(() => {
          this.userData.id = -1;
          this.messageService.add({ severity: 'success', summary: this.translateService.getInstantTranslation('done'), detail: this.translateService.getInstantTranslation('user-added-successfully') });
          this.ref?.close();
        });
    }
  }
}
