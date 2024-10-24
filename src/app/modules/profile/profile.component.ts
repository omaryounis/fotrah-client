import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ButtonModule } from 'primeng/button';
import { IUser, TFormModes } from '../user-managment/user-managment.model';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { UsersService } from '@shared/users/users.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '@shared/services/error/error.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@shared/services/language/language.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PageHeaderComponent, ButtonModule, FormsModule, InputTextModule , TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userData = {} as IUser;
  mode: TFormModes = 'show';
  langService = inject(LanguageService);
  constructor(private userService: UsersService, private messageService: MessageService, private errorService: ErrorService) {
    this.getUserInfo();

  }

  saveData() {
    if (this.mode === 'show') {
      this.mode = 'edit';
    } else {
      this.userService.updateUser(this.userData).subscribe({
        next: (data) => {
          // Handle success response here
          this.mode = 'show';
          this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-success')});

        },
        complete: () => {
          // Handle completion here (optional)
          if (this.mode == 'edit') {
            this.getUserInfo();
          }

        }
      })
      this.mode = 'show'
    }
  }
  getUserInfo() {
    // Parse the string to an object
    const data = JSON.parse(localStorage.getItem('userInfo')!);
    const decodedAccessToken = jwtDecode(localStorage.getItem('accessToken')!) as JwtPayload & { sid: '' };
    delete data.accessToken;
    delete data.refreshToken;
    data.id = decodedAccessToken.sid
    if (data) {
      this.userData = data as IUser;
      this.mode = 'show';
    }
  }
}
