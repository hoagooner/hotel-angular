import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class ReservationService {
    constructor(private http: HttpClient) {}

    searchBookedRoom(data) {
        return this.http.get(`${environment.SERVER_URL}/api/bookings/search`, {
            params: {
                checkin: data.checkin,
                checkout: data.checkout,
            },
        });
    }

    create(data) {
        return this.http.post(`${environment.SERVER_URL}/api/bookings`, data);
    }
}
