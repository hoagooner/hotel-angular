import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, Injector, OnInit } from "@angular/core";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { PagingArgs } from "src/app/components/common/pagination/pagination.component";
import { HttpStatusCode } from "src/app/utils/HttpStatusCode";
import { Facility } from "src/app/models/Facility";
import { ResponseModel } from "src/app/models/ResponseModel";
import { FacilityService } from "src/app/services/facility.service";
import { ValidationMessage } from "src/app/utils/ValidationMessage";
import { FacilityValidators } from "./facility.validators";
declare var $: any;

@Component({
    selector: "app-facility",
    templateUrl: "./facility.component.html",
    styleUrls: ["./facility.component.css"],
})
export class FacilityListComponent implements OnInit {
    facilities: Facility[];
    action: string;
    selectedFacility = new Facility();
    toastMessage: string;
    toastStatus: string;
    modalTitle: string;
    modalBody: string;
    submit: string;
    actionEvent: any;
    deleteError = false;
    totalPages: number;
    totalElements: number;
    query: string;
    pageSize: number;
    // default value
    pagingArgs: PagingArgs = {
        query: "",
        pageNumber: 1,
        pageSize: 5,
        sortBy:"id",
        sortDirection:"desc"
    };
    // sort
    sort = {
        id: true, // true false -> descending, ascending
        name:false,
    }

    fileName: string;
    constructor(
        private facilityService: FacilityService,
        public validationMessage: ValidationMessage,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadFacilitites(this.pagingArgs);
        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip()
        })
    }

    form = new FormGroup({
        facility: new FormGroup({
            id: new FormControl(""),
            name: new FormControl(
                "",
                [Validators.required, Validators.maxLength(50)]
                // FacilityValidators.shouldBeUnique(this.facilityService,this.id)
            ),
            description: new FormControl("", [
                Validators.maxLength(255),
            ]),
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
        if (  this.form.get("facility.name").errors &&
        this.form.get("facility.name").errors.maxlength ) {
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
        this.closeConfirmModal();
    }

    // update facility
    updateFacility() {
        if (this.fileName) {
            this.facility.icon = this.fileName;
        }
        this.facilityService.update(this.facility.id, this.facility).subscribe(
            (response) => {
                console.log(response);
                // let index = this.facilities.findIndex(e => e.id == this.facility.id);
                // this.facilities.splice(index, 1, this.facility)
                this.loadFacilitites(this.pagingArgs);
                this.editToastAfterActionSuccess(
                    "Success",
                    "Facility updated successfully !"
                );
            },
            (error) => {
                console.log(error);
            }
        );
    }

    // create facility
    createFacility() {
        if (this.fileName) {
            this.facility.icon = this.fileName;
        }
        this.fileName = undefined;
        this.facilityService.create(this.facility).subscribe(
            (response) => {
                this.pagingArgs= {
                    query: "",
                    pageNumber: 1,
                    pageSize: 5,
                    sortBy:"id",
                    sortDirection:"desc"
                };
                this.loadFacilitites(this.pagingArgs);
                this.editToastAfterActionSuccess(
                    "Success",
                    "Facility created successfully !"
                );
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
        this.action = "Add";
        this.form.reset();
        this.focusFirstInput();
        $("input[type='file']").val("");
    }

    // action click edit button
    clickEdit(facility: Facility) {
        // check facility exists or not
        this.facilityService.get(facility.id).subscribe(
            (response) => {
                $("#facilityModal").modal("show");
                this.focusFirstInput();
                this.action = "Edit";
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
                this.pagingArgs= {
                    query: "",
                    pageNumber: 1,
                    pageSize: 5,
                    sortBy: "id",
                    sortDirection:"desc"
                };
                this.loadFacilitites(this.pagingArgs); // load facilities
                this.editToastAfterActionSuccess(
                    "Success",
                    "Facility deleted successfully !"
                );
            },
            (error) => {
                if (
                    (error as HttpErrorResponse).status ==
                    HttpStatusCode.NotAcceptable
                ) {
                    console.log("conflicted");
                } else {
                    this.editModalAfterDeleteError("delete");
                }
            }
        );
    }

    // search facilities
    onChangeSearch(query) {
        console.log("event");
        this.query = query;
        // refer first page after search
        this.pagingArgs.pageNumber = 1;
        this.pagingArgs.query = this.query;
        this.loadFacilitites(this.pagingArgs);
    }

    //  edit modal after delete error
    editModalAfterDeleteError(action: string) {
        this.deleteError = true;
        this.submit = "Refresh";
        this.modalTitle = "Oops!";
        this.modalBody = `Can't ${action} this item. It might have been deleted. Please refresh your page !`;
    }

    // edit toast after action success
    editToastAfterActionSuccess(status: string, message: string) {
        $("#facilityModal").modal("hide");
        $("#confirmModal").modal("hide");
        this.toastStatus = status;
        this.toastMessage = message;
        $(".toast").toast("show");
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
    checkNameExists($event) {

        this.facilityService.findByName($event.target.value).subscribe(
            (response) => {
                if (
                    this.form.get("facility.id").value !=
                    (response as Facility).id
                ) {
                    this.form
                        .get("facility.name")
                        .setErrors({ shouldBeUnique: true });
                }
            },
            (error) => {
                console.log("error");
            }
        );
    }

    //sort facilities
    sortFacilities(prop){
        if(this.pagingArgs.sortBy == prop){
            if(this.pagingArgs.sortDirection == "desc"){
                this.pagingArgs.sortDirection = "asc"
            }else{
                this.pagingArgs.sortDirection = "desc"
            }
        }
        this.pagingArgs.sortBy = prop;
        this.loadFacilitites(this.pagingArgs)
    }

}
