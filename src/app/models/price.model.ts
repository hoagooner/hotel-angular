import { RoomType } from "./room-type.model";

export interface Price{
    id:number;
    price:number;
    modifiedDate: Date;
    roomType: RoomType;
    deleteFlag:boolean;
}
