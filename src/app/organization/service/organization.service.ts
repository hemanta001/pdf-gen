import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }

  getOrganizations(){
    return this.http.get<{ id: number, name: string, selected: boolean }[]>("http://localhost:8080/getOrganizations");
  }
}
