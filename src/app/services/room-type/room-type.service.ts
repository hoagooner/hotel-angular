import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

  constructor(private http: HttpClient) { }

   getAll(data?): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/api/room-types`,{
        params:{
          query:data.query,
          pageSize: data.pageSize,
          pageNumber: data.pageNumber,
          sortBy: data.sortBy,
          sortDirection: data.sortDirection,
        }
      });
  }

  get(id) {
    return this.http.get(`${environment.SERVER_URL}/api/room-types/${id}`);
  }

  create(data) {
    return this.http.post(`${environment.SERVER_URL}/api/room-types`, data);
  }

  update(id, data) {
    return this.http.put(`${environment.SERVER_URL}/api/room-types/${id}`, data);
  }

  delete(id) {
    return this.http.delete(`${environment.SERVER_URL}/api/room-types/${id}`);
  }

  deleteAll() {
    return this.http.delete(`${environment.SERVER_URL}/api/room-types`);
  }

  findByName(name) {
    return this.http.get(`${environment.SERVER_URL}/api/room-types/search?name=${name}`);
  }
}
