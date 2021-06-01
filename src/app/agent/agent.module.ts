import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentRoutingModule } from './agent-routing.module';
import { AgentsComponent } from './agents/agents.component';
import { SharedModule } from '../shared/shared.module';
import { AgentComponent } from './agent/agent.component';
import { CallsReportComponent } from './calls-report/calls-report.component';
import { UserHistoryComponent } from './user-history/user-history.component';



@NgModule({
  declarations: [AgentsComponent,
      AgentComponent,
      CallsReportComponent,
      UserHistoryComponent],
  imports: [
    CommonModule,
    AgentRoutingModule,
    SharedModule

  ]
})
export class AgentModule { }
