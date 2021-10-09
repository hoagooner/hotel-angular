import { Booking } from "./booking.model";
import { Room } from "./room.model";

export class BookingDetail{
    id: number;
    price:number;
    room:Room;
    booking:Booking;
    checkin:Date;
    checkout:Date;
    fullName:string;
    phone:string;
    identityCard:string;
    deleteFlag:boolean;
}
