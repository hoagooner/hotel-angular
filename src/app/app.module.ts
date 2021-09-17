import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FacilityListComponent } from './facility/facility-list/facility-list.component';
import { RouterModule } from '@angular/router';
import { FacilityService } from './services/facility.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalConfirmComponent } from './common/modal-confirm/modal-confirm.component';
import { ToastComponent } from './common/toast/toast.component';
import { PaginationComponent } from './common/pagination/pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FacilityListComponent,
    ModalConfirmComponent,
    ToastComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'facilities', component: FacilityListComponent }
    ])
  ],
  providers: [
    FacilityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
