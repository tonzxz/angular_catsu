import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdmissionRoutingModule } from './admission-routing.module';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { SupabaseService } from '../supabase.service';

@NgModule({
  declarations: [
    ApplicationFormComponent,
    // other components
  ],
  imports: [
    CommonModule, // Import CommonModule here
    FormsModule,
    AdmissionRoutingModule
  ],
  providers: [SupabaseService]
})
export class AdmissionModule { }
