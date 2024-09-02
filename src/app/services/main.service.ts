import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CheckUserResponseData,
  SubmitFormResponseData,
} from '../shared/interface/responses';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private http: HttpClient) {}

  validateUsername(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>(`/api/checkUsername`, {
      username,
    });
  }

  submitForm(
    data: Array<{ country: string; username: string; birthday: string }>
  ): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', data);
  }
}
