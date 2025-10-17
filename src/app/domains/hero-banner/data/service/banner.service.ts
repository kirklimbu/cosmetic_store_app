import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBannerDto } from 'src/app/domains/home/data/model/home.model';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  // public homeContents = signal<Home | undefined>({});
  apiUrl = `${environment.apiUrl}`;

  private http = inject(HttpClient);

  getBannerList(): Observable<IBannerDto[]> {
    return this.http.get<IBannerDto[]>(`${this.apiUrl}auth/banner/list`, {});
  }
  getFormValues(id: number): Observable<IBannerDto> {
    console.log('form', id);

    return this.http.get<IBannerDto>(`${this.apiUrl}auth/banner/form`, {
      params: { bannerId: id },
    });
  }

  saveBanner(banner: IBannerDto): Observable<ICustomResponse> {
    console.log('saving memeber', banner);

    const { path, ...teamWithoutDoc } = banner; // destructure to remove doc

    const formData = new FormData();
    formData.append('form', JSON.stringify(teamWithoutDoc));
    formData.append('file', banner.path);

    return this.http.post<ICustomResponse>(
      `${this.apiUrl}auth/banner/save`,
      formData
    );
  }
}
