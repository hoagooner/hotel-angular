import { Component, OnInit } from '@angular/core';
declare var $: any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isFirstLoad: boolean;

  constructor() {
  }

  ngOnInit() {
    $(document).ready(function () {
      $('.selected').closest("ul").collapse('show')
    });
  }

}
