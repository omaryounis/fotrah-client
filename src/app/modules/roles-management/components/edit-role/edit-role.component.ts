import { Component, Input, inject } from '@angular/core';
import { CrudModalComponent, ICrudModLInputs } from '@shared/components/crud-modal/crud-modal.component';
import { FormRoleComponent } from '../form-role/form-role.component';
import { IRole } from '../../role.model';
import { ModalService } from '@shared/services/modal/modal.service';
import { Subscription, take } from 'rxjs';
import { RoleService } from '@shared/services/roles/roles.service';
import { LanguageService } from '@shared/services/language/language.service';
import { MessageService } from 'primeng/api';
import { MessagesResponse } from '@shared/enums/messages-response.enum';
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [CrudModalComponent, FormRoleComponent, CanComponent],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent {
  @Input() modalService!: ModalService;
  @Input() roleData!: IRole;
  roleService = inject(RoleService)
  langService = inject(LanguageService)
  messageService = inject(MessageService)
  modalServiceSubscription!: Subscription;
  modalConfig: ICrudModLInputs = {
    visible: false,
    title: '',
    submitLable: "edit",
    cancelLabel : "cancel"
  };
  inValidateRoles: boolean = false;

  closeModal() {
    this.modalService.closeModal();
  }
  // submitRole() {
  //   this.closeModal();
  // }
  submitRole(): void {
    if(!this.roleData.formValidation){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
   if (this.roleData.permissions?.length == 0) {
     this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: this.langService.getInstantTranslation('choose-one-role') });
   } else {
     this.roleService
       .updateRole(this.roleData)
       .pipe(take(1))
       .subscribe((response) => {
         if (response.message === MessagesResponse.SUCCESS) {
           this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-successfully') });
           this.closeModal()
           this.roleService.getRoles().subscribe();
         }
       });
   }
  }


  /**
   *
   */
  constructor() {
    this.modalConfig.title = this.langService.getInstantTranslation('edit-role');

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
