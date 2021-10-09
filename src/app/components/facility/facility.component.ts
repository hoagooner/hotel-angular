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
import { FacilityService } from "src/app/services/facility/facility.service";
import { ValidationMessage } from "src/app/validators/validation-message";
import { AnimationUtils } from "src/app/utils/animation.utils";
declare var $: any;
import { ToastService } from "src/app/services/toast/toast.service";
import { CalculateTableIndex } from "src/app/utils/calculate-table-index";
import { fromEvent, Subject } from "rxjs";

@Component({
    selector: "app-facility",
    templateUrl: "./facility.component.html",
    styleUrls: ["./facility.component.css"],
})
export class FacilityListComponent implements OnInit {
    facilities: Facility[];
    action: string;
    selectedFacility = new Facility();

    modalTitle: string;
    modalBody: string;
    submit: string; // action name in modal
    deleteError = false; // flag delete error

    totalPages: number;
    totalElements: number;
    query: string;
    pageSize: number;

    oldName : string;
    // default paging, search, sort
    pagingArgs: PagingArgs = {
        query: "",
        pageNumber: 1,
        pageSize: 5,
        sortBy: "id",
        sortDirection: "desc",
    };
    isSubmitted : boolean;

    fileName: string;
    constructor(
        private facilityService: FacilityService,
        public validationMessage: ValidationMessage,
        public calculateTableIndex: CalculateTableIndex,
        private toast: ToastService
    ) {}

    ngOnInit() {
        this.loadFacilitites(this.pagingArgs);
        AnimationUtils.checkCloseModal();
        AnimationUtils.checkReloadPage();
        this.onChangeSearch();
        this.checkNameExists();
    }

    form = new FormGroup({
        facility: new FormGroup({
            id: new FormControl(""),
            name: new FormControl(
                "",
                [Validators.required, Validators.maxLength(50)]
            ),
            description: new FormControl("", [Validators.maxLength(255)]),
            icon: new FormControl(""),
        }),
    });

    get id() {
        if (this.form) {
            return this.form.get("facility.id");
        }
        return 0;
    }

    get name() {
        if (
            this.form.get("facility.name").errors &&
            this.form.get("facility.name").errors.maxlength
        ) {
            console.log(Object.keys(this.form.get("facility.name").errors));
        }
        return this.form.get("facility.name");
    }

    get icon() {
        return this.form.get("facility.icon");
    }

    get description() {
        return this.form.get("facility.description");
    }

    get facility() {
        return this.form.get("facility").value;
    }
    // load facilities and paging
    loadFacilitites(eventArgs?) {
        this.pagingArgs = eventArgs;
        this.facilityService.getAll(eventArgs).subscribe(
            (response) => {
                if (response) {
                    this.facilities = response.content;
                    this.totalElements = response.totalElements;
                    this.totalPages = response.totalPages;
                } else {
                    this.facilities = [];
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

    // update facility
    updateFacility() {
        if (this.fileName) {
            this.facility.icon = this.fileName;
        }
        this.facilityService.update(this.facility.id, this.facility).subscribe(
            (response) => {
                this.loadFacilitites(this.pagingArgs);
                this.toast.showSuccess("Facility updated successfully !", "");
                AnimationUtils.closeModalAfterSubmit();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    // create facility
    createFacility() {
        this.isSubmitted = true;
        if(this.form.invalid){
            AnimationUtils.focusFirstInputModalWhenEror();
            return;
        }
        if (this.fileName) {
            this.facility.icon = this.fileName;
        }
        this.fileName = undefined;
        this.facilityService.create(this.facility).subscribe(
            (response) => {
                this.loadFacilitites(this.pagingArgs);
                this.toast.showSuccess("Facility created successfully !", "");
                AnimationUtils.closeModalAfterSubmit();
            },
            (error) => console.log(error)
        );
    }

    // action click delete button
    clickDelete(facility) {
        this.selectedFacility = facility;
        this.modalTitle = "Confirm delete";
        this.submit = "Delete";
        this.modalBody =
            "Are you sure you want to delete this record, This process cannot be undone";
        this.deleteError = false;
    }

    // action click add button
    clickAdd() {
        this.form.reset();
        $("input[type='file']").val("");
        AnimationUtils.focusFirstInputOnShowModal()
        $("#is-submitted").val("0");
    }

    // action click edit button
    clickEdit(facility: Facility) {
        this.oldName = facility.name
        // check facility exists or not
        this.facilityService.get(facility.id).subscribe(
            (response) => {
                $("input[type='file']").val("");
                $("#facilityModal").modal("show");
                this.focusFirstInput();
                $("#is-submitted").val("0");
                this.form.reset();
                this.form.get("facility").setValue({
                    id: facility.id,
                    name: facility.name,
                    description: facility.description,
                    icon: facility.icon,
                });
            },
            (error) => {
                $("#facilityModal").modal("hide");
                $("#confirmModal").modal("show");
                this.editModalAfterDeleteError("update");
            }
        );
    }

    // delete factility
    deleteFacility(facility) {
        this.facilityService.delete(facility.id).subscribe(
            (response) => {
                this.loadFacilitites(this.pagingArgs); // load facilities
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

    // search facilities
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
                    this.pagingArgs.query =text;
                    this.loadFacilitites(this.pagingArgs);
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

    // focus fisrt input when open modal
    focusFirstInput() {
        $("#facilityModal").on("shown.bs.modal", function () {
            $("#name").focus();
        });
    }

    //close confirm modal
    closeConfirmModal() {
        $("#confirmModal").modal("hide");
    }

    // check name exists in db
    checkNameExists() {
        fromEvent($("#name"), "keyup")
            .pipe(
                // get value
                map((event: any) => {
                    return event.target.value;
                }),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe(
                (text: string) => {
                    this.facilityService.findByName(text).subscribe(
                        (response) => {
                            if ( this.oldName != this.name.value) {
                                this.form
                                    .get("facility.name")
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

    //sort facilities
    sortFacilities(prop) {
        if (this.pagingArgs.sortBy == prop) {
            if (this.pagingArgs.sortDirection == "desc") {
                this.pagingArgs.sortDirection = "asc";
            } else {
                this.pagingArgs.sortDirection = "desc";
            }
        }
        this.pagingArgs.sortBy = prop;
        this.loadFacilitites(this.pagingArgs);
    }
}
