import { Component, OnInit, ViewChild, inject, signal } from "@angular/core";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { Menu, MenuModule } from "primeng/menu";

import { ShowUserComponent } from "../show-user/show-user.component";
import { EditUserComponent } from "../edit-user/edit-user.component";
import { CreateUserComponent } from "../create-user/create-user.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ModalService } from "@shared/services/modal/modal.service";
import { ScreenService } from "@shared/services/screen/screen.service";
import { IUser, TFormModes } from "../../user-managment.model";
import { UsersService } from "@shared/users/users.service";
import { Subscription, take } from "rxjs";
import {
  CrudModalComponent,
  ICrudModLInputs,
} from "@shared/components/crud-modal/crud-modal.component";
import { UserFormComponent } from "../user-form/user-form.component";
import { MessageService } from "primeng/api";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";
import { PaginatorModule } from "primeng/paginator";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { AsyncPipe } from "@angular/common";
import { InputSwitchModule } from "primeng/inputswitch";
import { data } from "autoprefixer";

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: "app-list-users",
  standalone: true,
  imports: [
    MenuModule,
    TableModule,
    ButtonModule,
    ShowUserComponent,
    EditUserComponent,
    SearchBarComponent,
    PageHeaderComponent,
    CreateUserComponent,
    CrudModalComponent,
    UserFormComponent,
    TranslateModule,
    PaginatorModule,
    AsyncPipe,
    InputSwitchModule,
  ],
  providers: [ModalService],
  templateUrl: "./list-users.component.html",
  styleUrl: "./list-users.component.scss",
})
export class ListUsersComponent implements OnInit {
  @ViewChild("menu") menu!: Menu;
  searchValue: string = "";
  showTableCollapseMode: boolean = false;
  userService = inject(UsersService);
  langService = inject(LanguageService);
  mode: TFormModes = "delete";
  modalServiceSubscription!: Subscription;

  deleteConfig: ICrudModLInputs = {
    visible: false,
    title: this.langService.getInstantTranslation("activation-deactivation"),
    submitLable: this.langService.getInstantTranslation("confirm"),
    cancelLabel: this.langService.getInstantTranslation("cancel"),
  };
  searchQuery = signal<string>("");
  get users() {
    const searchText = this.searchQuery();
    return this.userService.entities();
  }
  get totalCount() {
    return this.userService.totalCount();
  }

  actionItems = [
    { label: "تنزيل", icon: "pi pi-download" },
    { label: "حذف", icon: "pi pi-trash" },
    {
      label: "اظهار",
      icon: "pi pi-eye",
      command: () => {
        this.showModalService.openModal();
      },
    },
    {
      label: "تعديل",
      icon: "pi pi-file-edit",
      // command: () => {
      //   this.editModalService.openModal();
      // },
    },
  ];

  selectedUser: IUser = {
    name: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    userName: "",
    roles: [],
  };
  editModalService: ModalService = new ModalService();
  showModalService: ModalService = new ModalService();
  deleteModalService: ModalService = new ModalService();
  onSearchUpdated(sq: string) {
    this.searchQuery.set(sq);
  }
  constructor(
    private screenService: ScreenService,
    private messageService: MessageService,
    private translateService :LanguageService
  ) {
    this.getUsersList(10, 1);
  }

  toggleActionsMenu($event: MouseEvent) {
    this.menu.toggle($event);
  }

  onSearchTextChange(searchValue: any) {
    this.searchQuery.set(searchValue);
  }

  openEditUser(userData: any) {
    this.selectedUser = userData;

    this.editModalService.openModal();
  }

  openShowUser(userData: IUser) {
    this.selectedUser = userData;
    this.showModalService.openModal();
  }
  openActivationModal(userData: IUser) {
     
    this.selectedUser = userData;
    this.deleteModalService.openModal();
  }
  closeDeleteModal() {
    this.deleteModalService.closeModal();
  }
  submitDeleteUser() {
    var data = {
      id: this.selectedUser.id,
      roles: this.prepareRoles(this.selectedUser.roles!),
      permissions: this.selectedUser.permissions || [],
      status : !this.selectedUser.status
    } as IUser;

    this.userService
      .updateUser(data)
      .pipe(take(1))
      .subscribe((res) => {
        // this.userData.id = -1;
        if (res.message === MessagesResponse.SUCCESS) {
          this.messageService.add({
            severity: "success",
            summary: this.translateService.getInstantTranslation("done"),
            detail: this.translateService.getInstantTranslation(
              "user-updated-successfully"
            ),
          });
          this.userService.getUsers(10 ,1).subscribe();
          this.closeDeleteModal();
        }
      });
  }
  prepareRoles(roles: any[]): any[] {
    if (roles.length <= 0 ) {
      return [];
    }else if(typeof roles[0] == 'number') {
      return roles;
    }else {
      return roles.map(data => data.id);
    }
  }

  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.modalServiceSubscription =
      this.deleteModalService.isVisable$.subscribe((isVisable) => {
        this.deleteConfig.visible = isVisable;
      });
  }

  getUsersList(pageSize: number, pageCount: number) {
    this.userService
      .getUsers(pageSize, pageCount, this.searchQuery())
      .pipe(take(1))
      .subscribe((res) => {
        for (const user of this.users) {
          if (user.roles && user.roles.length > 0) {
            user.roles = user.roles.map((role) => role.id);
          }
          if (user.permissions && user.permissions.length > 0) {
            user.permissions = user.permissions.map((a) => a.id);
          }
        }
      });
  }
  first: number = 1;
  rows: number = 10;

  onPageChange(event: any) {
    if (this.rows != event.rows) {
      this.searchQuery.set("");
    }
    this.first = event.first;
    this.rows = event.rows;
    // this.userService.setPageIndex(event.page + 1);
    this.getUsersList(this.rows, event.page + 1);
  }
}
