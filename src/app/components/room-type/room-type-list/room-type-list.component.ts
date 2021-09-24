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
import { RoomTypeService } from "src/app/services/room-type/room-type.service";
import { CalculateTableIndex } from "src/app/utils/CalculateTableIndex";
import { CommomUtils } from "src/app/utils/CommonUtils";
import { PagingArgs } from "../../common/pagination/pagination.component";
declare var $: any;

@Component({
    selector: "app-room-type-list",
    templateUrl: "./room-type-list.component.html",
    styleUrls: ["./room-type-list.component.css"],
})
export class RoomTypeListComponent implements OnInit {

    roomTypes: RoomType[];
    selectedRoomType: any;
    modalTitle: string;
    submit: string;
    modalBody: string;
    deleteError: boolean;
    toastStatus: string;
    toastMessage: string;
    totalPages: number;
    totalElements: number;
    query: string;
    pageSize: number;
    // default paging, search, sort
    pagingArgs: PagingArgs = {
        query: "",
        pageNumber: 1,
        pageSize: 5,
        sortBy:"id",
        sortDirection:"desc"
    };

    constructor(
        private roomTypeService: RoomTypeService,
        private activatedRoute: ActivatedRoute,
        public calculateTableIndex: CalculateTableIndex
    ) {}

    ngOnInit() {
        this.loadRoomTypes(this.pagingArgs)
        CommomUtils.tabLoop()
        CommomUtils.focusFirstInput()
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

    loadRoomTypes(eventArgs?) {
        this.pagingArgs = eventArgs;
        this.roomTypeService.getAll(this.pagingArgs).subscribe(
            (response) => {
                if (response) {
                    this.roomTypes = response.content;
                    this.totalElements = response.totalElements;
                    this.totalPages = response.totalPages;
                } else {
                    this.roomTypes = [];
                    this.totalElements = 0;
                    this.totalPages = 0;
                }
            },
            (error: Response) => {
                console.log(error);
            }
        );
        this.closeConfirmModal();
    }

    clickView(id){
         // check facility exists or not
         this.roomTypeService.get(id).subscribe(
            (response) => {
                $("#detailModal").modal("show");
                this.selectedRoomType = response;
            },
            (error) => {
                $("#facilityModal").modal("hide");
                $("#confirmModal").modal("show");
                this.editModalAfterDeleteError("update");
            }
        );
    }

     //sort facilities
     sortRoomTypes(prop){
        if(this.pagingArgs.sortBy == prop){
            if(this.pagingArgs.sortDirection == "desc"){
                this.pagingArgs.sortDirection = "asc"
            }else{
                this.pagingArgs.sortDirection = "desc"
            }
        }
        this.pagingArgs.sortBy = prop;
        this.loadRoomTypes(this.pagingArgs)
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
                this.loadRoomTypes(this.pagingArgs); // load room types
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

    // search facilities
    onChangeSearch(query) {
        console.log("event");
        this.query = query;
        // refer first page after search
        this.pagingArgs.pageNumber = 1;
        this.pagingArgs.query = this.query;
        this.loadRoomTypes(this.pagingArgs);
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
