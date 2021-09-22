import { Facility } from "./Facility";
import { Price } from "./Price";
import { Room } from "./Room";

export class RoomType {
    id: number;
    name: string;
    description: string;
    size: string;
    numberOfAdults: number;
    numberOfChilds: number;
    numberOfBeds: number;
    prices: Price[];
    rooms: Room[];
    facilities: Facility[];
}