import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth/auth-interceptor.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { DeleteConfirmDirective } from './directives/delete-confirm.directive';
import { ExportReportComponent } from './components/export-report/export-report.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VerifyModalComponentComponent } from './components/verify-modal-component/verify-modal-component.component';
import { UsersModalComponent } from './components/users-modal/users-modal.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AgentHeaderComponent } from './components/agent-header/agent-header.component';
import { JalaliPipe } from './pipes/jalali.pipe';
import { MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from './material.persian-date.adapter';
import { JalaliMomentDateAdapter } from './jalali-moment-date-adapter';
import { RouterModule } from '@angular/router';
import { DaysofweekPipe } from './pipes/daysofweek.pipe';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    DeleteConfirmDirective,
    ExportReportComponent,
    VerifyModalComponentComponent,
    UsersModalComponent,
    AdminHeaderComponent,
    AgentHeaderComponent,
    JalaliPipe,
    DaysofweekPipe
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatButtonModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
    FlexLayoutModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatChipsModule,
    RouterModule,
    HttpClientModule,
   

  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    DeleteConfirmDirective,
    ExportReportComponent,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatButtonModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
    FlexLayoutModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatChipsModule,
    JalaliPipe,
    DaysofweekPipe,
    AdminHeaderComponent,
    AgentHeaderComponent,
    RouterModule,
    HttpClientModule,
  
  ],
  providers:[  { provide: DateAdapter, useClass: MaterialPersianDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS }]

})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        JalaliMomentDateAdapter,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'fa' },
        { provide: DateAdapter, useClass: MaterialPersianDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS }
      ]
    };
  }
}
