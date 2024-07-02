import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../../supabase.service'; // Update the path as necessary

@Component({
  selector: 'app-catsucet-fee',
  templateUrl: './catsucet-fee.component.html',
  styleUrls: ['./catsucet-fee.component.css']
})
export class CatsucetFeeComponent implements OnInit {
  email: string = '';
  lastName: string = '';
  course: string = '';
  selectedFile: File | null = null;
  isModalVisible: boolean = false;
  uploadedFileUrl: string | null = null;

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit() {
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
      .select('email, last_name, course, payment')
      .eq('username', userData.username)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
      return;
    }

    this.displayPaymentData(data);
  }

  displayPaymentData(data: any) {
    this.email = data.email || 'N/A';
    this.lastName = data.last_name || 'N/A';
    this.course = data.course || 'N/A';
    this.uploadedFileUrl = data.payment || null;
  }

  goBack() {
    this.router.navigate(['/admission/dashboard']); // Change this to your main page route
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (!this.selectedFile) {
      alert('No file selected.');
    }
  }

  async uploadImage() {
    if (!this.selectedFile) {
      alert('No file selected.');
      return;
    }

    const { data, error } = await this.supabaseService.supabase.storage
      .from('payment')
      .upload(`public/${this.selectedFile.name}`, this.selectedFile);

    if (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      return;
    }

    const imageUrl = data?.path;
    await this.saveImageUrl(imageUrl);
  }

  async saveImageUrl(imageUrl: string | undefined) {
    if (!imageUrl) {
      alert('Image URL is not available.');
      return;
    }

    const fullUrl = `https://hvqvmxakmursjidtfmdj.supabase.co/storage/v1/object/public/payment/${imageUrl}`;

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
      .update({ payment: fullUrl })
      .eq('username', userData.username);

    if (error) {
      console.error('Error saving image URL:', error);
      alert('Error saving image URL. Please try again.');
      return;
    }

    this.uploadedFileUrl = fullUrl;
    this.isModalVisible = true; // Show modal
  }

  closeModal() {
    this.isModalVisible = false; // Hide modal
  }
}
