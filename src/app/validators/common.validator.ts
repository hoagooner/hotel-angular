import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CommonValidator{
    constructor() {}

    static shouldBePositiveInteger(control: AbstractControl): ValidationErrors | null {
        if(!/^[1-9]\d*$/g.test(control.value))
            return { shouldBePositiveInteger: true };
    }
}
