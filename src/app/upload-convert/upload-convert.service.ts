import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadConvertService {

  constructor(private http: HttpClient) {
  }

  pushFileToStorage(files: any): Observable<HttpEvent<{}>> {
    // const formdata: FormData = new FormData();
    // formdata.append('file', file);
    const req = new HttpRequest('POST', 'http://localhost:8080/api/upload', files, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
}
