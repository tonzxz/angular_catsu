import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentDashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: EnrollmentDashboardComponent;
  let fixture: ComponentFixture<EnrollmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnrollmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
