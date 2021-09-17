import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {

  @Input() status:string;
  
  @Input() message: string;

  @Input() class:string;

  constructor() { }

  ngOnInit() {
  }

}
