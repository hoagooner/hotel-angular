import { RoomType } from "./RoomType";

export interface Price{
    id:number;
    price:number;
    modifiedDate: Date;
    roomType: RoomType;
    deleteFlag:boolean;
}
