import { Component, Input } from '@angular/core';
import { CrudModalComponent, ICrudModLInputs } from '@shared/components/crud-modal/crud-modal.component';
import { FormRoleComponent } from '../form-role/form-role.component';
import { ModalService } from '@shared/services/modal/modal.service';
import { Subscription } from 'rxjs';
import { IRole } from '../../role.model';

@Component({
  selector: 'app-show-role',
  standalone: true,
  imports: [CrudModalComponent, FormRoleComponent],
  templateUrl: './show-role.component.html',
  styleUrl: './show-role.component.scss'
})
export class ShowRoleComponent {
  @Input() modalService!: ModalService;
  @Input() roleData!: IRole;

  modalServiceSubscription!: Subscription;
  modalConfig: ICrudModLInputs = {
    visible: false,
    title: "role-details",
  };

  closeModal() {
    this.modalService.closeModal();
  }
  submitRole() {
    this.closeModal();
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
