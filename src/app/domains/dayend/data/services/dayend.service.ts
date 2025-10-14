import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from 'src/environments/environment';
import { IDayend2Dto, IDayendDto } from '../model/dayend';

@Injectable({
  providedIn: 'root',
})
export class DayendService {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  saveDayend(id: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}auth/dayend/save?dayEndId=${id}`,
      {}
    );
  }

  getDayendList(): Observable<IDayendDto[]> {
    return this.http.get<IDayendDto[]>(`${this.apiUrl}auth/dayend/list`);
  }

  getCurrentDayend(): Observable<IDayend2Dto> {
    console.log('get current dayend service');

    return this.http.get<IDayend2Dto>(`${this.apiUrl}auth/current/dayend`);
  }
}
