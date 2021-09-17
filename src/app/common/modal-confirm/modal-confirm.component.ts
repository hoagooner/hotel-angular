import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Facility } from 'src/app/models/Facility';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {

  @Input() deletedFacility : Facility;
  @Input() title:string
  @Input() body:string
  @Input() submit:string
  @Output() actionEvent = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  action(){
    console.log(this.deletedFacility);
    this.actionEvent.emit(this.deletedFacility);
  }

}
