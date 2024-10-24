import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { LoginService } from '@shared/services/login/login.service';

interface IBaseEntityObject {
  id?: number;
}

type BaseEntityType<T> = T & IBaseEntityObject;

@Injectable({
  providedIn: 'root',
})
export class BaseEntityService<T> {
  http = inject(HttpClient);
  loginService = inject(LoginService); 
  entities = signal<BaseEntityType<T>[]>([]);
  totalCount = signal<number>(0);
  pageIndex = signal<number>(0);

  protected setBaseEntity = (entity: BaseEntityType<T>[]) => {
    this.entities.set(entity);
  };

  protected setTotalCount = (totalCount:number) => {
    this.totalCount.set(totalCount);
  };
  public setPageIndex = (pageIndex:number) => {
    this.pageIndex.set(pageIndex);
  };

  protected upsertBaseEntity = (entity: BaseEntityType<T>) => {
    const index = this.entities().findIndex((data) => data.id === entity.id);
    if (index === -1) {
      this.entities.set([...this.entities(), entity]);
      return;
    }
    this.entities.update((entity: any) => ([...this.entities(), entity]));
  };

  protected removeBaseEntity = (id: number) => {
    this.entities.set(
      this.entities().filter((entity) => entity.id !== id)
    );
  };
}