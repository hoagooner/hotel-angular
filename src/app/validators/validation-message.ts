import { Injectable } from "@angular/core";

@Injectable()
export class ValidationMessage {
    getErrorMessage(propery: string, validation: any): string {
        let message: string;
        if (Object.keys(validation).length > 0) {
            switch (Object.keys(validation)[0]) {
                case "required":
                    message = `${propery} is required`;
                    break;
                case "email":
                    message = `invalid format email`;
                case "phone":
                    message = `invalid format phone`;
                    break;
                case "min":
                    message = `${propery} must be greater than ${validation.min.min}`;
                    break;
                case "max":
                    console.log(validation);
                    message = `${propery} must be less than ${validation.max.max} `;
                    break;
                case "minlength":
                    message = `${propery} must be at least ${validation.minlength.requiredLength} characters`;
                    break;
                case "maxlength":
                    console.log(validation);
                    message = `${propery} must be less than ${validation.maxlength.requiredLength} characters`;
                    break;
                case "invalidRoom":
                    break;
                case "shouldBePositiveInteger":
                    console.log(validation);
                    message = `${propery} must be a positive integer number`;
                    break;
                case "shouldBeUnique":
                    message = `This ${propery} already exists`;
                    break;
                case "invalidCheckin":
                    message = `Check in date must be less than check out date`;
                    break;
                case "invalidCheckout":
                    message = `Check out date must be greater than check in date`;
                    break;
                default:
                    message = "invalid input";
            }
        }
        return message
            ? message.toLowerCase().charAt(0).toUpperCase() +
                  message.slice(1).toLowerCase()
            : "";
    }
}
