import { Component, OnInit } from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, map, max } from "rxjs/operators";
import { Facility } from "src/app/models/facility.model";
import { FacilityService } from "src/app/services/facility/facility.service";
import { RoomTypeService } from "src/app/services/room-type/room-type.service";
import { ToastService } from "src/app/services/toast/toast.service";
import { AnimationUtils } from "src/app/utils/animation.utils";
import { CommonValidator } from "src/app/validators/common.validator";
import { ValidationMessage } from "src/app/validators/validation-message";
import { environment } from "src/environments/environment";
declare var $: any;

@Component({
    selector: "app-create-room-type",
    templateUrl: "./create-room-type.component.html",
    styleUrls: ["./create-room-type.component.css"],
})
export class CreateRoomTypeComponent implements OnInit {

    selectedFacilities = [];
    toastMessage: string;
    toastStatus: string;
    facilities: Facility[];
    url: string;
    isSubmitted: false;
    selectedFiles: FileList;
    currentFile: File;

    constructor(
        private roomTypeService: RoomTypeService,
        private facilityService: FacilityService,
        public validationMessage: ValidationMessage,
        private toast: ToastService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit() {
        this.url = environment.SERVER_URL;
        this.loadFacilities();
        AnimationUtils.tabLoop();
        AnimationUtils.focusFirstInput();
        AnimationUtils.checkReloadPage();
        this.checkNameExists();
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
                Validators.max(200),
            ]),
            numberOfAdults: new FormControl("", [
                Validators.required,
                Validators.max(50),
                CommonValidator.shouldBePositiveInteger,
            ]),
            numberOfChilds: new FormControl("", [
                Validators.required,
                Validators.max(50),
                CommonValidator.shouldBePositiveInteger,
            ]),
            numberOfBeds: new FormControl("", [
                Validators.required,
                Validators.max(20),
                CommonValidator.shouldBePositiveInteger,
            ]),
            description: new FormControl("", [Validators.maxLength(1000)]),
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
            AnimationUtils.focusFirstInput();
            return;
        }
        // image
        if( this.selectedFiles){
            this.currentFile = this.selectedFiles.item(0);
        }
        // selected facility list
        this.roomType.value.facilities = this.selectedFacilities;
        console.log(this.roomType.value);
        this.roomTypeService.create(this.roomType.value, this.currentFile).subscribe(
            (response) => {
                console.log(response);
                //redirect to room type list after add success
                this.toast.showSuccess("Room type created success !","");
                this.redirectRoomTypeList()
            },
            (error) => console.log(error)
        );
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
      }

    createSelectedFacilities() {
        let facilities = [];
        $("input:checked").each(function () {
            facilities.push({
                id: $(this).val(),
            });
        });
        this.selectedFacilities = facilities;
        this.toast.showSuccess("Facilities successfully updated","");
    }

    redirectRoomTypeList(){
        this.router.navigate(["room-types"]);
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
                                this.form
                                    .get("roomType.name")
                                    .setErrors({ shouldBeUnique: true });
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


}
