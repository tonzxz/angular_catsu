import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent {
  constructor(private router: Router) {}
  
    navigateTo(path: string) {
      this.router.navigate([path]);
    }
}
