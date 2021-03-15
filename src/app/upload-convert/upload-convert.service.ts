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
<<<<<<< HEAD
=======
    // const formdata: FormData = new FormData();
    // formdata.append('file', file);
>>>>>>> 33c350bbe204be0d8e2fd5411d0f8d659a3b3bc9
    const req = new HttpRequest('POST', 'http://localhost:8080/api/upload', files, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
}
