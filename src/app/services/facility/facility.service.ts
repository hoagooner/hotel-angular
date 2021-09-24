import { environment } from 'src/environments/environment';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FacilityService {

  constructor(private http: HttpClient) { }

  getAll(data?): Observable<any> {

    return this.http.get(`${environment.SERVER_URL}/api/facilities`,{
      params:{
        query:data.query,
        pageSize: data.pageSize,
        pageNumber: data.pageNumber,
        sortBy: data.sortBy,
        sortDirection: data.sortDirection,
      }
    });
  }

  getList(): Observable<any>{
      return this.http.get(`${environment.SERVER_URL}/api/facilities/list`);
  }

  get(id) {
    return this.http.get(`${environment.SERVER_URL}/api/facilities/${id}`);
  }

  create(data) {
    return this.http.post(`${environment.SERVER_URL}/api/facilities`, data);
  }

  update(id, data) {
    return this.http.put(`${environment.SERVER_URL}/api/facilities/${id}`, data);
  }

  delete(id) {
    return this.http.delete(`${environment.SERVER_URL}/api/facilities/${id}`);
  }

  deleteAll() {
    return this.http.delete(`${environment.SERVER_URL}/api/facilities`);
  }

  findByName(name){
    return this.http.get(`${environment.SERVER_URL}/api/facilities/search?name=${name}`);
  }
}
