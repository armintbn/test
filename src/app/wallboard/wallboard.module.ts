import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WallBoardRoutingModule } from './wallboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { WallboardViewComponent } from './wallboard-view/wallboard-view.component';
import { FullScreenComponent } from './wallboard-view/full-screen/full-screen.component';
import { WallboardSettingsComponent } from './wallboard-view/wallboard-settings/wallboard-settings.component';
import { WallboardComponent } from './wallboard/wallboard.component';




@NgModule({
  declarations: [WallboardViewComponent, FullScreenComponent, WallboardSettingsComponent, WallboardComponent],
  imports: [
    CommonModule,
    SharedModule,  
    WallBoardRoutingModule
  ],
  entryComponents: [FullScreenComponent, WallboardSettingsComponent]
})
export class WallBoardModule { }
