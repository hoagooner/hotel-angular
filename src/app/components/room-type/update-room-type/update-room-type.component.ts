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
import { Facility } from "src/app/models/facility.model";
import { RoomType } from "src/app/models/room-type.model";
import { FacilityService } from "src/app/services/facility/facility.service";
import { RoomTypeService } from "src/app/services/room-type/room-type.service";
import { ToastService } from "src/app/services/toast/toast.service";
import { environment } from "src/environments/environment";
declare var $: any;

@Component({
    selector: "app-update-room-type",
    templateUrl: "./update-room-type.component.html",
    styleUrls: ["./update-room-type.component.css"],
})
export class UpdateRoomTypeComponent implements OnInit {

    facilities: Facility[];
    facilitiesOfRoomType: any[];
    url: string;

    constructor(
        private roomTypeService: RoomTypeService,
        private facilityService: FacilityService,
        private route: ActivatedRoute,
        private toast:ToastService,
        private router: Router
    ) {}

    ngOnInit() {
        this.url = environment.SERVER_URL;
        let id = this.route.snapshot.params["id"];
        this.roomTypeService.get(id).subscribe((response) => {
            console.log(response);
            let roomType = response as RoomType;
            this.form.get("roomType").setValue({
                id: roomType.id,
                name: roomType.name,
                price: roomType.price,
                size: roomType.size,
                numberOfAdults: roomType.numberOfAdults,
                numberOfChilds: roomType.numberOfChilds,
                numberOfBeds: roomType.numberOfBeds,
                description: roomType.description,
                image: roomType.image,
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
            image: new FormControl(""),
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
        // selected facility list
        this.roomType.facilities = this.facilitiesOfRoomType;
        console.log(this.facilitiesOfRoomType);
        this.roomTypeService.update(this.roomType.id,this.roomType).subscribe(
            (response) => {
                console.log(response);
                //redirect to room type list after add success
                this.toast.showSuccess("Room type updated success !","");
                this.redirectRoomTypeList()
            },
            (error) => console.log(error)
        );
    }


    createSelectedFacilities() {
        let facilities: any[] = [];
        $("input:checked").each(function () {
            facilities.push({
                id: $(this).val(),
            });
        });
        console.log(facilities);
        return facilities;
    }

    saveFacilities(){
        this.facilitiesOfRoomType = this.createSelectedFacilities();
        this.toast.showSuccess("Facilities updated success !","");
    }



    checkFacility(item): boolean {
        return this.facilitiesOfRoomType.some((x) => {
            return x.id == item.id;
        });
    }

    redirectRoomTypeList(){
        this.router.navigate(["room-types"]);
    }

}
