import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SuperVisorComponent } from './super-visor/super-visor.component';
import { ButtonModalComponent } from './super-visor/button-modal/button-modal.component';

import { ButtonsListComponent } from './super-visor/buttons-list/buttons-list.component';
import { UserHistoryDetailsComponent } from './super-visor/user-history-details/user-history-details.component';
import { CallsReportAdminComponent } from './super-visor/calls-report-admin/calls-report-admin.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { DashboardComponent } from './super-visor/dashboard/dashboard.component';


@NgModule({
  declarations: [
    SuperVisorComponent,
    ButtonModalComponent,
    ButtonsListComponent,
    UserHistoryDetailsComponent,
    CallsReportAdminComponent,
    SupervisorComponent,
    DashboardComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,

  ],

})
export class AdminModule {
}
