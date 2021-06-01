import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyModalComponentComponent } from './verify-modal-component.component';

describe('VerifyModalComponentComponent', () => {
  let component: VerifyModalComponentComponent;
  let fixture: ComponentFixture<VerifyModalComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyModalComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
