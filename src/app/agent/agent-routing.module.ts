import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgentsComponent } from './agents/agents.component';
import { AgentComponent } from './agent/agent.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { CallsReportComponent } from './calls-report/calls-report.component';
import { UserHistoryComponent } from './user-history/user-history.component';

const routes: Routes = [
  {
    path: '',
    component: AgentComponent,
    canActivate: [AuthGuardService],
    children: [{
      path: 'dashboard',
      component: AgentsComponent
    },
    {
      path: 'call-history',
      component: CallsReportComponent
    },
    {
      path: 'activities-history',
      component: UserHistoryComponent
    }]
  }

];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
