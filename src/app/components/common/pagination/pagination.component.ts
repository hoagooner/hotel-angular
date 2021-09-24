import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.css"],
})
export class PaginationComponent implements OnInit {
    delta: number = 2;
    @Input() totalPages: number;
    @Input() totalElements: number;
    @Input() pagingArgs: PagingArgs
    @Output() action = new EventEmitter<PagingArgs>();
    arr: number[] = [];
    specificPage = 1;

    changePageSize() {
        this.pagingArgs.pageNumber=1 // return fisrt page
        this.action.emit(this.pagingArgs)
    }

    constructor() {}
    ngOnInit() {}

    // load first
    ngOnChanges() {
        this.pagination();
    }

    pagination() {
        let startIndex = Math.max(2, this.pagingArgs.pageNumber - this.delta);
        let endIndex = Math.min(
            this.totalPages - 1,
            this.pagingArgs.pageNumber * 1 + this.delta * 1
        );
        this.arr = Array.from(
            { length: endIndex - startIndex + 1 },
            (v, i) => i + startIndex
        );
    }

    // click page
    onChangePage($event) {
        let page = $event.path[0].innerText;
        if (page == this.pagingArgs.pageNumber) return;
        switch (page) {
            case "««":
                if (this.pagingArgs.pageNumber == 1) {
                    return;
                } else {
                    this.pagingArgs.pageNumber = 1;
                }
                break;
            case "»»":
                if (this.pagingArgs.pageNumber == this.totalPages) {
                    return;
                } else {
                    this.pagingArgs.pageNumber = this.totalPages;
                }
                break;
            case "»":
                if (this.pagingArgs.pageNumber == this.totalPages) {
                    return;
                } else {
                    this.pagingArgs.pageNumber++;
                }
                break;
            case "«":
                if (this.pagingArgs.pageNumber == 1) {
                    return;
                } else {
                    this.pagingArgs.pageNumber--;
                }
                break;
            case "...":
                return;
            default:
                this.pagingArgs.pageNumber = page;
                break;
        }
        this.pagingArgs.pageNumber,
        this.action.emit(this.pagingArgs);
        this.pagination();
    }

    // go to specific page
    goToPage() {
        if (this.specificPage > 0 && this.specificPage <= this.totalPages) {
            this.pagingArgs.pageNumber = this.specificPage;
            this.action.emit(this.pagingArgs);
            this.pagination();
        }else{
            this.specificPage = 1
        }
    }
}

export interface PagingArgs {
    query: string;
    pageNumber: number;
    pageSize: number;
    sortBy:string,
    sortDirection:string
}
