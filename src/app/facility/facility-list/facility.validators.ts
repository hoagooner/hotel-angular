import { Injectable, Injector, ReflectiveInjector } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { FacilityService } from "src/app/services/facility.service";
import { resolve } from "url";

@Injectable()
export class FacilityValidators {

    constructor(private facilityService:FacilityService) {}

    

     cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        return { cannotContainSpace: true };
    }


}