import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallboardViewComponent } from './wallboard-view.component';

describe('WallboardViewComponent', () => {
  let component: WallboardViewComponent;
  let fixture: ComponentFixture<WallboardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallboardViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
