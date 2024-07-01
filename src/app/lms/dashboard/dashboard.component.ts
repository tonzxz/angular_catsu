import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class LMSDashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to login page if not logged in
      this.router.navigate(['/lms/dashboard/login']);
    }
  }

  logout(): void {
    // Clear user data from local storage and redirect to login
    localStorage.removeItem('user');
    this.router.navigate(['/lms/dashboard/login']);
  }
}
