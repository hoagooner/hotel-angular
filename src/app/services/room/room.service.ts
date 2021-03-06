import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class RoomService {
    constructor(private http: HttpClient) {}

    getAll(data?): Observable<any> {
        return this.http.get(`${environment.SERVER_URL}/api/rooms`, {
            params: {
                query: data.query,
                pageSize: data.pageSize,
                pageNumber: data.pageNumber,
                sortBy: data.sortBy,
                sortDirection: data.sortDirection,
            },
        });
    }

    getList(): Observable<any> {
        return this.http.get(`${environment.SERVER_URL}/api/rooms/list`);
    }

    get(id) {
        return this.http.get(`${environment.SERVER_URL}/api/rooms/${id}`);
    }

    create(data) {
        return this.http.post(`${environment.SERVER_URL}/api/rooms`, data);
    }

    update(id, data) {
        return this.http.put(
            `${environment.SERVER_URL}/api/rooms/${id}`,
            data
        );
    }

    delete(id) {
        return this.http.delete(
            `${environment.SERVER_URL}/api/rooms/${id}`
        );
    }

    deleteAll() {
        return this.http.delete(`${environment.SERVER_URL}/api/rooms`);
    }

    findByName(name) {
        return this.http.get(
            `${environment.SERVER_URL}/api/rooms/search?name=${name}`
        );
    }
}
