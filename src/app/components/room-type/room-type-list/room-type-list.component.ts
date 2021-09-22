import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { param } from "jquery";
import { Subject } from "rxjs";
import { RoomType } from "src/app/models/RoomType";
import { RoomTypeService } from "src/app/services/room-type.service";
declare var $: any;

@Component({
    selector: "app-room-type-list",
    templateUrl: "./room-type-list.component.html",
    styleUrls: ["./room-type-list.component.css"],
})
export class RoomTypeListComponent implements OnInit {
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    roomTypes: RoomType[];
    selectedRoomType: any;
    modalTitle: string;
    submit: string;
    modalBody: string;
    deleteError: boolean;
    toastStatus: string;
    toastMessage: string;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject<any>();
    row: any;

    constructor(
        private roomTypeService: RoomTypeService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.dtOptions = {
            pagingType: "full_numbers",
            lengthMenu: [
                [5, 10, 15],
                [5, 10, 15],
            ],
        };

        this.roomTypeService.getAll().subscribe(
            (response) => {
                this.roomTypes = response;
                this.dtTrigger.next();
            },
            (error) => {
                console.log(error);
            }
        );

        this.activatedRoute.queryParams.subscribe((params) => {
            console.log(params);
            if (params.create == "success") {
                this.editToastAfterActionSuccess(
                    "Success",
                    "Room type created successfully"
                );
            }else if(params.update == "success"){
                this.editToastAfterActionSuccess(
                    "Success",
                    "Room type updated successfully"
                );
            }
        });
    }

    loadRoomTypes() {
        this.roomTypeService.getAll().subscribe(
            (response) => {
                this.roomTypes = response;
            },
            (error) => {
                console.log(error);
            }
        );
        this.rerender();
        this.closeConfirmModal();
    }

    //re render data table
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    clickDelete(roomType) {
        this.selectedRoomType = roomType;
        this.modalTitle = "Confirm delete";
        this.submit = "Delete";
        this.modalBody =
            "Are you sure you want to delete this record, This process cannot be undone";
        this.deleteError = false;
    }

    deleteRoomType(roomType) {
        // $('#roomTypeTable').DataTable().destroy()
        this.roomTypeService.delete(roomType.id).subscribe(
            (response) => {
                let index = this.roomTypes.indexOf(roomType);
                // delete row
                $("#roomTypeTable").dataTable().fnDeleteRow(this.row.path[2]);
                this.editToastAfterActionSuccess(
                    "Success",
                    "Room type deleted successfylly !"
                );
            },
            (error) => {
                this.editModalAfterDeleteError("delete");
                console.log(error);
            }
        );
    }

    // edit toast after action success
    editToastAfterActionSuccess(status: string, message: string) {
        $("#confirmModal").modal("hide");
        this.toastStatus = status;
        this.toastMessage = message;
        $(".toast").toast("show");
    }

    //  edit modal after delete error
    editModalAfterDeleteError(action: string) {
        this.deleteError = true;
        this.submit = "Refresh";
        this.modalTitle = "Oops!";
        this.modalBody = `Can't ${action} this item. It might have been deleted. Please refresh your page !`;
    }

    //close confirm modal
    closeConfirmModal() {
        $("#confirmModal").modal("hide");
    }
}
