import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomTypeComponent } from './create-room-type.component';

describe('CreateRoomTypeComponent', () => {
  let component: CreateRoomTypeComponent;
  let fixture: ComponentFixture<CreateRoomTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoomTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
