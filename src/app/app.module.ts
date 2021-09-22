import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { FacilityListComponent } from './components/facility/facility.component';
import { RouterModule } from '@angular/router';
import { FacilityService } from './services/facility.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalConfirmComponent } from './components/common/modal-confirm/modal-confirm.component';
import { ToastComponent } from './components/common/toast/toast.component';
import { PaginationComponent } from './components/common/pagination/pagination.component';
import { RoomComponent } from './components/room/room.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { UploadFileService } from './services/upload-file.service';
import { FacilityValidators } from './components/facility/facility.validators';
import { FooterComponent } from './components/common/footer/footer.component';
import { RoomTypeListComponent } from './components/room-type/room-type-list/room-type-list.component';
import { RoomTypeService } from './services/room-type.service';
import { DataTablesModule } from 'angular-datatables';
import { CreateRoomTypeComponent } from './components/room-type/create-room-type/create-room-type.component';
import { UpdateRoomTypeComponent } from './components/room-type/update-room-type/update-room-type.component';
import { ValidationMessage } from './utils/ValidationMessage';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FacilityListComponent,
    ModalConfirmComponent,
    ToastComponent,
    PaginationComponent,
    RoomComponent,
    UploadFileComponent,
    FooterComponent,
    RoomTypeListComponent,
    CreateRoomTypeComponent,
    UpdateRoomTypeComponent,
    NotFoundComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule
  ],
  providers: [
    FacilityService,
    UploadFileService,
    FacilityValidators,
    RoomTypeService,
    ValidationMessage
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
