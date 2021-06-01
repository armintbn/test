import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [

{
path:'',
redirectTo:'agent/dashboard',
pathMatch:'full'
},
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule),
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./wallboard/wallboard.module')
      .then(m => m.WallBoardModule),
  },
  {
    path: 'agent',
    loadChildren: () => import('./agent/agent.module')
      .then(m => m.AgentModule),
  },
];

const config: ExtraOptions = {
  useHash: false,      
  preloadingStrategy: PreloadAllModules
  
};

@NgModule({
  imports: [RouterModule.forRoot(routes,config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
