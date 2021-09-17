import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PagingArgs } from 'src/app/common/pagination/pagination.component';
import { Facility } from 'src/app/models/Facility';
import { FacilityService } from 'src/app/services/facility.service';
declare var $: any;

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.css']
})
export class FacilityListComponent implements OnInit {
  facilities: Facility[];
  action: string;
  selectedFacility = new Facility();
  toastMessage: string;
  toastStatus: string;
  modalTitle: string;
  modalBody: string;
  submit: string;
  actionEvent: any;
  deleteError = false;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  // default value
  pagingArgs: PagingArgs = {
    query: "",
    pageNumber: 1,
    pageSize: 5
  }
  errors = ErrorMessage;
  constructor(private facilityService: FacilityService,
    private router: Router) { }

  ngOnInit() {
    this.loadFacilitites();
    $(document).ready(function () {
      $('#facilityTable').DataTable();
      });
  }

  form = new FormGroup({
    facility: new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      description: new FormControl('', [Validators.required])
    })
  });

  get name() {
    return this.form.get("facility.name")
  }

  get description() {
    return this.form.get("facility.description")
  }

  get facility() {
    return this.form.get("facility").value;
  }

  loadFacilitites(eventArgs?) {
    if (eventArgs) {
      this.pagingArgs = eventArgs;
    }
    this.facilityService.getAll(eventArgs)
      .subscribe(response => {
        if (response) {
          this.facilities = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
        } else {
          this.facilities = []
          this.totalElements = 0;
          this.totalPages = 0;
        }
      },
        (error: Response) => {
          console.log(error);
        })
    // close after refresh
    this.closeConfirmModal()

  }

  updateFacility() {
    this.facilityService.update(this.facility.id, this.facility)
      .subscribe(response => {
        console.log(response);
        let index = this.facilities.findIndex(e => e.id == this.facility.id);
        this.facilities.splice(index, 1, this.facility)

        this.editToastAfterActionSuccess("Success", "Facility updated successfylly !");
      }, error => {
        console.log(error)
      })
  }

  createFacility() {
    this.facilityService.create(this.facility)
      .subscribe(response => {
        this.loadFacilitites(this.pagingArgs)
        this.editToastAfterActionSuccess("Success", "Facility created successfylly !");
      }, error => console.log(error));
  }

  clickDelete(facility) {
    this.selectedFacility = facility;
    this.modalTitle = "Confirm delete";
    this.submit = "Delete"
    this.modalBody = 'Are you sure you want to delete this record, This process cannot be undone';
    this.deleteError = false;
  }

  clickAdd() {
    this.action = "Add"
    this.form.reset();
    this.focusFirstInput()
  }

  clickEdit(facility: Facility) {
    // check facility exists or not
    this.facilityService.get(facility.id)
      .subscribe(response => {
        $('#facilityModal').modal('show');
        this.focusFirstInput()
        this.action = "Edit"
        this.form.reset();
        this.form.get('facility').setValue({
          id: facility.id,
          name: facility.name,
          description: facility.description
        })
      }, error => {
        $('#facilityModal').modal('hide');
        $('#confirmModal').modal('show');
        this.editModalAfterDeleteError("update")
      })


  }

  deleteFacility(facility) {
    this.facilityService.delete(facility.id)
      .subscribe(response => {
        let index = this.facilities.indexOf(facility);
        this.loadFacilitites(this.pagingArgs) // load facilities
        this.editToastAfterActionSuccess("Success", "Facility deleted successfylly !");
      }, error => {
        this.editModalAfterDeleteError("delete")
        console.log(error)
      })
  }


  // search
  onChangeSearch($event) {
    let query = $event.target.value;
    this.pagingArgs.query = query;
    this.loadFacilitites(this.pagingArgs);
  }

  editModalAfterDeleteError(action: string) {
    this.deleteError = true;
    this.submit = "Refresh"
    this.modalTitle = "Oops!";
    this.modalBody = `Can't ${action} this item. It might have been deleted. Please refresh your page !`
  }

  editToastAfterActionSuccess(status: string, message: string) {
    $('#facilityModal').modal('hide');
    $('#confirmModal').modal('hide');
    this.toastStatus = status;
    this.toastMessage = message;
    $('.toast').toast('show');
  }

  focusFirstInput() {
    $('#facilityModal').on('shown.bs.modal', function () {
      $('#name').focus();
    })
  }

  //close confirm modal
  closeConfirmModal() {
    $('#confirmModal').modal('hide');
  }

}

export const ErrorMessage = {
  required: "This field must be not empty",
  minLength: "miximum 3 character",
  phonePattern: "invalid phone format"
}
