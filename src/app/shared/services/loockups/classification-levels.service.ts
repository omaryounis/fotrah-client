import { Injectable } from '@angular/core';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassificationLevelsService extends BaseEntityService<any> {

  
  getClassificationLevels(): Observable<any> {
    return this.http
      .get<any>(`${environment.proxyBase}/Classifications`)
      .pipe(tap((response: any) => {
        // Assuming setBaseEntity returns BaseEntityType<IActivity>[].
        this.setBaseEntity(response.data.activities);
      }));
  }


}
