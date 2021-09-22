import { Injectable } from "@angular/core";

@Injectable()
export class ValidationMessage {
    getErrorMessage(propery: string, validation: any): string {
        let message: string;
        switch (Object.keys(validation)[0]) {
            case "required":
                message = `${propery} is required`;
                break;
            case "email":
                message = `invalid format email`;
            case "phone":
                message = `invalid format phone`;
                break;
            case "minlength":
                message = `${propery} must be at least ${validation.minlength.requiredLength} characters`;
                break;
            case "maxlength":
                console.log(validation);
                message = `${propery} must be less than ${validation.maxlength.requiredLength} characters`;
                break;
            case "shouldBeUnique":
                message = `This ${propery} already exists`;
                break;
            default:
                message = "invalid input";
        }
        return message.toLowerCase().charAt(0).toUpperCase()+message.slice(1).toLowerCase();
    }
}
