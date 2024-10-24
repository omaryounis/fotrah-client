import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

import { MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { MenubarModule } from "primeng/menubar";

import { LoginService } from "@shared/services/login/login.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MenuModule, ButtonModule, DividerModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private loginService: LoginService,
  ) { }

  onLogout() {
    this.loginService.logout();
  }
}
