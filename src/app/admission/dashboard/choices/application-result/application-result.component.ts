import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../../supabase.service'; // Update the path as necessary

@Component({
  selector: 'app-application-result',
  templateUrl: './application-result.component.html',
  styleUrls: ['./application-result.component.css']
})
export class ApplicationResultComponent implements OnInit {
  email: string = '';
  result: any = null;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  async loadUserData() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      alert('User data is not available.');
      return;
    }

    const userData = JSON.parse(userDataString);
    if (!userData || !userData.username) {
      alert('User data is not available.');
      return;
    }

    const { data, error } = await this.supabaseService.supabase
      .from('admissions')
      .select('email')
      .eq('username', userData.username)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
      return;
    }

    this.email = data.email || 'N/A';
    this.checkResult();
  }

  async checkResult() {
    const { data, error } = await this.supabaseService.supabase
      .from('admissions')
      .select('*')
      .eq('email', this.email)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please check the email address and try again.');
      return;
    }

    this.result = data;
    this.displayResult(data);
  }

  displayResult(data: any) {
    const resultContainer = document.getElementById('result-container');
    if (resultContainer) {
      resultContainer.innerHTML = `
        <div class="mt-6">
          <table class="min-w-full bg-white border-collapse border border-gray-200">
            <thead>
              <tr>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Building</th>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="py-2 px-4 border-b border-gray-200">${new Date(data.created_at).toLocaleDateString()}</td>
                <td class="py-2 px-4 border-b border-gray-200">Main Campus</td>
                <td class="py-2 px-4 border-b border-gray-200">Building A</td>
                <td class="py-2 px-4 border-b border-gray-200">Room 101</td>
                <td class="py-2 px-4 border-b border-gray-200">${data.approve ? 'Approved' : 'Pending'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
  }

  goBack() {
    this.router.navigate(['/admission/dashboard']); // Change this to your main page route
  }
}
