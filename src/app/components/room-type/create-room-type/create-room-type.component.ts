import { Component, OnInit } from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Facility } from "src/app/models/Facility";
import { FacilityService } from "src/app/services/facility.service";
import { RoomTypeService } from "src/app/services/room-type.service";
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

    constructor(
        private roomTypeService: RoomTypeService,
        private facilityService: FacilityService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit() {
        this.url = environment.SERVER_URL;
        this.loadFacilities();
    }

    loadFacilities(){
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
            price: new FormControl("", [Validators.required]),
            size: new FormControl("", [Validators.required]),
            numberOfAdults: new FormControl("", [Validators.required]),
            numberOfChilds: new FormControl("", [Validators.required]),
            numberOfBeds: new FormControl("", [Validators.required]),
            description: new FormControl("", [
                Validators.maxLength(255),
            ]),
        }),
    });

    get roomType() {
        return this.form.get("roomType").value;
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
        console.log(this.roomType);
        this.roomType.prices = [
            {
                modifiedDate: new Date(),
                price: this.roomType.price,
            },
        ];
        // selected facility list
        this.roomType.facilities = this.createSelectedFacilities();

        this.roomTypeService.create(this.roomType).subscribe(
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
        this.editToastAfterActionSuccess("Success","Facilities successfully updated")
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
