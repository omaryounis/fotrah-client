
import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';

import { catchError, delay, retryWhen, switchMap, tap, timeout } from 'rxjs/operators';
import { environment } from '@root/src/environments/environment';
 
@Injectable({

  providedIn: 'root'

})

export class NotificationService {
  count = signal<string>('0')
  notificationsList = signal<any[]>([])
  private apiUrl = environment.proxyBase + '/notifications';
  constructor(private http: HttpClient) {}
 
  getNotification( userId : string ,pageIndex? : number ,pageSize? : number): Observable<any> {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 50;
    var addtionUrl = '/Notifications?PageIndex=' + pageIndex + '&PageSize=' + pageSize + '&UserId=' + userId;
    return this.http
      .get<any>(environment.proxyBase + addtionUrl)
      .pipe(tap((response: any) => {
        this.notificationsList.set(response.notifications);
        
      }));
  }
  getNotificationCount(): Observable<any> {
   
    var addtionUrl = '/Notifications/GetUnSeenCount';
    return this.http
      .get<any>(environment.proxyBase + addtionUrl)
      .pipe(tap((response: any) => {
        this.setCount(response);
      
      }));
  }
  markAsRead(id : number): Observable<any> {
   
    var addtionUrl = '/Notifications/SetSeen?id=' + id;
    return this.http
      .put<any>(environment.proxyBase + addtionUrl , {})
      .pipe(tap((response: any) => { }));
  }
  markAllAsRead(): Observable<any> {
   
    var addtionUrl = '/Notifications/MarkAllRead';
    return this.http
      .put<any>(environment.proxyBase + addtionUrl , {})
      .pipe(tap((response: any) => { }));
  }
  setCount(count: any) {
   this.count.set(count)
  }

}

 