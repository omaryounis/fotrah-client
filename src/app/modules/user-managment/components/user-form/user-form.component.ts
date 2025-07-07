import { Component, Input, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { InputTextModule } from "primeng/inputtext";

import { IUser, TFormModes } from "../../user-managment.model";
import { IRole, ISelectValue } from "../../../roles-management/role.model";
import { take } from "rxjs";
import { RoleService } from "@shared/services/roles/roles.service";
import { MultiSelectModule } from "primeng/multiselect";
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from "primeng/dynamicdialog";
import { ButtonModule } from "primeng/button";
import { TranslateModule } from "@ngx-translate/core";
import { PermissionService } from "@shared/services/permission-service/permission.service";
import { IPermission } from "@shared/models/permission.model";
import { LanguageService } from "@shared/services/language/language.service";
import { UsersService } from "@shared/users/users.service";
import { DropdownModule } from "primeng/dropdown";
import { CommonModule } from "@angular/common";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [FormsModule, CommonModule, InputTextModule, DynamicDialogModule, MultiSelectModule, ButtonModule, TranslateModule , DropdownModule, TooltipModule],
  providers: [DynamicDialogRef],
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.scss",
})
export class UserFormComponent implements OnInit {
  passwordsMatch: boolean = true;
  permissions: any;
  selectedADuser: any;
  lang = localStorage.getItem('lang');
  roles: ISelectValue[] =[]
  activeDirctoryUsers: any[] =[];
  labelConfirmation: string = "";

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig, private permissionService : PermissionService,  private roleService : RoleService,   private userServices : UsersService, private langService:LanguageService) {

  }
  ngOnInit(): void {
    this.permissionService.getPermissions().pipe(take(1)).subscribe(
      (respone) => {
        this.permissions = respone.data.map((a: any) => ({ value: a.id, name: this.langService.getInstantTranslation(a[this.langService.getNameFormat()!]) ,description :a.description  }));
      }
    );
    this.roleService.getRoles().pipe(take(1)).subscribe(
      (respone) => {
        this.roles = respone.data.roles.map((a: IRole) => ({ value: a.id, name: this.lang == 'ar' ? a.nameAr : a.nameEn }));
        // this.roles.push({value : 1 , name : "admin"});
      }
    );
    this.userServices.getADUsers().pipe(take(1)).subscribe(
      (respone) => {
        this.activeDirctoryUsers = respone.data.users;
      }
    );

    
 if (this.mode === "add") {
  this.userData = this.config.data.userData;
 }
 
//  this.labelConfirmation =  this.userData.status == true ? ;
    
    // this.userData.roles = [1]
  }
  selectedRoles: ISelectValue[] = []
  selectedPermission: ISelectValue[] = []
  // roleService = inject(RoleService);
  @Input() userData: IUser = {
    name: "",
    email: "",
    nationalId: "",
    phoneNumber: "",
    userName: "",
    // status : true,
    roles : []
  };
  @Input() mode: TFormModes = "add";

  updatingData() {
    console.log('roles' , this.userData.roles);
    
    // this.userData.roles = this.selectedRoles.map((a: ISelectValue) => (a.value));
    // this.userData.permissions = this.selectedPermission.map((a: ISelectValue) => (a.value));
  }
  checkPasswords() {
    this.passwordsMatch = this.userData.password === this.userData.confirmPassword;
  }
}
