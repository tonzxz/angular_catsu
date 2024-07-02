import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupabaseService } from '../../../supabase.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  @ViewChild('container', { static: true })
  container!: ElementRef;
  currentStep: number = 0;
  modalVisible: boolean = false;
  agreeCheckbox: boolean = false;

  // Form data properties
  firstName!: string;
  middleName!: string;
  lastName!: string;
  address!: string;
  course!: string;
  year!: string;
  section!: string;
  lastSchool!: string;
  email!: string;
  reEmail!: string;
  contactNumber!: string;
  paymentStatus!: string;
  scholarship!: string;

  // File upload names
  cbcFileName: string = 'No file chosen';
  chestXrayFileName: string = 'No file chosen';
  drugTestFileName: string = 'No file chosen';
  reportCardFileName: string = 'No file chosen';
  medicalCertificateFileName: string = 'No file chosen';
  goodMoralCertificateFileName: string = 'No file chosen';
  alsCertificateFileName: string = 'No file chosen';
  transferCertificateFileName: string = 'No file chosen';
  birthCertificateFileName: string = 'No file chosen';
  graduationCertificateFileName: string = 'No file chosen';
  picturesFileName: string = 'No file chosen';
  eSignatureFileName: string = 'No file chosen';

  confirmSubmit: { disabled: boolean } = { disabled: true };

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.showStep(this.currentStep);
  }

  showStep(step: number) {
    this.currentStep = step;
    const container = this.container.nativeElement;

    if (step % 2 === 1) {
      container.classList.add('switch');
    } else {
      container.classList.remove('switch');
    }
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      this.showStep(this.currentStep + 1);
    }
  }

  previousStep() {
    this.showStep(this.currentStep - 1);
  }

  onFileChange(event: Event, fileNameVar: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      (this as any)[fileNameVar + 'FileName'] = input.files[0].name;
    } else {
      (this as any)[fileNameVar + 'FileName'] = 'No file chosen';
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.email !== this.reEmail) {
      alert('Email addresses do not match');
    } else {
      this.modalVisible = true; // Show the modal
    }
  }

  closeModal() {
    this.modalVisible = false; // Hide the modal
  }

  async confirmSubmission() {
    this.modalVisible = false; // Hide the modal
    await this.saveFormDataToSupabase();
    location.reload(); // Reload the page after submission
  }

  validateStep(step: number): boolean {
    
    const inputs = Array.from(document.querySelectorAll(`#step${step + 1} input, #step${step + 1} select`));
    for (const input of inputs) {
      const previousElement = input.previousElementSibling as HTMLElement;
      if (input instanceof HTMLInputElement && input.type === 'file' && input.files && input.files.length === 0) {
        alert(`Please upload a file for ${previousElement?.textContent}`);
        return false;
      } else if (input instanceof HTMLInputElement && input.type !== 'file' && !input.value) {
        alert(`Please fill out the ${previousElement?.textContent} field`);
        return false;
      } else if (input instanceof HTMLSelectElement && !input.value) {
        alert(`Please select a ${previousElement?.textContent}`);
        return false;
      }
    }
    return true;
  }

  async saveFormDataToSupabase() {
    console.log('is this working?')
    const firstName = this.firstName;
    const middleName = this.middleName;
    const lastName = this.lastName;
    const course = this.course;
    const year = this.year;
    const section = this.section;
    const lastSchool = this.lastSchool;
    const email = this.email;
    const address = this.address;
    const contactNumber = this.contactNumber;
    const paymentStatus = this.paymentStatus === 'paid';
    const scholarship = this.scholarship;

    const fileUploads = [
      { bucket: 'birth_certificates', file: (document.getElementById('birthCertificate') as HTMLInputElement).files![0] },
      { bucket: 'graduation_certificates', file: (document.getElementById('graduationCertificate') as HTMLInputElement).files![0] },
      { bucket: 'pictures', file: (document.getElementById('pictures') as HTMLInputElement).files![0] },
      { bucket: 'signatures', file: (document.getElementById('eSignature') as HTMLInputElement).files![0] },
      { bucket: 'cbc', file: (document.getElementById('cbc') as HTMLInputElement).files![0] },
      { bucket: 'chest_xrays', file: (document.getElementById('chestXray') as HTMLInputElement).files![0] },
      { bucket: 'drug_tests', file: (document.getElementById('drugTest') as HTMLInputElement).files![0] },
      { bucket: 'report_cards', file: (document.getElementById('reportCard') as HTMLInputElement).files![0] },
      { bucket: 'medical_certificates', file: (document.getElementById('medicalCertificate') as HTMLInputElement).files![0] },
      { bucket: 'good_moral_certificates', file: (document.getElementById('goodMoralCertificate') as HTMLInputElement).files![0] },
      { bucket: 'als_certificates', file: (document.getElementById('alsCertificate') as HTMLInputElement).files![0] },
      { bucket: 'transfer_certificates', file: (document.getElementById('transferCertificate') as HTMLInputElement).files![0] }
    ];

    const uploadedUrls: { [key: string]: string } = {};
    let failedUploads = 0;

    for (const { bucket, file } of fileUploads) {
      const url = await this.uploadFileToSupabaseStorage(bucket, file);
      if (url) {
        uploadedUrls[bucket] = url;
      } else {
        failedUploads++;
        console.error(`Failed to upload file to ${bucket}`);
      }
    }

    if (failedUploads > 0) {
      console.error(`${failedUploads} file(s) failed to upload. Please check and try again.`);
      alert(`${failedUploads} file(s) failed to upload. Please check and try again.`);
      return;
    }

    console.log({
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      course: course,
      section: section,
      year: year,
      last_school: lastSchool,
      email: email,
      address: address,
      contact_number: contactNumber,
      payment_status: paymentStatus,
      scholarship: scholarship,
      birth_certificate_url: uploadedUrls['birth_certificates'],
      graduation_certificate_url: uploadedUrls['graduation_certificates'],
      pictures_url: uploadedUrls['pictures'],
      e_signature_url: uploadedUrls['signatures'],
      cbc_url: uploadedUrls['cbc'],
      chest_xray_url: uploadedUrls['chest_xrays'],
      drug_test_url: uploadedUrls['drug_tests'],
      report_card_url: uploadedUrls['report_cards'],
      medical_certificate_url: uploadedUrls['medical_certificates'],
      good_moral_certificate_url: uploadedUrls['good_moral_certificates'],
      als_certificate_url: uploadedUrls['als_certificates'],
      transfer_certificate_url: uploadedUrls['transfer_certificates'],
    })

    try {
      const { data, error } = await this.supabaseService.supabase
        .from('enrollment_data')
        .insert([
          {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            course: course,
            section: section,
            year: year,
            last_school: lastSchool,
            email: email,
            address: address,
            contact_number: contactNumber,
            payment_status: paymentStatus,
            scholarship: scholarship,
            birth_certificate_url: uploadedUrls['birth_certificates'],
            graduation_certificate_url: uploadedUrls['graduation_certificates'],
            pictures_url: uploadedUrls['pictures'],
            e_signature_url: uploadedUrls['signatures'],
            cbc_url: uploadedUrls['cbc'],
            chest_xray_url: uploadedUrls['chest_xrays'],
            drug_test_url: uploadedUrls['drug_tests'],
            report_card_url: uploadedUrls['report_cards'],
            medical_certificate_url: uploadedUrls['medical_certificates'],
            good_moral_certificate_url: uploadedUrls['good_moral_certificates'],
            als_certificate_url: uploadedUrls['als_certificates'],
            transfer_certificate_url: uploadedUrls['transfer_certificates'],
          },
        ]);

      if (error) {
        console.error('Error inserting data:', error);
        alert('Error submitting form. Please try again.');
      } else {
        console.log('Data inserted successfully:', data);
        alert('Enrollment form submitted successfully!');
        location.reload(); // Reload the page after successful submission
      }
    } catch (e) {
      console.error('Unexpected error:', e);
      alert('An unexpected error occurred. Please try again.');
    }
  }

  async uploadFileToSupabaseStorage(bucket: string, file: File) {
    if (!file || !(file instanceof File)) {
      console.error(`Invalid file object for bucket: ${bucket}`);
      return null;
    }

    const fileName = `${Date.now()}_${file.name}`;
    console.log(`Attempting to upload file: ${fileName} to bucket: ${bucket}`);
    console.log(`File details: name=${file.name}, size=${file.size}, type=${file.type}`);

    try {
      const { data, error } = await this.supabaseService.supabase.storage.from(bucket).upload(fileName, file);

      if (error) {
        console.error(`Error uploading ${file.name} to bucket ${bucket}:`, error.message);
        return null;
      }

      const publicUrl = `https://hvqvmxakmursjidtfmdj.supabase.co/storage/v1/object/public/${bucket}/${fileName}`;
      console.log(`Public URL constructed:`, publicUrl);
      return publicUrl;
    } catch (e) {
      console.error(`Unexpected error during file upload:`, e);
      return null;
    }
  }
}