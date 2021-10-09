import { BookingDetail } from "./booking-detail.model";
import { User } from "./user.model";

export class Booking{
    id: number;
    reservationCode:string;
    bookingDate:Date;
    fullName: string;
    email:string;
    phone:string;
    status:string;
    bookingType:string;
    totalPrice:string;
    bookingDetails:BookingDetail[];
    customer: User;
    reservationStaff: User;
    deleteFlag: boolean;
}
