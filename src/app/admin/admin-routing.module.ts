import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardService} from '../auth/auth-guard.service';
import { SuperVisorComponent } from './super-visor/super-visor.component';
import { ButtonsListComponent } from './super-visor/buttons-list/buttons-list.component';
import { UserHistoryDetailsComponent } from './super-visor/user-history-details/user-history-details.component';
import { CallsReportAdminComponent } from './super-visor/calls-report-admin/calls-report-admin.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { DashboardComponent } from './super-visor/dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: SupervisorComponent,  

  canActivate: [AuthGuardService],
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent ,
    },
    {
      path: 'users',
      component: SuperVisorComponent ,
    },
    {       
      path:'agents-activities-history',
      component:UserHistoryDetailsComponent
    },
   

    {       
      path:'agents-calls-history',
      component:CallsReportAdminComponent
    },
    
    {
      path:'buttons',
      component:ButtonsListComponent
    },   
  ],
}];

export const ADMIN_MODULE_TEST_ROUTE = routes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
