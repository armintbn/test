import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { WallboardViewComponent } from './wallboard-view/wallboard-view.component';
import { WallboardComponent } from './wallboard/wallboard.component';


const routes: Routes = [
  {
    path: '',
    component:WallboardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path:'wallboard',
        component:WallboardViewComponent
      }
    ]
  },
  {
    path:'**',
    redirectTo:''
  }

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],

})
export class WallBoardRoutingModule { }
