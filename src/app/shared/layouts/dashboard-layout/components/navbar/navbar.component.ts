import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, inject } from "@angular/core";

import { Menu, MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { MenubarModule } from "primeng/menubar";

import { SidebarService } from "@shared/services/sidebar.service";
import { LoginService } from "@shared/services/login/login.service";
import { IUserInfo } from "@shared/models/user.model";
import { MenuItem } from "primeng/api";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";
import { BreadcrumbService } from "@shared/services/breadcrumb/breadcrumb.service";
import { NotificationComponent } from "@shared/components/notification/notification.component";
import { BadgeModule } from "primeng/badge";
import { NotificationService } from "@shared/services/notification/notification.service";
import { interval, Subscription } from "rxjs";
import { CanComponent } from "@shared/components/can/can.component";
import { ModalService } from "@shared/services/modal/modal.service";
import { jwtDecode, JwtPayload } from "jwt-decode";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [MenuModule, ButtonModule, DividerModule, MenubarModule , TranslateModule, CanComponent ,NotificationComponent, BadgeModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent implements OnInit,OnDestroy {
  @Input() modalService: ModalService =new ModalService();
  @ViewChild("menu") menu!: Menu;
  @ViewChild(NotificationComponent) notificationComponent!: NotificationComponent;
  translateService = inject(TranslateService)
  userInfo: IUserInfo | null = null;
  isButtonClicked = false;
  items: any;
  profileItems: MenuItem[] = [
    { label: this.translateService.instant('profile'), icon: "pi pi-user", routerLink: '/dashboard/profile' },
    // { label: 'الإعدادات', icon: 'pi pi-cog' },
  ];
  browserLang: string = '';

  constructor(
    private languageService: LanguageService,
    private breadcumbService: BreadcrumbService,
    private elRef: ElementRef,
    private loginService: LoginService,
    private sidebarService: SidebarService,
    private notificationService: NotificationService,
  ) {
this.getNotifications();
   }

  toggleProfileMenu($event: MouseEvent) {
    this.isButtonClicked = !this.isButtonClicked;
    this.menu.toggle($event);
  }
  modalServiceSubscription!: Subscription;
  
get notificationCount() {
  return parseInt(this.notificationService.count());
}
  onOpenSideBar() {
    this.sidebarService.toggleSideBar(true);
  }

  onLogout() {
    this.loginService.logout();
  }

  ngOnInit(): void {
    this.browserLang = localStorage.getItem('lang')!;
    this.userInfo = this.loginService.getUserInfo();
    this.intervalSubscription = interval(100000) // Emit every 5 seconds
    .subscribe(() => {
      // Your code to execute every 5 seconds
      this.modalService.closeModal();
      this.notificationService.getNotificationCount().subscribe();
    });
    this.modalServiceSubscription = this.modalService.isVisable$.subscribe(
      (isVisable) => {
        // this.modalConfig.visible = isVisable;
      }
    );
  }

  private intervalSubscription: Subscription | undefined;
  ngOnDestroy() {
    this.intervalSubscription!.unsubscribe();
    this.modalServiceSubscription.unsubscribe();
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isButtonClicked = false;
      if (this.notificationComponent.isOpen) {
        
        this.notificationComponent.toggleMenu();
      }
    }
  }
  toggleLang() {
    const switchedLanguage = localStorage.getItem('lang')! == 'ar' ? 'en' : 'ar';
    this.browserLang = switchedLanguage;
    this.languageService.switchLanguage(switchedLanguage, true);
    this.breadcumbService.initializeBreadCrumb();
  }
 getNotifications(){
  // var token = localStorage.getItem('accessToken')!;
  // var userData = jwtDecode(token) as JwtPayload & {sid : ''};
  this.notificationService.getNotificationCount().subscribe();
  // this.notificationService.getNotification(userData.sid!).subscribe();
 }
  toggleMenu = () => this.notificationComponent.toggleMenu();
}
