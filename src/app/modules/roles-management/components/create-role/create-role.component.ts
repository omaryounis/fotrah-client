import { Component, inject } from '@angular/core';
import { FormRoleComponent } from '../form-role/form-role.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { AbilityService } from '@casl/angular';
import { AppAbility } from '@shared/services/ability/ability.service';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Observable, take } from 'rxjs';
import { ModalService } from '@shared/services/modal/modal.service';
import { IRole } from '../../role.model';
import { RoleService } from '@shared/services/roles/roles.service';
import { LanguageService } from '@shared/services/language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { MessagesResponse } from '@shared/enums/messages-response.enum';
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormRoleComponent, TranslateModule, CanComponent],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.scss'
})
export class CreateRoleComponent {
  ref: DynamicDialogRef | undefined;
  roleService = inject(RoleService)
  readonly ability$: Observable<AppAbility> = new Observable<AppAbility>();
  editModalService: ModalService = new ModalService();
   roleData: IRole = {
    nameAr: "",
    nameEn: "",
    permissions : [],
  };

  constructor(
    public dialogService: DialogService,
    abilityService: AbilityService<AppAbility>,
    private langService: LanguageService,
    private messageService: MessageService,
  ) {
    this.ability$ = abilityService.ability$;
  }

  onClickAddRoleButton(event: any) {
    this.roleData = {} as IRole;
    
    event.stopPropagation();

    this.ref = this.dialogService.open(FormRoleComponent, {
      header: this.langService.getInstantTranslation('add-role'),
      styleClass: "crud-modal",
      data: {
        roleData: this.roleData,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.createRole(this.roleData)
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
  private createRole(role: IRole) {
    if(!role.formValidation  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    if (!role.permissions || role.permissions?.length == 0) {
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: this.langService.getInstantTranslation('choose-one-role') });
      return;
    }
    
      this.roleService
        .createRole(role)
        .pipe(take(1))
        .subscribe((res) => {
          
          if (res.message == MessagesResponse.SUCCESS) {
            this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-added-success') });
            this.ref?.close();
            this.roleService.getRoles(10 , 1)
          } else {
            this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message });
          }
        });
    
  }
}
