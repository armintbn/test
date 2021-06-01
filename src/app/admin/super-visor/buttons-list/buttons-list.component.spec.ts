import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsListComponent } from './buttons-list.component';

describe('ButtonsListComponent', () => {
  let component: ButtonsListComponent;
  let fixture: ComponentFixture<ButtonsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
