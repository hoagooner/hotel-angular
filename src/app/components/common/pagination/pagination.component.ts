import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.css"],
})
export class PaginationComponent implements OnInit {
    delta: number = 2;
    @Input() pageNumber: number = 1;
    pageSize: number = 5;

    @Input() totalPages: number;
    @Input() query: string;
    @Input() sortBy: string;
    @Input() sortDirection: string;
    @Input() totalElements: number;
    @Output() action = new EventEmitter<PagingArgs>();
    arr: number[] = [];
    specificPage = 1;

    changePageSize() {
        this.pageNumber = 1;
        this.action.emit({
            query: this.query,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sortBy:this.sortBy,
            sortDirection:this.sortDirection
        });
    }

    constructor() {}

    ngOnInit() {}

    // load first
    ngOnChanges() {
        this.pagination();
        // this.pageNumber = 1;
    }

    pagination() {
        let startIndex = Math.max(2, this.pageNumber - this.delta);
        let endIndex = Math.min(
            this.totalPages - 1,
            this.pageNumber * 1 + this.delta * 1
        );
        this.arr = Array.from(
            { length: endIndex - startIndex + 1 },
            (v, i) => i + startIndex
        );
    }

    // click page
    onChangePage($event) {
        let page = $event.path[0].innerText;
        if (page == this.pageNumber) return;
        switch (page) {
            case "First":
                if (this.pageNumber == 1) {
                    return;
                } else {
                    this.pageNumber = 1;
                }
                break;
            case "Last":
                if (this.pageNumber == this.totalPages) {
                    return;
                } else {
                    this.pageNumber = this.totalPages;
                }
                break;
            case "Next":
                if (this.pageNumber == this.totalPages) {
                    return;
                } else {
                    this.pageNumber++;
                }
                break;
            case "Prev":
                if (this.pageNumber == 1) {
                    return;
                } else {
                    this.pageNumber--;
                }
                break;
            case "...":
                return;
            default:
                this.pageNumber = page;
                break;
        }
        this.action.emit({
            query: this.query,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sortBy:this.sortBy,
            sortDirection:this.sortDirection
        });
        this.pagination();
    }

    // go to specific page
    goToPage() {

        if (this.specificPage > 0 && this.specificPage <= this.totalPages) {
            this.pageNumber = this.specificPage;
            this.action.emit({
                query: this.query,
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                sortBy:this.sortBy,
                sortDirection:this.sortDirection
            });

            this.pagination();
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
