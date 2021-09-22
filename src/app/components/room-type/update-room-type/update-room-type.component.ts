import { HttpResponseBase } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Facility } from "src/app/models/Facility";
import { RoomType } from "src/app/models/RoomType";
import { FacilityService } from "src/app/services/facility.service";
import { RoomTypeService } from "src/app/services/room-type.service";
import { environment } from "src/environments/environment";
declare var $: any;

@Component({
    selector: "app-update-room-type",
    templateUrl: "./update-room-type.component.html",
    styleUrls: ["./update-room-type.component.css"],
})
export class UpdateRoomTypeComponent implements OnInit {
    toastMessage: string;
    toastStatus: string;
    facilities: Facility[];
    facilitiesOfRoomType: any[];
    url: string;

    constructor(
        private roomTypeService: RoomTypeService,
        private facilityService: FacilityService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.url = environment.SERVER_URL;
        let id = this.route.snapshot.params["id"];
        this.roomTypeService.get(id).subscribe((response) => {
            let roomType = response as RoomType;
            this.form.get("roomType").setValue({
                id: roomType.id,
                name: roomType.name,
                price: roomType.prices[0].price,
                size: roomType.size,
                numberOfAdults: roomType.numberOfAdults,
                numberOfChilds: roomType.numberOfChilds,
                numberOfBeds: roomType.numberOfBeds,
                description: roomType.description,
            });
            this.facilitiesOfRoomType = roomType.facilities;
            this.loadFacilities();
        });
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
            id: new FormControl(""),
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

    updateRoomType() {
        console.log(this.roomType);
        this.roomType.prices = [
            {
                price: this.roomType.price,
                modifiedDate: new Date(),
            },
        ];
        // selected facility list
        this.roomType.facilities = this.createSelectedFacilities();

        this.roomTypeService.update(this.roomType.id,this.roomType).subscribe(
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
                update: status,
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

    checkFacility(item): boolean {
        return this.facilitiesOfRoomType.some((x) => {
            return x.id == item.id;
        });
    }

    // edit toast after action success
    editToastAfterActionSuccess(status: string, message: string) {
        $("#confirmModal").modal("hide");
        this.toastStatus = status;
        this.toastMessage = message;
        $(".toast").toast("show");
    }
}
