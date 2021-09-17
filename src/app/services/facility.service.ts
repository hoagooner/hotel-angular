import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/facilities';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(private http: HttpClient) { }

  getAll(data?): Observable<any> {
    if (data) {
      if (data.query) {
        return this.http.get(`${baseUrl}?query=${data.query}&pageSize=${data.pageSize}&pageNumber=${data.pageNumber}`)
      } else {
        return this.http.get(`${baseUrl}?pageSize=${data.pageSize}&pageNumber=${data.pageNumber}`)
      }
    }
    return this.http.get(`${baseUrl}`);
  }

  get(id) {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data) {
    return this.http.post(baseUrl, data);
  }

  update(id, data) {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id) {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll() {
    return this.http.delete(baseUrl);
  }

  findByName(name) {
    return this.http.get(`${baseUrl}?name=${name}`);
  }
}