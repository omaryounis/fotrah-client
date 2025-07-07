import { Component, Input, NgModule, OnInit, inject } from '@angular/core';
import { IRole, ISelectValue, TFormModes } from '../../role.model';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { PermissionService } from '@shared/services/permission-service/permission.service';
import { take } from 'rxjs';
import { IPermission } from '@shared/models/permission.model';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@shared/services/language/language.service';
import { CommonModule } from '@angular/common';
import { TooltipModule } from "primeng/tooltip";
@Component({
  selector: 'app-form-role',
  standalone: true,
  imports: [FormsModule, InputTextModule, DynamicDialogModule, MultiSelectModule, TranslateModule,CommonModule,TooltipModule],
  providers: [DynamicDialogRef],
  templateUrl: './form-role.component.html',
  styleUrl: './form-role.component.scss'
})

export class FormRoleComponent implements OnInit {
  permissions: ISelectValue[] = []
  selectedPermissions: ISelectValue[] = []
  permissionService = inject(PermissionService);
  lang = localStorage.getItem('lang');
  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig , private langService:LanguageService) {

  }
  ngOnInit(): void {
    this.permissionService.getPermissions().pipe(take(1)).subscribe(
      (respone) => {
        this.permissions = respone.data.map((a: IPermission) => ({ value: a.id, name: this.langService.getInstantTranslation(a.nameAr!),description : a.description }));
      }
    );
    
    this.roleData = this.mode == "add" ?  this.config.data.roleData : this.roleData;
    this.roleData.formValidation =  this.mode == "edit" ? true : false;
  }

  @Input()public roleData: IRole = {
    nameAr: "",
    nameEn: "",
    usersPerRoleCount: 0,
    status: "",
    id: -1,
  };
  @Input() mode: TFormModes = "add";

  updatingData() {
    this.roleData.permissions = this.selectedPermissions.map((a: ISelectValue) => (a.value!));
  }
  getFormValidation = (invalid :boolean) => this.roleData.formValidation = !invalid;
  
}
