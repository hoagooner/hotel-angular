import { RoomType } from "./room-type.model";

export class Room {
    id:number;
    roomNumber: number;
    roomType: RoomType;
    floor: string;
    deleteFlag: boolean;
}
