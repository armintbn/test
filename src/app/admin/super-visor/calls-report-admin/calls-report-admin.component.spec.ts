import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsReportAdminComponent } from './calls-report-admin.component';

describe('CallsReportAdminComponent', () => {
  let component: CallsReportAdminComponent;
  let fixture: ComponentFixture<CallsReportAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsReportAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsReportAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
