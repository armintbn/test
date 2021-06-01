import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallboardSettingsComponent } from './wallboard-settings.component';

describe('WallboardSettingsComponent', () => {
  let component: WallboardSettingsComponent;
  let fixture: ComponentFixture<WallboardSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallboardSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
