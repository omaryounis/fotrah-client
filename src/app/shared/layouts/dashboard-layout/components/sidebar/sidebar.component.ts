import { Component, HostListener, OnDestroy, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";

import { MenuModule } from "primeng/menu";
import { SidebarModule } from "primeng/sidebar";

import { CanComponent } from "@shared/components/can/can.component";

import { SidebarService } from "@shared/services/sidebar.service";
import { Subscription } from "rxjs";
// import { HasPermissionGuard } from "@shared/guards/permissions/permissions.guard";
import { LoginService } from "@shared/services/login/login.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [MenuModule, SidebarModule, CanComponent, TranslateModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent implements OnInit, OnDestroy {
  private sideBarServiceSubscription!: Subscription;

  sidebarState: boolean = true;
  sideMenuItems = [
    { label: "الملف الشخصي", icon: "pi pi-user" },
    { label: "الإعدادات", icon: "pi pi-cog" },
  ];
  showCloseIcon = false;
  position = localStorage.getItem('lang') == 'ar' ? 'right' : 'left';
  constructor(private router: Router, private sidebarService: SidebarService, private loginService: LoginService) { }

  private checkScreenSize(): void {
    if (window.innerWidth < 640) {
      this.showCloseIcon = true;
    } else {
      this.showCloseIcon = false;
    }
  }

  onSideBarHide() {
    this.sidebarService.toggleSideBar(false);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      const sidebar = document.getElementsByClassName('p-sidebar');
      this.sidebarService.toggleSideBar(true);
      event.preventDefault(); // Prevent default behavior
      event.stopPropagation(); // Stop propagation
    }
  }
  ngOnInit(): void {
    this.checkScreenSize();

    this.sideBarServiceSubscription =
      this.sidebarService.sidebarState$.subscribe((sideBarState) => {
        this.sidebarState = sideBarState;
      });
  }
  isActiveLink(component: string) {
    return this.loginService.checkPermissions(component , true);
  }

  ngOnDestroy(): void {
    this.sideBarServiceSubscription.unsubscribe();
  }
}
