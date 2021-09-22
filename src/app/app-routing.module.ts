import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { FacilityListComponent } from "./components/facility/facility.component";
import { HomeComponent } from "./components/home/home.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { CreateRoomTypeComponent } from "./components/room-type/create-room-type/create-room-type.component";
import { RoomTypeListComponent } from "./components/room-type/room-type-list/room-type-list.component";
import { UpdateRoomTypeComponent } from "./components/room-type/update-room-type/update-room-type.component";
import { RoomComponent } from "./components/room/room.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "facilities", component: FacilityListComponent },
    { path: "rooms", component: RoomComponent },
    { path: "room-types", component: RoomTypeListComponent },
    { path: "room-types/create", component: CreateRoomTypeComponent },
    { path: "room-types/:id", component: UpdateRoomTypeComponent },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
