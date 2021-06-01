import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsReportComponent } from './calls-report.component';

describe('CallsReportComponent', () => {
  let component: CallsReportComponent;
  let fixture: ComponentFixture<CallsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
