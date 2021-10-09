import {
    debounceTime,
    map,
    distinctUntilChanged,
    filter,
} from "rxjs/operators";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PagingArgs } from "src/app/components/common/pagination/pagination.component";
import { HttpStatusCode } from "src/app/utils/http-status-code";
import { Facility } from "src/app/models/facility.model";
import { ValidationMessage } from "src/app/validators/validation-message";
import { AnimationUtils } from "src/app/utils/animation.utils";
declare var $: any;
import { ToastService } from "src/app/services/toast/toast.service";
import { CalculateTableIndex } from "src/app/utils/calculate-table-index";
import { fromEvent, Subject } from "rxjs";
import { RoomService } from "src/app/services/room/room.service";
import { Room } from "src/app/models/room.model";
import { RoomType } from "src/app/models/room-type.model";
import { RoomTypeService } from "src/app/services/room-type/room-type.service";
import { Floor, floors } from "src/app/models/floor.model";
@Component({
    selector: "app-room",
    templateUrl: "./room.component.html",
    styleUrls: ["./room.component.css"],
})
export class RoomComponent implements OnInit {
    rooms: Room[];
    action: string;
    selectedFacility = new Facility();

    modalTitle: string;
    modalBody: string;
    submit: string; // action name in modal
    deleteError = false; // flag delete error
    isSubmitted = false;

    totalPages: number;
    totalElements: number;
    query: string;
    pageSize: number;
    // default paging, search, sort
    pagingArgs: PagingArgs = {
        query: "",
        pageNumber: 1,
        pageSize: 5,
        sortBy: "id",
        sortDirection: "desc",
    };
    roomTypes: RoomType[];
    floors = floors;
    selectedFloor: Floor;

    fileName: string;
    oldName: number;
    roomTypeId: number;
    constructor(
        private roomService: RoomService,
        public validationMessage: ValidationMessage,
        public calculateTableIndex: CalculateTableIndex,
        private toast: ToastService,
        private roomTypeService: RoomTypeService
    ) {}

    ngOnInit() {
        this.loadRooms(this.pagingArgs);
        AnimationUtils.checkCloseModal();
        AnimationUtils.checkReloadPage();
        this.onChangeSearch();
        this.checkRoomExists();
        this.loadRoomTypes();
    }

    form = new FormGroup({
        room: new FormGroup({
            id: new FormControl(""),
            floor: new FormControl("", [Validators.required]),
            roomType: new FormControl("", [Validators.required]),
            roomNumber: new FormControl("", [Validators.required]),
        }),
    });

    get id() {
        if (this.form) {
            return this.form.get("room.id");
        }
        return 0;
    }

    get floor() {
        return this.form.get("room.floor");
    }

    get roomType() {
        return this.form.get("room.roomType");
    }

    get roomNumber() {
        return this.form.get("room.roomNumber");
    }

    get room() {
        return this.form.get("room");
    }
    // load rooms and paging
    loadRooms(eventArgs?) {
        this.pagingArgs = eventArgs;
        this.roomService.getAll(eventArgs).subscribe(
            (response) => {
                if (response) {
                    this.rooms = response.content;
                    this.totalElements = response.totalElements;
                    this.totalPages = response.totalPages;
                } else {
                    this.rooms = [];
                    this.totalElements = 0;
                    this.totalPages = 0;
                }
            },
            (error: Response) => {
                console.log(error);
            }
        );
        // close after refresh
        AnimationUtils.closeModalAfterSubmit();
    }

    changeRoomType($event) {
        console.log(this.roomType.value);
    }

    // update facility
    updateRoom() {
        this.roomService.update(this.room.value.id, this.room.value).subscribe(
            (response) => {
                this.loadRooms(this.pagingArgs);
                this.toast.showSuccess("Room updated successfully !", "");
                AnimationUtils.closeModalAfterSubmit();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    loadRoomTypes() {
        this.roomTypeService.getList().subscribe((response) => {
            this.roomTypes = response;
        });
    }

    // create facility
    createRoom() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            AnimationUtils.focusFirstInputModalWhenEror();
            return;
        }
        this.roomService.create(this.room.value).subscribe(
            (response) => {
                this.loadRooms(this.pagingArgs);
                this.toast.showSuccess("Room created successfully !", "");
                AnimationUtils.closeModalAfterSubmit();
            },
            (error) => console.log(error)
        );
    }

    checkRoomNumber(roomNumber) {
        let floor = floors.find((floor) => floor.floor == this.floor.value);
        this.selectedFloor = floor;
        if (roomNumber) {
            if (roomNumber < floor.firstRoom || roomNumber > floor.lastRoom) {
                this.roomNumber.setErrors({
                    invalidRoom: true,
                });
            } else {
                if (this.roomNumber.hasError("invalidRoom")) {
                    delete this.roomNumber.errors["invalidRoom"];
                    this.roomNumber.updateValueAndValidity();
                }
            }
            console.log(this.roomNumber);
        }
    }

    changeFloor() {
        console.log();
        this.checkRoomNumber(this.roomNumber.value);
    }

    // action click delete button
    clickDelete(room) {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure you want to delete this record, This process cannot be undone !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        }).then((result) => {
            if (result.isConfirmed) {
               this.deleteRoom(room);
            }
        });
    }

    // action click add button
    clickAdd() {
        this.form.reset();
        this.isSubmitted = false;
        AnimationUtils.focusFirstInputOnShowModal();
        $("#is-submitted").val("0");
    }

    // action click edit button
    clickEdit(room: Room) {
        this.oldName = room.roomNumber;
        // check facility exists or not
        this.roomService.get(room.id).subscribe(
            (response) => {
                let room = response as Room;
                $(".roomFormModal").modal("show");
                AnimationUtils.focusFirstInputOnShowModal();
                $("#is-submitted").val("0");
                this.form.reset();
                this.form.get("room").setValue({
                    id: room.id,
                    roomNumber: room.roomNumber,
                    floor: room.floor,
                    roomType: room.roomType,
                });
                this.roomTypeId = room.roomType.id;
            },
            (error) => {
                $("#facilityModal").modal("hide");
                $("#confirmModal").modal("show");
                this.editModalAfterDeleteError("update");
            }
        );
    }

    // delete factility
    deleteRoom(room) {
        this.roomService.delete(room.id).subscribe(
            (response) => {
                this.loadRooms(this.pagingArgs); // load rooms
                this.toast.showSuccess("Facility deleted successfully !", "");
                AnimationUtils.closeModalAfterSubmit();
            },
            (error) => {
                if (
                    (error as HttpErrorResponse).status ==
                    HttpStatusCode.Conflict
                ) {
                    $(".modal").modal("hide");
                    Swal.fire(
                        "Oops...",
                        error.error.replace(/\[|\]/g, ""),
                        "error"
                    );
                } else {
                    this.editModalAfterDeleteError("delete");
                }
            }
        );
    }

    // search rooms
    onChangeSearch() {
        fromEvent($("#searchInp"), "keyup")
            .pipe(
                map((event: any) => {
                    return event.target.value;
                }),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe(
                (text: string) => {
                    this.pagingArgs.query = text;
                    this.loadRooms(this.pagingArgs);
                },
                (err) => {
                    console.log("error", err);
                }
            );
    }

    //  edit modal after delete error
    editModalAfterDeleteError(action: string) {
        this.deleteError = true;
        this.submit = "Refresh";
        this.modalTitle = "Oops!";
        this.modalBody = `Can't ${action} this item. It might have been deleted. Please refresh your page !`;
    }

    //close confirm modal
    closeConfirmModal() {
        $("#confirmModal").modal("hide");
    }

    // check name exists in db
    checkRoomExists() {
        fromEvent($("#roomNumber"), "keyup")
            .pipe(
                // get value
                map((event: any) => {
                    return event.target.value;
                }),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe(
                (text: number) => {
                    this.roomService.findByName(text).subscribe(
                        (response) => {
                            if (text != this.oldName) {
                                this.form
                                    .get("room.roomNumber")
                                    .setErrors({ shouldBeUnique: true });
                            }
                        },
                        (error) => {
                            console.log("error");
                        }
                    );
                },
                (err) => {
                    console.log("error", err);
                }
            );
    }

    //sort rooms
    sortRooms(prop) {
        if (this.pagingArgs.sortBy == prop) {
            if (this.pagingArgs.sortDirection == "desc") {
                this.pagingArgs.sortDirection = "asc";
            } else {
                this.pagingArgs.sortDirection = "desc";
            }
        }
        this.pagingArgs.sortBy = prop;
        this.loadRooms(this.pagingArgs);
    }
}
