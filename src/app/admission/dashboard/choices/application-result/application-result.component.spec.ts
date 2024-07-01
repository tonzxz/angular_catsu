import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationResultComponent } from './application-result.component';

describe('ApplicationResultComponent', () => {
  let component: ApplicationResultComponent;
  let fixture: ComponentFixture<ApplicationResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
