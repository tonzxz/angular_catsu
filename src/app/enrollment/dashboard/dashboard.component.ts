import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SupabaseService } from '../../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enrollment-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class EnrollmentDashboardComponent implements OnInit {
  @ViewChild('container', { static: true }) container!: ElementRef;

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.showLoginForm();
  }

  showLoginForm(event?: Event) {
    event?.preventDefault();
    this.container.nativeElement.innerHTML = `
      <img src="assets/catsu.png" alt="Catanduanes State University" class="school-image mx-auto w-24 mb-4">
      <h1 class="text-2xl font-bold text-center mb-2">Catanduanes State University</h1>
      <h2 class="text-center mb-4">Online Admission System</h2>
      <label class="block text-sm font-medium" for="username">Username:</label>
      <input type="text" id="username" name="username" class="w-full px-4 py-2 border rounded-lg mb-4">
      <label class="block text-sm font-medium" for="password">Password:</label>
      <input type="password" id="password" name="password" class="w-full px-4 py-2 border rounded-lg mb-4">
      <button id="dashboard-go" type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
    `;

    this.initEventListeners();
  }

  initEventListeners() {
    const button = document.getElementById('dashboard-go');
    if (button) {
      button.addEventListener('click', async () => {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const { data, error } = await this.supabaseService.supabase
          .from('admissions')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (error) {
          console.error('Error logging in:', error);
          alert('Invalid credentials. Please try again.');
          return;
        }

        if (data) {
          // Store user data in local storage or a service
          localStorage.setItem('admissionUser', JSON.stringify(data));

          // Redirect to the forms page
          alert('Login successful');
          this.router.navigate(['/enrollment/dashboard/forms']);
        } else {
          alert('Invalid credentials. Please try again.');
        }
      });
    }
  }
}
