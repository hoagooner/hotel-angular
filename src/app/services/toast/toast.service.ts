import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class ToastService {
    constructor(private toastr: ToastrService) {}

    showSuccess(message, title, time?) {
        this.toastr.success(message, title, {
            timeOut: time ? time : 2000,
        });
    }

    showError(message, title, time?) {
        this.toastr.error(message, title, {
            timeOut: time ? time : 2000,
        });
    }
}
