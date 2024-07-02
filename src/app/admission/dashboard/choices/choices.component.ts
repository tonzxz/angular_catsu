import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../supabase.service'; // Update the path as necessary

@Component({
  selector: 'app-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.css']
})
export class ChoicesComponent implements OnInit {
  isApplicationSubmitted: boolean = false;
  isPaymentSubmitted: boolean = false;
  examResult: string | null = null; // Store the exam result

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.checkSubmissionStatus();
  }

  async checkSubmissionStatus() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.isApplicationSubmitted = !!userData && !!userData.id; // Adjust this condition as per your logic

      if (userData && userData.username) {
        try {
          const { data, error } = await this.supabaseService.supabase
            .from('admissions')
            .select('payment, approve')
            .eq('username', userData.username)
            .single();

          if (error) {
            console.error('Error fetching payment and result data:', error);
            return;
          }

          // Check if payment and approve columns are not null
          this.isPaymentSubmitted = !!data?.payment;
          this.examResult = data?.approve ? 'Passed' : null;
        } catch (error) {
          console.error('Error during Supabase query:', error);
        }
      }
    }
  }

  goBack() {
    this.router.navigate(['/admission/dashboard']); // Change this to your main page route
  }

  showForm(formType: string) {
    if (formType === 'application') {
      this.router.navigate(['/admission/dashboard/choices/application-form']);
    } else if (formType === 'catsucet-fee') {
      this.router.navigate(['/admission/dashboard/choices/catsucet-fee']);
    } else if (formType === 'application-result') {
      this.router.navigate(['/admission/dashboard/choices/application-result']);
    }
  }

  proceedToEnrollment() {
    this.router.navigate(['/enrollment/dashboard/forms']);
  }
}
