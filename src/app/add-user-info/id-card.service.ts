import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IdCard} from './id-card.model';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdCardService {
  constructor(private http: HttpClient) {
  }

  saveIdCard(idCard: IdCard): Observable<IdCard> {
    return this.http.post<IdCard>(environment.baseUrl + 'saveIdCardInfo', idCard);
  }
}
