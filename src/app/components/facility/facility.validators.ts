import { Injectable, Injector, ReflectiveInjector } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { FacilityService } from "src/app/services/facility/facility.service";
import { resolve } from "url";
import { map } from "rxjs/operators";
import { Facility } from "src/app/models/Facility";

@Injectable()
export class FacilityValidators {

    constructor(private facilityService:FacilityService) {}

     cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        return { cannotContainSpace: true };
    }

    static shouldBeUnique(facilityService: FacilityService, id: number): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
          return facilityService.findByName(control.value).pipe(map(
            (facility: object) => {
                if ( id != (facility as Facility).id ) {
                    return ({ shouldBeUnique: true });
                }
                return null
            }
          ));
        };
    }

}
