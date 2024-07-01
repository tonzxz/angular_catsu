import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../supabase.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private supabaseService: SupabaseService, private router: Router, private snackBar: MatSnackBar) {}

  async onSubmit(event: Event) {
    event.preventDefault();

    try {
      const { data, error } = await this.supabaseService.supabase
        .from('enrollment_data')
        .select('*')
        .eq('school_email', this.email)
        .single();

      if (error) {
        throw new Error('Login failed. Please check your email and password.');
      }

      if (data && data.school_password === this.password) {
        // Save the user data in local storage or any state management
        localStorage.setItem('user', JSON.stringify(data));

        // Show success message
        this.snackBar.open('Login success', 'Close', {
          duration: 2000,
        });

        // Navigate to the dashboard
        this.router.navigate(['/lms/dashboard']);
      } else {
        throw new Error('Login failed. Please check your email and password.');
      }
    } catch (err: any) { // Ensure the error type is 'any' to access 'message'
      this.errorMessage = err.message;
    }
  }
}
