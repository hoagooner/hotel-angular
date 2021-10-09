declare var $: any;
import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Room } from "src/app/models/room.model";
import { ReservationService } from "src/app/services/reservation/reservation.service";
import { RoomService } from "src/app/services/room/room.service";
import { ToastService } from "src/app/services/toast/toast.service";
import { AnimationUtils } from "src/app/utils/animation.utils";
import { HttpStatusCode } from "src/app/utils/http-status-code";
import { ValidationMessage } from "src/app/validators/validation-message";
import Swal from "sweetalert2";

@Component({
    selector: "app-create-reservation",
    templateUrl: "./create-reservation.component.html",
    styleUrls: ["./create-reservation.component.css"],
})
export class CreateReservationComponent implements OnInit {
    bookedRoomIds = []; // list booked room id
    rooms: Room[]; // all rooms in hotel
    bookingDetails: any[] = [];
    searchForm;
    bookingForm: FormGroup;

    _checkin;
    _checkout;

    constructor(
        private reservationService: ReservationService,
        private roomService: RoomService,
        private toast: ToastService,
        private datePipe: DatePipe,
        public validationMessage: ValidationMessage,
        private fb: FormBuilder
    ) {
        let checkout = datePipe.transform(
            new Date().setDate(new Date().getDate() + 1),
            "yyyy-MM-dd"
        );
        this.searchForm = this.fb.group({
            checkin: [
                datePipe.transform(new Date(), "yyyy-MM-dd"),
                [Validators.required],
            ],
            checkout: [checkout, [Validators.required]],
        });

        // booking form
        this.bookingForm = this.fb.group({
            totalPrice: 1,
            bookingDate: new Date(),
            fullName: new FormControl("", Validators.required),
            phone: new FormControl("", Validators.required),
            identityCard: new FormControl("", Validators.required),
            bookingDetails: this.fb.array([]),
        });
    }

    nameOfBookingDetail(index) {
        return this.bookingDetailsInBooking.at(index)["controls"]["fullName"];
    }

    phoneOfBookingDetail(index) {
        return this.bookingDetailsInBooking.at(index)["controls"]["phone"];
    }

    identityCardOfBookingDetail(index) {
        return this.bookingDetailsInBooking.at(index)["controls"][
            "identityCard"
        ];
    }

    get bookingDetailsInBooking(): FormArray {
        return this.bookingForm.get("bookingDetails") as FormArray;
    }

    get checkin() {
        return this.searchForm.get("checkin");
    }

    get checkout() {
        return this.searchForm.get("checkout");
    }

    ngOnInit() {
        this.loadAllRooms();
        this.getBookedRoom();
    }

    getBookedRoom() {
        if (this.searchForm.valid) {
            this.reservationService
                .searchBookedRoom(this.searchForm.value)
                .subscribe((response) => {
                    this.bookedRoomIds = response as number[];
                    this._checkin = this.checkin.value;
                    this._checkout = this.checkout.value;
                });
        } else {
            console.log("error");
            AnimationUtils.focusFirstInput();
        }
    }

    loadAllRooms() {
        this.roomService.getList().subscribe((response) => {
            this.rooms = response;
        });
    }

    checkBookedRoom(id): boolean {
        return this.bookedRoomIds.some((x) => {
            return x == id;
        });
    }

    checkRoomInSelectedRooms(id) {
        return this.bookingDetails.some((bookingDetail) => {
            return (
                bookingDetail.room.id == id &&
                ((bookingDetail.checkin >= new Date(this._checkin).setHours(14,0,0) &&
                    bookingDetail.checkin <= new Date(this._checkout).setHours(12,0,0)) ||
                    (bookingDetail.checkout >= new Date(this._checkin).setHours(14,0,0) &&
                        bookingDetail.checkout <= new Date(this._checkout).setHours(12,0,0)))
            );
        });
    }

    changeCheckin($event) {
        if(new Date() > new Date(this.checkin.value)){
            this.checkin.setValue(this.datePipe.transform(new Date(), "yyyy-MM-dd"));
            this.toast.showError("", "Check in date must be greater than or equal today",3000 );
            return;
        }
        if (new Date(this.checkin.value) > new Date(this.checkout.value)) {
            (this.checkin as FormControl).setErrors({
                invalidCheckin: true,
            });
            this.toast.showError(
                this.validationMessage.getErrorMessage("", this.checkin.errors),
                "",
                3000
            );
            this.checkout.updateValueAndValidity();
        } else {
            this.checkin.updateValueAndValidity();
            this.checkout.updateValueAndValidity();
        }
    }

    changeCheckout($event) {
        if(new Date() > new Date(this.checkout.value)){
            this.checkout.setValue(this.datePipe.transform(new Date(), "yyyy-MM-dd"));
            this.toast.showError("", "Check out date must be greater than or equal today",3000 );
            return;
        }
        if (new Date(this.checkin.value) > new Date(this.checkout.value)) {
            (this.checkout as FormControl).setErrors({ invalidCheckout: true });
            this.toast.showError(
                this.validationMessage.getErrorMessage(
                    "",
                    this.checkout.errors
                ),
                "",
                3000
            );
            this.checkin.updateValueAndValidity();
        } else {
            this.checkin.updateValueAndValidity();
            this.checkout.updateValueAndValidity();
        }
    }

    selectRoom(room) {
        let element = document.getElementById(room.id);
        let index = this.bookingDetails.findIndex((booking) => {
            return booking.room.id == room.id;
        });
        if (index > -1) {
            this.bookingDetails.splice(index, 1);
            // element.className = "room";
            // element.classList.add("btn", "btn-success");
            this.toast.showSuccess(
                `Deselect room ${room.roomNumber} successfully`,
                ""
            );
        } else {
            //set time check in check out default
            let checkin = new Date(
                new Date(this.checkin.value).setHours(14, 0, 0)
            );
            let checkout = new Date(
                new Date(this.checkout.value).setHours(12, 0, 0)
            );
            let bookingDetail = {
                price: room.roomType.price,
                room: room,
                checkin: checkin,
                checkout: checkout,
            };
            this.bookingDetails.push(bookingDetail);
            this.toast.showSuccess(
                `Select room ${room.roomNumber} successfully`,
                ""
            );
        }
    }

    // set form array; total price
    booking() {
        console.log(this.bookingForm.get("fullName").value);
        while (this.bookingDetailsInBooking.length !== 0) {
            this.bookingDetailsInBooking.removeAt(0);
        }
        let totalPrice = 0;
        this.bookingDetails.forEach((item) => {
            totalPrice += item.price;
            item.fullName = new FormControl("", Validators.required);
            item.phone = new FormControl("", Validators.required);
            item.identityCard = new FormControl("", Validators.required);
            this.bookingDetailsInBooking.push(this.fb.group(item));
        });
        this.bookingForm.get("totalPrice").setValue(totalPrice);
    }

    createBooking() {
        console.log(this.bookingForm.value);
        this.reservationService.create(this.bookingForm.value).subscribe(
            (response) => {
                console.log(response);
                this.bookingDetailsInBooking.value.forEach((element) => {
                    this.bookedRoomIds.push(element.room.id);
                });
                this.bookingForm.reset();
                this.bookingDetails = [];
                this.toast.showSuccess("Booking success !", "");
                $("#bookingModal").modal("hide");
            },
            (error) => {
                if (
                    (error as HttpErrorResponse).status ==
                    HttpStatusCode.Conflict
                ) {
                    $(".modal").modal("hide");
                    Swal.fire({
                        title: "Oops...",
                        text: `${error.error}`,
                        icon: "error",
                        showCancelButton: true,
                        confirmButtonText: "Refresh page!",
                        cancelButtonText: "No, keep it",
                    }).then((result) => {
                        if (result.isConfirmed) {
                           this.getBookedRoom();
                           this.bookingDetails = []
                        }
                    });
                }
            }
        );
    }
}
