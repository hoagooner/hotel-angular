import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isFirstLoad: boolean;

  constructor(private router:Router) {
  }

  ngOnInit() {
    $(document).ready(function () {
      $('.selected').closest("ul").collapse('show')
    });
  }

  changeOption($event){
    if(!$event.target.classList.contains("selected")){
      $('.menu').find("ul").collapse("hide")
    }
  }

}
