import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Facility } from 'src/app/models/facility.model';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {

  @Input() deletedItem : any;
  @Input() title:string
  @Input() body:string
  @Input() submit:string
  @Output() actionEvent = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  action(){
    this.actionEvent.emit(this.deletedItem);
  }

}
