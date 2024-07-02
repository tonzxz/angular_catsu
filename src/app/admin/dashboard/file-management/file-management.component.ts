import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../supabase.service';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit {
  students: any[] = [];
  selectedStudent: any = null;
  isAdmission: boolean = true;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.fetchAdmissionStudents();
  }

  async fetchAdmissionStudents() {
    console.log("Fetching admission students...");
    this.isAdmission = true;
    const { data, error } = await this.supabaseService.supabase
      .from('admissions')
      .select('*');  // Fetch all fields

    if (error) {
      console.error('Error fetching admission students:', error);
      return;
    }

    this.students = data;
    console.log("Admission students fetched:", this.students);
  }

  async fetchEnrollmentStudents() {
    console.log("Fetching enrollment students...");
    this.isAdmission = false;
    const { data, error } = await this.supabaseService.supabase
      .from('enrollment_data')
      .select('*');  // Fetch all fields

    if (error) {
      console.error('Error fetching enrollment students:', error);
      return;
    }

    this.students = data;
    console.log("Enrollment students fetched:", this.students);
  }

  showStudentDetails(student: any) {
    console.log("Showing student details:", student);
    this.selectedStudent = student;
  }

  async updateApprovalStatus(approve: boolean) {
    if (!this.selectedStudent) return;

    console.log(`Updating approval status to ${approve} for`, this.selectedStudent);
    const tableName = this.isAdmission ? 'admissions' : 'enrollment_data';
    
    let updateFields: any = { approve: approve };

    if (approve && !this.isAdmission) {
      const studentNumber = this.selectedStudent.id;
      const schoolEmail = `student_${studentNumber}@catsu.edu.ph`;
      const password = 'testing';  // Ideally, this should be a randomly generated secure password

      updateFields.school_email = schoolEmail;
      updateFields.school_password = password;

      alert(`Student approved. Email: ${schoolEmail}, Password: ${password}`);
    } else if (!approve) {
      alert('Student rejected.');
    }

    const { data, error } = await this.supabaseService.supabase
      .from(tableName)
      .update(updateFields)
      .eq('id', this.selectedStudent.id);

    if (error) {
      console.error('Error updating approval status:', error);
      alert('Error updating approval status. Please try again.');
      return;
    }

    this.selectedStudent.approve = approve;
  }

  backToList() {
    console.log("Back to list");
    this.selectedStudent = null;
  }
}
