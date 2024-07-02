import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdmissionDashboardComponent } from './admission/dashboard/dashboard.component';
import { ChoicesComponent } from './admission/dashboard/choices/choices.component';
import { ApplicationFormComponent } from './admission/dashboard/choices/application-form/application-form.component';
import { CatsucetFeeComponent } from './admission/dashboard/choices/catsucet-fee/catsucet-fee.component';
import { ApplicationResultComponent } from './admission/dashboard/choices/application-result/application-result.component';
import { EnrollmentDashboardComponent } from './enrollment/dashboard/dashboard.component';
import { FileManagementComponent } from './admin/dashboard/file-management/file-management.component';
import { FormsComponent } from './enrollment/dashboard/forms/forms.component';
import { LoginComponent } from './lms/dashboard/login/login.component';
import { LMSDashboardComponent } from './lms/dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';

const routes: Routes = [
  { path: '', component: MainDashboardComponent },

  { path: 'landingpage', component: LandingPageComponent },
  { path: 'admission/dashboard', component: AdmissionDashboardComponent },
  { path: 'admission/dashboard/choices', component: ChoicesComponent },
  { path: 'admission/dashboard/choices/application-form', component: ApplicationFormComponent },
  { path: 'admission/dashboard/choices/catsucet-fee', component: CatsucetFeeComponent },
  { path: 'admission/dashboard/choices/application-result', component: ApplicationResultComponent },
  { path: 'enrollment/dashboard', component: EnrollmentDashboardComponent },
  { path: 'enrollment/dashboard/forms', component: FormsComponent },
  { path: 'lms/dashboard/login', component: LoginComponent },
  { path: 'lms/dashboard', component: LMSDashboardComponent },

  { path: 'admin/dashboard/file-management', component: FileManagementComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AdmissionDashboardComponent,
    ChoicesComponent,
    ApplicationFormComponent,
    CatsucetFeeComponent,
    ApplicationResultComponent,
    EnrollmentDashboardComponent,
    FileManagementComponent,
    FormsComponent,
    LoginComponent,
    LMSDashboardComponent,
    LandingPageComponent,
    MainDashboardComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    FormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
