import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  delta: number = 2;
  pageNumber: number = 1;
  pageSize: number = 5;

  @Input() totalPages: number;
  @Input() totalElements: number;
  @Output() action = new EventEmitter()
  arr: number[] = [];
  specificPage = 1;


  actionPaging() {
    this.pageNumber = 1
    this.action.emit({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    });
  }

  constructor() {
  }

  ngOnInit() {
  }

  // load first
  ngOnChanges() {
    let startIndex = Math.max(2, this.pageNumber - this.delta);
    let endIndex = Math.min(this.totalPages - 1, this.pageNumber * 1 + this.delta * 1);
    this.arr = Array.from({ length: endIndex - startIndex + 1 }, (v, i) => i + startIndex)
  }

  // click page
  onChangePage($event) {
    let page = $event.path[0].innerText;
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
      default:
        this.pageNumber = page
        break;
    }
    this.action.emit({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    })
    this.ngOnChanges()
  }

  // go to specific page
  goToPage() {
    if (this.specificPage > 0 && this.specificPage <= this.totalPages) {
      console.log("valid");
      this.pageNumber = this.specificPage;
      this.action.emit({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
      this.ngOnChanges()
    }
  }

}

export interface PagingArgs {
  query:string;
  pageNumber: number;
  pageSize: number
}