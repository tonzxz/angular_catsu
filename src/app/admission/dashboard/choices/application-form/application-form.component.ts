import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {
  formData: any = {};
  currentTab: string = 'personal';
  showModal: boolean = false; // State to control modal visibility

  personalFields = [
    { id: 'id', label: 'ID', type: 'text' },
    { id: 'last_name', label: 'Last Name', type: 'text' },
    { id: 'given_name', label: 'First Name', type: 'text' },
    { id: 'middle_name', label: 'Middle Name', type: 'text' },
    { id: 'suffix', label: 'Suffix', type: 'text' },
    { id: 'gender', label: 'Gender', type: 'select', options: [
      { value: '', label: 'Select Gender' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]},
    { id: 'marital_status', label: 'Marital Status', type: 'select', options: [
      { value: '', label: 'Select Marital Status' },
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married' },
      { value: 'widowed', label: 'Widowed' },
      { value: 'divorced', label: 'Divorced' }
    ]},
    { id: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { id: 'place_of_birth', label: 'Place of Birth', type: 'text' },
    { id: 'country_of_birth', label: 'Country of Birth', type: 'select', options: [
      { value: '', label: 'Select Country' },
      { value: 'ph', label: 'Philippines' }
    ]},
    { id: 'religious_affiliation', label: 'Religious Affiliation', type: 'text' },
    { id: 'foreign_student', label: 'International / Foreign Student?', type: 'checkbox' },
    { id: 'lrn', label: 'LRN', type: 'text' },
    { id: 'language_spoken', label: 'Language Spoken', type: 'text' },
    { id: 'foreign_language_spoken', label: 'Foreign Language Spoken', type: 'text' },
    { id: 'photo', label: 'Photo', type: 'file' },
    { id: 'working_student', label: 'Working Student?', type: 'checkbox' }
  ];

  contactFields = [
    { id: 'contact_number', label: 'Contact Number', type: 'text' },
    { id: 'telephone_number', label: 'Telephone Number', type: 'text' },
    { id: 'present_address', label: 'Present Address', type: 'text' },
    { id: 'country', label: 'Country', type: 'select', options: [
      { value: '', label: 'Select Country' }
    ]},
    { id: 'province', label: 'Province', type: 'text' },
    { id: 'city', label: 'City', type: 'text' },
    { id: 'barangay', label: 'Barangay', type: 'text' },
    { id: 'zip_code', label: 'Zip Code', type: 'text' },
    { id: 'permanent_address', label: 'Permanent Address', type: 'text' },
    { id: 'same_as_present', label: 'Same as Present Address?', type: 'checkbox' }
  ];

  academicFields = [
    { id: 'course', label: 'Course', type: 'text' },
    { id: 'preferred_campus', label: 'Preferred Campus', type: 'text' },
    { id: 'preferred_term', label: 'Preferred Term', type: 'select', options: [
      { value: '', label: 'Select Term' }
    ]},
    { id: 'preferred_year_level', label: 'Preferred Year Level', type: 'select', options: [
      { value: '', label: 'Select Year Level' }
    ]}
  ];

  educationFields = [
    { id: 'high_school', label: 'High School', type: 'text' },
    { id: 'high_school_year', label: 'Year Graduated from High School', type: 'text' },
    { id: 'college', label: 'College', type: 'text' },
    { id: 'college_year', label: 'Year Graduated from College', type: 'text' },
    { id: 'degree', label: 'Degree Earned', type: 'text' },
    { id: 'graduate_school', label: 'Graduate School', type: 'text' },
    { id: 'graduate_school_year', label: 'Year Graduated from Graduate School', type: 'text' },
    { id: 'graduate_degree', label: 'Graduate Degree Earned', type: 'text' }
  ];

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.autoFillForm();
  }

  goBack() {
    this.router.navigate(['/admission/dashboard/choices']);
  }

  showTab(tabId: string) {
    this.currentTab = tabId;
  }

  nextTab(currentTabId: string, nextTabId: string) {
    this.showTab(nextTabId);
  }

  async autoFillForm() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) return;

    const userData = JSON.parse(userDataString);
    if (!userData) return;

    const { data, error } = await this.supabaseService.supabase
      .from('admissions')
      .select('*')
      .eq('id', userData.id)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    this.populateForm(data);
  }

  populateForm(data: any) {
    this.formData = data;
  }

  handleFileInput(event: Event, fieldId: string) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.formData[fieldId] = input.files[0];
    }
  }

  async handleSubmit() {
    const id = this.formData.id;

    const { error } = await this.supabaseService.supabase
      .from('admissions')
      .upsert(this.formData)
      .eq('id', id);

    if (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
      return;
    }

    localStorage.setItem('userData', JSON.stringify(this.formData));
    this.showSuccessModal();
  }

  showSuccessModal() {
    this.showModal = true;
    setTimeout(() => {
      this.showModal = false;
      this.router.navigate(['/admission/dashboard/choices']);
    }, 3000);
  }
}
