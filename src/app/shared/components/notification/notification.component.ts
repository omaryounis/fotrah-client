import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '@shared/services/login/login.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { interval, Subscription } from 'rxjs';
import { JwtPayload, jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notification',
  standalone : true,
  imports : [BadgeModule ,CardModule ,CommonModule ,TranslateModule , ListboxModule, ButtonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  lang : string = localStorage.getItem('lang')!;
  isCollapsed: boolean = true;
  userData: any;
  get notifications() {
    return this.notificationService.notificationsList()
  }
  displayedNotifications = signal<any[]>([])

  get notificationCount() {
    return this.notificationService.count()
  }
  constructor(private notificationService: NotificationService, private router:Router) {
    var token = localStorage.getItem('accessToken')!;
    this.userData = jwtDecode(token) as JwtPayload & {sid : ''};
    this.notificationService.getNotification(this.userData.sid!).subscribe(res => this.updateList());
  }
  isOpen:boolean = false;
  ngOnInit(): void {
    this.isCollapsed = true;
    this.intervalSubscription = interval(100000) // Emit every 5 seconds
    .subscribe(() => {
    
       this.getNotifications()
    });

  }
  getNotifications() {
    this.notificationService.getNotification(this.userData.sid!).subscribe(res => this.updateList());
    this.notificationService.getNotificationCount().subscribe();
    this.updateList();
  }
  toggleMenu = () => { ; this.isOpen = !this.isOpen }
  
  private intervalSubscription: Subscription | undefined;
  ngOnDestroy() {
    this.intervalSubscription!.unsubscribe();
  }
  markAsRead(id : number) {
    this.notificationService.markAsRead(id).subscribe(res =>
    {
      this.toggleMenu();
      this.getNotifications()
      this.router.navigate(['/dashboard/transactions/tasks']);
     });
  }
  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(res =>
    {
      this.toggleMenu();
      this.getNotifications()
      this.router.navigate(['/dashboard/transactions/tasks']);
     });
  }
  calculateTimeDifference(dateTime: string, unit: 'minutes' | 'hours'): number {
    const now = new Date();
    const creationDate = new Date(dateTime);
    const diffInMilliseconds = now.getTime() - creationDate.getTime();
  
    if (unit === 'minutes') {
      return Math.floor(diffInMilliseconds / (1000 * 60));
    } else if (unit === 'hours') {
      return Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    } else {
      return Math.floor(diffInMilliseconds / (1000 * 60 * 60 ));
    }
  }
  updateList = () => {
    if(this.isCollapsed) 
      this.displayedNotifications.set(this.notifications.slice(0 ,4))
    else
      this.displayedNotifications.set(this.notifications)
    
  } ;
}
