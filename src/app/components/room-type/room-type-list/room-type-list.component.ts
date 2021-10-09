import {
    Component,
    OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RoomType } from "src/app/models/room-type.model";
import { RoomTypeService } from "src/app/services/room-type/room-type.service";
import { CalculateTableIndex } from "src/app/utils/calculate-table-index";
import { AnimationUtils } from "src/app/utils/animation.utils";
import { PagingArgs } from "../../common/pagination/pagination.component";
import { ToastService } from "src/app/services/toast/toast.service";
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
        public calculateTableIndex: CalculateTableIndex,
        private toast:ToastService,
        private route : Router
    ) {}

    ngOnInit() {
        this.loadRoomTypes(this.pagingArgs)
        AnimationUtils.tabLoop()
        AnimationUtils.focusFirstInput()
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

         this.roomTypeService.get(id).subscribe(
            (response) => {
                $("#detailModal").modal("show");
                this.selectedRoomType = response;
            },
            (error) => {
                this.editModalAfterDeleteError("view");
                $("#confirmModal").modal("show");
            }
        );
    }

     //sort facilities
     sortRoomTypes(prop){
        if(this.pagingArgs.sortBy == prop){
            this.pagingArgs.sortDirection == "desc"
            ?  this.pagingArgs.sortDirection = "asc"
            : this.pagingArgs.sortDirection = "desc"
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
                this.toast.showSuccess("Room type deleted successfylly !","")
                $("#confirmModal").modal("hide");
            },
            (error) => {
                console.log("show");
                this.editModalAfterDeleteError("delete");
            }
        );
    }

    //  edit modal after delete error
    editModalAfterDeleteError(action: string) {
        this.deleteError = true;
        this.submit = "Refresh";
        this.modalTitle = "Oops!";
        this.modalBody = `Can't ${action} this item. It might have been deleted. Please refresh your page !`;
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

    clickEdit(id){
        $(".modal").modal("hide")
        this.roomTypeService.get(id).subscribe(
            (response) => {
                this.route.navigate(["room-types",id]);
            },
            (error) => {
                this.editModalAfterDeleteError("edit");
                $("#confirmModal").modal("show");
            }
        );

    }

    //close confirm modal
    closeConfirmModal() {
        $("#confirmModal").modal("hide");
    }
}
