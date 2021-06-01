import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoryDetailsComponent } from './user-history-details.component';

describe('UserHistoryDetailsComponent', () => {
  let component: UserHistoryDetailsComponent;
  let fixture: ComponentFixture<UserHistoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHistoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
