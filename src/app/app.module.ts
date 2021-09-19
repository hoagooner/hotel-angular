import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { FacilityListComponent } from './facility/facility-list/facility-list.component';
import { RouterModule } from '@angular/router';
import { FacilityService } from './services/facility.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalConfirmComponent } from './common/modal-confirm/modal-confirm.component';
import { ToastComponent } from './common/toast/toast.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { RoomComponent } from './room/room.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadFileService } from './services/upload-file.service';
import { FacilityValidators } from './facility/facility-list/facility.validators';
import { FooterComponent } from './common/footer/footer.component';

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
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'facilities', component: FacilityListComponent },
      { path: 'rooms', component: RoomComponent }
    ])
  ],
  providers: [
    FacilityService,
    UploadFileService,
    FacilityValidators
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
