import { Facility } from "./facility.model";
import { Price } from "./price.model";
import { Room } from "./room.model";

export class RoomType {
    id: number;
    name: string;
    description: string;
    size: string;
    numberOfAdults: number;
    numberOfChilds: number;
    numberOfBeds: number;
    price:number;
    prices: Price[];
    rooms: Room[];
    facilities: Facility[];
    deleteFlag:boolean;
    image:string;
}
