import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatsucetFeeComponent } from './catsucet-fee.component';

describe('CatsucetFeeComponent', () => {
  let component: CatsucetFeeComponent;
  let fixture: ComponentFixture<CatsucetFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatsucetFeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatsucetFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
