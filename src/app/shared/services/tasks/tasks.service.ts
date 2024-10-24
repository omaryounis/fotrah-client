import { Injectable, signal } from '@angular/core';
import { ITask, ITaskConfirm, ITaskResponse } from '@root/src/app/modules/transactions/components/tasks/tasks.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';
import { LoginService } from '../login/login.service';
import { IObjection } from '@shared/models/objection.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TasksService extends BaseEntityService<ITask> {
  taksRequestsData = signal<{tasks : number , requests : number}>({tasks: 0,requests : 0 });
  rowData = signal<ITask>({ } as ITask);
  objections = signal<IObjection[]>([] as IObjection[]);
 
  getTasks(pageIndex: string, pageSize: number ,status? : number , objectionNumber? : number): Observable<ITaskResponse> {
    var params = status ? '&status=' + status : '';
    params += objectionNumber ? '&objectionNumber=' + objectionNumber : '';
    return this.http
      .get<ITaskResponse>(`${environment.proxyBase}/Missions?PageIndex=` + pageIndex + `&PageSize=` + pageSize + params )
      .pipe(tap((response: ITaskResponse) => {
        // Assuming setBaseEntity returns BaseEntityType<ITask>[].
        this.setBaseEntity(response.data.userMissions);
        this.setTotalCount(response.data.totalCount)
      }));
  }
  getTasksAndRequests(): Observable<ITaskResponse> {
    return this.http
    .get<ITaskResponse>(`${environment.proxyBase}/Missions/TasksAndRequests`)
    .pipe(tap((response: ITaskResponse) => {
      // Assuming setBaseEntity returns BaseEntityType<ITask>[].
       
      this.taksRequestsData.set(response.data);
    }));
  }
  getTaskDetails(RequestId: number): Observable<ITaskResponse> {
    return this.http
    .get<ITaskResponse>(`${environment.proxyBase}/Missions/GetRequestDetails?RequestId=` + RequestId)
    .pipe(tap((response: ITaskResponse) => {
      // Assuming setBaseEntity returns BaseEntityType<ITask>[].
      // this.setBaseEntity(response.data.userMissions);
      }));
    }
    
    ConfirmTask(Task: ITaskConfirm , approveType :string): Observable<IResponse<ITaskConfirm>> {  
      return this.http
      .post<IResponse<ITaskConfirm>>(`${environment.proxyBase}/Missions/` + approveType, Task)
      .pipe(tap((response: IResponse<ITaskConfirm>) => {
        // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
        // this.upsertBaseEntity(response.data);
      }));
  }
    VoteTask(Task: ITaskConfirm ): Observable<IResponse<ITaskConfirm>> {  
      return this.http
      .post<IResponse<ITaskConfirm>>(`${environment.proxyBase}/Missions/Vote`, Task)
      .pipe(tap((response: IResponse<ITaskConfirm>) => {
        // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
        // this.upsertBaseEntity(response.data);
      }));
  }
  RejectTask(requestId : number): Observable<IResponse<ITaskConfirm>> {  
    return this.http
      .post<IResponse<ITaskConfirm>>(`${environment.proxyBase}/Missions/Reject`, {requestId : requestId})
      .pipe(tap((response: IResponse<ITaskConfirm>) => {
        // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
        // this.upsertBaseEntity(response.data);
      }));
    }
    
    updateTask(Task: ITask): Observable<IResponse<ITask>> {
      return this.http
      .put<IResponse<ITask>>(`${environment.proxyBase}/Tasks`, Task)
      .pipe(tap((response: IResponse<ITask>) => {
        // Assuming setBaseEntity returns BaseEntityType<ITask>[].
        // this.upsertBaseEntity(response.data);
      }));
    }
    
    deleteTask(id: number): Observable<ITask> {
      return this.http
      .delete<ITask>(`${environment.proxyBase}/Tasks/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
    }
    getRequestsList(pageIndex: string, pageSize: number): Observable<ITaskResponse> {
      return this.http
        .get<ITaskResponse>(`${environment.proxyBase}/Missions/userRequests?PageIndex=` + pageIndex + `&PageSize=` + pageSize)
        .pipe(tap((response: ITaskResponse) => {
          // Assuming setBaseEntity returns BaseEntityType<ITask>[].
          this.setBaseEntity(response.data.userMissions);
          this.setTotalCount(response.data.totalCount)
        }));
    }
    getObjectionList(pageIndex: string, pageSize: number ,status? : number , objection_number? : string): Observable<ITaskResponse> {
      var params = status ? '&status=' + status : '';
      params += objection_number ?  '&ObjectionNumber=' + objection_number : '';
      return this.http
        .get<ITaskResponse>(`${environment.proxyBase}/Objection?PageIndex=` + pageIndex + `&PageSize=` + pageSize + params)
        .pipe(tap((response: ITaskResponse) => {
          // Assuming setBaseEntity returns BaseEntityType<ITask>[].
          this.objections.set(response.data.objectionRequests);
          this.setTotalCount(response.data.totalCount)
        }));
    }

     // Method to fetch the image URL from the API
  getImageFromAPI(url :string):  Observable<any> {
   return this.http.get(url , {responseType : 'blob'});
  }
  }