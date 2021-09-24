import { Component, OnInit } from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { max } from "rxjs/operators";
import { Facility } from "src/app/models/Facility";
import { FacilityService } from "src/app/services/facility/facility.service";
import { RoomTypeService } from "src/app/services/room-type/room-type.service";
import { CommomUtils } from "src/app/utils/CommonUtils";
import { CommonValidator } from "src/app/validators/CommonValidator";
import { ValidationMessage } from "src/app/validators/ValidationMessage";
import { environment } from "src/environments/environment";
declare var $: any;

@Component({
    selector: "app-create-room-type",
    templateUrl: "./create-room-type.component.html",
    styleUrls: ["./create-room-type.component.css"],
})
export class CreateRoomTypeComponent implements OnInit {
    toastMessage: string;
    toastStatus: string;
    facilities: Facility[];
    url: string;
    isSubmitted: false;

    constructor(
        private roomTypeService: RoomTypeService,
        private facilityService: FacilityService,
        public validationMessage: ValidationMessage,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit() {
        this.url = environment.SERVER_URL;
        this.loadFacilities();
        CommomUtils.tabLoop();
        CommomUtils.focusFirstInput();
        CommomUtils.checkReloadPage();
        this.isSubmitted= false;
    }

    loadFacilities() {
        this.facilityService.getList().subscribe(
            (response) => {
                this.facilities = response;
            },
            (error) => console.log(error)
        );
    }
    form = new FormGroup({
        roomType: new FormGroup({
            name: new FormControl("", [
                Validators.required,
                Validators.maxLength(50),
            ]),
            price: new FormControl("", [
                Validators.required,
                Validators.min(0),
                Validators.max(1000000000),
            ]),
            size: new FormControl("", [
                Validators.required,
                Validators.max(100),
            ]),
            numberOfAdults: new FormControl("", [
                Validators.required,
                Validators.max(20),
                CommonValidator.shouldBePositiveInteger,
            ]),
            numberOfChilds: new FormControl("", [
                Validators.required,
                Validators.max(20),
                CommonValidator.shouldBePositiveInteger,
            ]),
            numberOfBeds: new FormControl("", [
                Validators.required,
                Validators.max(20),
                CommonValidator.shouldBePositiveInteger,
            ]),
            description: new FormControl("", [Validators.maxLength(255)]),
        }),
    });

    get roomType() {
        return this.form.get("roomType");
    }

    get name() {
        return this.form.get("roomType.name");
    }

    get price() {
        return this.form.get("roomType.price");
    }
    get size() {
        return this.form.get("roomType.size");
    }
    get numberOfAdults() {
        return this.form.get("roomType.numberOfAdults");
    }
    get numberOfChilds() {
        return this.form.get("roomType.numberOfChilds");
    }
    get numberOfBeds() {
        return this.form.get("roomType.numberOfBeds");
    }
    get description() {
        return this.form.get("roomType.description");
    }

    createRoomType() {
        if(this.form.invalid){
            CommomUtils.focusFirstInput();
            return;
        }
        this.roomType.value.prices = [
            {
                modifiedDate: new Date(),
                price: this.roomType.value.price,
            },
        ];
        // selected facility list
        this.roomType.value.facilities = this.createSelectedFacilities();

        this.roomTypeService.create(this.roomType.value).subscribe(
            (response) => {
                console.log(response);
                //redirect to room type list after add success
                this.redirectRoomTypeList("success");
            },
            (error) => console.log(error)
        );
    }

    redirectRoomTypeList(status?) {
        let queryParams;
        if (status) {
            queryParams = {
                create: status,
            };
        }
        this.router.navigate(["room-types"], { queryParams });
    }

    createSelectedFacilities() {
        let facilities: any[] = [];
        $(".facilities input:checked").each(function () {
            facilities.push({
                id: $(this).val(),
            });
        });
        this.editToastAfterActionSuccess(
            "Success",
            "Facilities successfully updated"
        );
        return facilities;
    }

    // edit toast after action success
    editToastAfterActionSuccess(status: string, message: string) {
        $("#confirmModal").modal("hide");
        this.toastStatus = status;
        this.toastMessage = message;
        $(".toast").toast("show");
    }
}
