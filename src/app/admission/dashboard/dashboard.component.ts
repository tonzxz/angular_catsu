




// import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
// import { SupabaseService } from '../../supabase.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-admission-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'],
// })
// export class AdmissionDashboardComponent implements AfterViewInit {
//   @ViewChild('formContainer', { static: true }) formContainer!: ElementRef;
//   @ViewChild('container', { static: true }) container!: ElementRef;

//   constructor(private supabaseService: SupabaseService, private renderer: Renderer2, private router: Router) {}

//   ngAfterViewInit() {
//     this.initEventListeners();
//   }

//   initEventListeners() {
//     const loginButton = this.container.nativeElement.querySelector('#login-button');
//     if (loginButton) {
//       this.renderer.listen(loginButton, 'click', () => this.showLoginForm());
//     }

//     const dashboardGoButton = this.container.nativeElement.querySelector('#dashboard-go');
//     if (dashboardGoButton) {
//       this.renderer.listen(dashboardGoButton, 'click', () => {
//         this.handleDashboardGoClick();
//       });
//     }

//     // Initialize form listeners if form is already present
//     const formElement = this.formContainer.nativeElement.querySelector('form');
//     if (formElement) {
//       this.renderer.listen(formElement, 'submit',  (event) => {
//         this.handleInitialSubmit(event, formElement.id.split('-')[0] as 'elementary' | 'junior' | 'senior' | 'higher');
//       });
//     }

//     const applicantTypeElement = this.formContainer.nativeElement.querySelector('#applicant-type');
//     if (applicantTypeElement) {
//       this.renderer.listen(applicantTypeElement, 'change', () => this.showCourses());
//     }
//   }

//   async handleDashboardGoClick() {
//     const lockAcquired = await this.supabaseService.acquireLock();
//     if (!lockAcquired) {
//       return;
//     }
    
//     try {
//       const usernameInput = this.container.nativeElement.querySelector('#username') as HTMLInputElement;
//       const passwordInput = this.container.nativeElement.querySelector('#password') as HTMLInputElement;

//       if (usernameInput && passwordInput) {
//         const username = usernameInput.value;
//         const password = passwordInput.value;

//         const { data, error } = await this.supabaseService.supabase
//           .from('admissions')
//           .select('*')
//           .eq('username', username)
//           .eq('password', password)
//           .single();

//         if (error) {
//           alert('Login failed. Please check your credentials and try again.');
//           return;
//         }

//         localStorage.setItem('userData', JSON.stringify(data));
//         this.router.navigate(['/admission/dashboard/choices']);
//       }
//     } finally {
//       this.supabaseService.releaseLock();
//     }
//   }

//   async handleInitialSubmit(event: Event, formType: 'elementary' | 'junior' | 'senior' | 'higher'): Promise<void> {
//     const lockAcquired = await this.supabaseService.acquireLock();
//     if (!lockAcquired) {
//       return;
//     }

//     event.preventDefault();

//     try {
//       const form = event.target as HTMLFormElement;
//       const formData = new FormData(form);
//       const data: any = { admission_type: formType };
//       formData.forEach((value, key) => {
//         data[key] = value;
//       });

//       const username = this.generateUsername();
//       const password = this.generatePassword();

//       data.username = username;
//       data.password = password;

//       const { error } = await this.supabaseService.supabase.from('admissions').insert(data);
//       if (error) {
//         console.error('Error saving data:', error);
//         return;
//       }

//       this.container.nativeElement.innerHTML = `
//         <div class="thank-you-message">
//           <img src="assets/catsu.png" alt="Catanduanes State University" class="school-image mx-auto w-24 mb-4">
//           <h1 class="text-2xl font-bold text-center mb-2">Catanduanes State University</h1>
//           <p class="text-center mb-4">We appreciate your interest in applying with us.<br>
//           Please save your username and password.</p>
//           <p class="text-center">Username: ${username}</p>
//           <p class="text-center">Password: ${password}</p>
//           <button id="login-button" type="button" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">Login</button>
//         </div>
//       `;

//       this.initEventListeners();
//     } finally {
//       this.supabaseService.releaseLock();
//     }
//   }

//   generateUsername() {
//     return 'user' + Math.floor(Math.random() * 10000);
//   }

//   generatePassword() {
//     return Math.random().toString(36).slice(-8);
//   }

//   showCourses() {
//     const applicantType = (this.container.nativeElement.querySelector('#applicant-type') as HTMLSelectElement).value;
//     const courseSelect = this.container.nativeElement.querySelector('#course') as HTMLSelectElement;
//     courseSelect.innerHTML = '';

//     if (applicantType.includes('undergraduate')) {
//       courseSelect.innerHTML = `
//       <optgroup label="Undergraduate Courses">
//       <option value="bs-civil-eng">Bachelor of Science in Civil Engineering</option>
//       <option value="bs-comp-eng">Bachelor of Science in Computer Engineering</option>
//       <option value="bs-arch">Bachelor of Science in Architecture</option>
//       <option value="bs-bio">Bachelor of Science in Biology</option>
//       <option value="bs-env-sci">Bachelor of Science in Environmental Science</option>
//       <option value="bs-math">Bachelor of Science in Mathematics</option>
//       <option value="ba-pol-sci">Bachelor of Arts in Political Science</option>
//       <option value="ba-econ">Bachelor of Arts in Economics</option>
//       <option value="bpa">Bachelor of Public Administration</option>
//       <option value="ba-eng-lang">Bachelor of Arts in English Language</option>
//       <option value="bs-accountancy">Bachelor of Science in Accountancy</option>
//       <option value="bs-ais">Bachelor of Science in Accounting Information System</option>
//       <option value="bs-ba-fm">Bachelor of Science in Business Administration - Major in Financial Management</option>
//       <option value="bs-ba-hrdm">Bachelor of Science in Business Administration - Major in Human Resource Development Management</option>
//       <option value="bs-ba-marketing">Bachelor of Science in Business Administration - Major in Marketing Management</option>
//       <option value="bs-entrepreneurship">Bachelor of Science in Entrepreneurship</option>
//       <option value="bs-internal-auditing">Bachelor of Science in Internal Auditing</option>
//       <option value="bs-office-admin">Bachelor of Science in Office Administration</option>
//       <option value="bs-nursing">Bachelor of Science in Nursing</option>
//       <option value="bs-nutrition-dietetics">Bachelor of Science in Nutrition and Dietetics</option>
//       <option value="bs-industrial-tech-auto">Laddered Bachelor of Science in Industrial Technology - Major in Automotive</option>
//       <option value="bs-industrial-tech-drafting">Laddered Bachelor of Science in Industrial Technology - Major in Drafting</option>
//       <option value="bs-industrial-tech-electrical">Laddered Bachelor of Science in Industrial Technology - Major in Electrical</option>
//       <option value="bs-industrial-tech-electronics">Laddered Bachelor of Science in Industrial Technology - Major in Electronics</option>
//       <option value="bs-industrial-tech-food">Laddered Bachelor of Science in Industrial Technology - Major in Food and Service Management</option>
//       <option value="bs-industrial-tech-garments">Laddered Bachelor of Science in Industrial Technology - Major in Garments, Fashion and Design</option>
//       <option value="bs-industrial-tech-mechanical">Laddered Bachelor of Science in Industrial Technology - Major in Mechanical</option>
//       <option value="bs-agriculture-animal">Bachelor of Science in Agriculture - Major in Animal Husbandry</option>
//       <option value="bs-agriculture-crop">Bachelor of Science in Agriculture - Major in Crop Science</option>
//       <option value="bs-agri-business">Bachelor of Science in Agri-Business</option>
//       <option value="bs-fisheries">Bachelor of Science in Fisheries</option>
//       <option value="cert-agri-sci">Certificate in Agricultural Science</option>
//       <option value="bs-elem-edu">Bachelor of Elementary Education</option>
//       <option value="bs-secondary-edu-eng">Bachelor of Science in Secondary Education - Major in English</option>
//       <option value="bs-secondary-edu-fil">Bachelor of Science in Secondary Education - Major in Filipino</option>
//       <option value="bs-secondary-edu-math">Bachelor of Science in Secondary Education - Major in Mathematics</option>
//       <option value="bs-secondary-edu-bio">Bachelor of Science in Secondary Education - Major in Biological Science</option>
//       <option value="bs-secondary-edu-soc">Bachelor of Science in Secondary Education - Major in Social Studies</option>
//       <option value="bs-secondary-edu-mape">Bachelor of Science in Secondary Education - Major in Music, Arts and Physical Education</option>
//       <option value="bs-tech-voc-te-electronics">Bachelor of Science in Technical-Vocational Teacher Education - Major in Electronics Technology</option>
//       <option value="bs-tech-voc-te-food">Bachelor of Science in Technical-Vocational Teacher Education - Major in Food and Service Management</option>
//       <option value="bs-culture-arts-edu">Bachelor of Science in Culture and Arts Education</option>
//       <option value="bs-phys-edu">Bachelor of Science in Physical Education</option>
//       <option value="bs-info-systems">Bachelor of Science in Information Systems</option>
//       <option value="bs-info-tech">Bachelor of Science in Information Technology</option>
//       <option value="bs-comp-sci">Bachelor of Science in Computer Science</option>
//       <option value="bs-entertainment-multimedia-game">Bachelor of Science in Entertainment and Multimedia Computing - Major in Game Development</option>
//       <option value="bs-entertainment-multimedia-digital">Bachelor of Science in Entertainment and Multimedia Computing - Major in Digital Animation</option>
//       <option value="bs-library-info-sci">Bachelor of Science in Library in Information Science</option>
//     </optgroup>
//       `;
//     } else if (applicantType.includes('graduate')) {
//       courseSelect.innerHTML = `
//       <optgroup label="Graduate School Courses">
//       <option value="phd-educ-management">Doctor of Philosophy in Educational Management</option>
//       <option value="doctor-educ-management">Doctor of Education Major in Educational Management</option>
//       <option value="ma-educ-management">Master of Arts in Educational Management</option>
//       <option value="ma-filipino-edu">Master of Arts in Filipino Education</option>
//       <option value="ma-math-edu">Master of Arts in Mathematics Education</option>
//       <option value="ma-guidance-counseling">Master of Arts in Guidance and Counseling</option>
//       <option value="ma-english">Master of Arts in English</option>
//       <option value="ma-nursing">Master of Arts in Nursing</option>
//       <option value="ma-teaching-bio">Master of Arts in Teaching Biology</option>
//       <option value="ma-teaching-chem">Master of Arts in Teaching Chemistry</option>
//       <option value="ma-teaching-physics">Master of Arts in Teaching Physics</option>
//       <option value="ma-agricultural-edu">Master of Arts in Agricultural Education</option>
//       <option value="mpa">Master of Public Administration</option>
//       <option value="mba">Master in Business Administration</option>
//       <option value="ma-industrial-edu">Master of Arts in Industrial Education</option>
//       <option value="diploma-educ-management">Diploma in Educational Management</option>
//       <option value="diploma-public-admin">Diploma in Public Administration</option>
//     </optgroup>
//       `;
//     }
//   }

//   updateButtonSelection(selectedType: string) {
//     const buttons = this.container.nativeElement.querySelectorAll('.buttons button');
//     buttons.forEach((button: HTMLButtonElement) => {
//       if (button.textContent && button.textContent.toLowerCase().includes(selectedType)) {
//         button.classList.add('selected');
//       } else {
//         button.classList.remove('selected');
//       }
//     });
//   }

//   showLoginForm(event?: Event) {
//     event?.preventDefault();
//     this.container.nativeElement.innerHTML = `
//       <img src="assets/catsu.png" alt="Catanduanes State University" class="school-image mx-auto w-24 mb-4">
//       <h1 class="text-2xl font-bold text-center mb-2">Catanduanes State University</h1>
//       <h2 class="text-center mb-4">Online Admission System</h2>
//       <label class="block text-sm font-medium" for="username">Username:</label>
//       <input type="text" id="username" name="username" class="w-full px-4 py-2 border rounded-lg mb-4">
//       <label class="block text-sm font-medium" for="password">Password:</label>
//       <input type="password" id="password" name="password" class="w-full px-4 py-2 border rounded-lg mb-4">
//       <button id="dashboard-go" type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
//     `;

//     this.initEventListeners();
//   }

//   showForm(formType: 'elementary' | 'junior' | 'senior' | 'higher') {
//     const forms = {
//       elementary: `
//         <form id="elementary-form" class="space-y-4">
//           <label for="given-name" class="block text-sm font-medium">Given Name:</label>
//           <input type="text" id="given-name" name="given_name" class="w-full px-4 py-2 border rounded-lg">
//           <label for="middle-name" class="block text-sm font-medium">Middle Name:</label>
//           <input type="text" id="middle-name" name="middle_name" class="w-full px-4 py-2 border rounded-lg">
//           <label for="last-name" class="block text-sm font-medium">Last Name:</label>
//           <input type="text" id="last-name" name="last_name" class="w-full px-4 py-2 border rounded-lg">
//           <label for="mother-name" class="block text-sm font-medium">Mother's Name:</label>
//           <input type="text" id="mother-name" name="mother_name" class="w-full px-4 py-2 border rounded-lg">
//           <label for="mother-occupation" class="block text-sm font-medium">Mother's Occupation:</label>
//           <input type="text" id="mother-occupation" name="mother_occupation" class="w-full px-4 py-2 border rounded-lg">
//           <label for="contact-number" class="block text-sm font-medium">Contact Number:</label>
//           <input type="text" id="contact-number" name="contact_number" class="w-full px-4 py-2 border rounded-lg">
//           <label for="guardian" class="block text-sm font-medium">Guardian:</label>
//           <input type="text" id="guardian" name="guardian" class="w-full px-4 py-2 border rounded-lg">
//           <label for="address" class="block text-sm font-medium">Address:</label>
//           <textarea id="address" name="address" class="w-full px-4 py-2 border rounded-lg"></textarea>
//           <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button
//           </form>  `,
//           junior: `
//             <form id="junior-form" class="space-y-4">
//               <label for="given-name" class="block text-sm font-medium">Given Name:</label>
//               <input type="text" id="given-name" name="given_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="middle-name" class="block text-sm font-medium">Middle Name:</label>
//               <input type="text" id="middle-name" name="middle_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="last-name" class="block text-sm font-medium">Last Name:</label>
//               <input type="text" id="last-name" name="last_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="previous-school" class="block text-sm font-medium">Previous School:</label>
//               <input type="text" id="previous-school" name="previous_school" class="w-full px-4 py-2 border rounded-lg">
//               <label for="mother-name" class="block text-sm font-medium">Mother's Name:</label>
//               <input type="text" id="mother-name" name="mother_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="mother-occupation" class="block text-sm font-medium">Mother's Occupation:</label>
//               <input type="text" id="mother-occupation" name="mother_occupation" class="w-full px-4 py-2 border rounded-lg">
//               <label for="contact-number" class="block text-sm font-medium">Contact Number:</label>
//               <input type="text" id="contact-number" name="contact_number" class="w-full px-4 py-2 border rounded-lg">
//               <label for="guardian" class="block text-sm font-medium">Guardian:</label>
//               <input type="text" id="guardian" name="guardian" class="w-full px-4 py-2 border rounded-lg">
//               <label for="address" class="block text-sm font-medium">Address:</label>
//               <textarea id="address" name="address" class="w-full px-4 py-2 border rounded-lg"></textarea>
//               <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
//             </form>
//           `,
//           senior: `
//             <form id="senior-form" class="space-y-4">
//               <label for="given-name" class="block text-sm font-medium">Given Name:</label>
//               <input type="text" id="given-name" name="given_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="middle-name" class="block text-sm font-medium">Middle Name:</label>
//               <input type="text" id="middle-name" name="middle_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="last-name" class="block text-sm font-medium">Last Name:</label>
//               <input type="text" id="last-name" name="last_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="mother-name" class="block text-sm font-medium">Mother's Name:</label>
//               <input type="text" id="mother-name" name="mother_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="mother-occupation" class="block text-sm font-medium">Mother's Occupation:</label>
//               <input type="text" id="mother-occupation" name="mother_occupation" class="w-full px-4 py-2 border rounded-lg">
//               <label for="contact-number" class="block text-sm font-medium">Contact Number:</label>
//               <input type="text" id="contact-number" name="contact_number" class="w-full px-4 py-2 border rounded-lg">
//               <label for="guardian" class="block text-sm font-medium">Guardian:</label>
//               <input type="text" id="guardian" name="guardian" class="w-full px-4 py-2 border rounded-lg">
//               <label for="address" class="block text-sm font-medium">Address:</label>
//               <textarea id="address" name="address" class="w-full px-4 py-2 border rounded-lg"></textarea>
//               <label for="strand" class="block text-sm font-medium">Strand:</label>
//               <select id="strand" name="strand" class="w-full px-4 py-2 border rounded-lg">
//                 <option value="" disabled selected>Choose your Strand</option>
//                 <option value="abm">ABM (Accountancy, Business and Management)</option>
//                 <option value="humms">HUMMS (Humanities and Social Science)</option>
//                 <option value="stem">STEM (Science, Technology, Engineering and Mathematics)</option>
//               </select>
//               <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
//             </form>
//           `,
//           higher: `
//             <form id="higher-form" class="space-y-4">
//               <label for="applicant-type" class="block text-sm font-medium">Applicant Type:</label>
//               <select id="applicant-type" name="applicant_type" class="w-full px-4 py-2 border rounded-lg">
//                 <option value="" disabled selected>Choose your applicant type</option>
//                 <option value="undergraduate">Freshman Undergraduate</option>
//                 <option value="graduate">Freshman Graduate Studies</option>
//                 <option value="undergraduate">Transferee Undergraduate</option>
//                 <option value="graduate">Transferee Graduate Studies</option>
//               </select>
//               <label for="given-name" class="block text-sm font-medium">Given Name:</label>
//               <input type="text" id="given-name" name="given_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="middle-name" class="block text-sm font-medium">Middle Name:</label>
//               <input type="text" id="middle-name" name="middle_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="last-name" class="block text-sm font-medium">Last Name:</label>
//               <input type="text" id="last-name" name="last_name" class="w-full px-4 py-2 border rounded-lg">
//               <label for="school" class="block text-sm font-medium">School:</label>
//               <input type="text" id="school" name="school" class="w-full px-4 py-2 border rounded-lg">
//               <label for="email" class="block text-sm font-medium">Email Address:</label>
//               <input type="email" id="email" name="email" class="w-full px-4 py-2 border rounded-lg">
//               <label for="contact-number" class="block text-sm font-medium">Contact Number:</label>
//               <input type="text" id="contact-number" name="contact_number" class="w-full px-4 py-2 border rounded-lg">
//               <label for="address" class="block text-sm font-medium">Address:</label>
//               <textarea id="address" name="address" class="w-full px-4 py-2 border rounded-lg"></textarea>
//               <label for="course" class="block text-sm font-medium">Course:</label>
//               <select id="course" name="course" class="w-full px-4 py-2 border rounded-lg">
//                 <option value="" disabled selected>Select a course</option>
//               </select>
//               <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
//             </form>
//           `
//         };
        
//         this.formContainer.nativeElement.innerHTML = forms[formType];
//         this.updateButtonSelection(formType);
//         this.initFormListeners();
//       }

//       initFormListeners() {
//       const formElement = this.formContainer.nativeElement.querySelector('form');
//       if (formElement) {
//       this.renderer.listen(formElement, 'submit', (event) => {
//       this.handleInitialSubmit(event, formElement.id.split('-')[0] as 'elementary' | 'junior' | 'senior' | 'higher');
//       });
//       }
//       }
//       }
      
                  
import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { SupabaseService } from '../../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admission-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class AdmissionDashboardComponent implements AfterViewInit {
  @ViewChild('formContainer', { static: true }) formContainer!: ElementRef;
  @ViewChild('container', { static: true }) container!: ElementRef;

  constructor(private supabaseService: SupabaseService, private renderer: Renderer2, private router: Router) {}

  ngAfterViewInit() {
    this.initEventListeners();
  }

  initEventListeners() {
    const loginButton = this.container.nativeElement.querySelector('#login-button');
    if (loginButton) {
      this.renderer.listen(loginButton, 'click', () => this.showLoginForm());
    }

    const dashboardGoButton = this.container.nativeElement.querySelector('#dashboard-go');
    if (dashboardGoButton) {
      this.renderer.listen(dashboardGoButton, 'click', () => {
        this.handleDashboardGoClick();
      });
    }

    // Initialize form listeners if form is already present
    const formElement = this.formContainer.nativeElement.querySelector('form');
    if (formElement) {
      this.renderer.listen(formElement, 'submit',  (event) => {
        this.handleInitialSubmit(event, formElement.id.split('-')[0] as 'elementary' | 'junior' | 'senior' | 'higher');
      });
    }

    const applicantTypeElement = this.formContainer.nativeElement.querySelector('#applicant-type');
    if (applicantTypeElement) {
      this.renderer.listen(applicantTypeElement, 'change', () => this.showCourses());
    }
  }

  async handleDashboardGoClick() {
    const lockAcquired = await this.supabaseService.acquireLock();
    if (!lockAcquired) {
      return;
    }

    try {
      const usernameInput = this.container.nativeElement.querySelector('#username') as HTMLInputElement;
      const passwordInput = this.container.nativeElement.querySelector('#password') as HTMLInputElement;

      if (usernameInput && passwordInput) {
        const username = usernameInput.value;
        const password = passwordInput.value;

        const { data, error } = await this.supabaseService.supabase
          .from('admissions')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (error) {
          alert('Login failed. Please check your credentials and try again.');
          return;
        }

        localStorage.setItem('userData', JSON.stringify(data));
        this.router.navigate(['/admission/dashboard/choices']);
      }
    } finally {
      this.supabaseService.releaseLock();
    }
  }

  async handleInitialSubmit(event: Event, formType: 'elementary' | 'junior' | 'senior' | 'higher'): Promise<void> {
    const lockAcquired = await this.supabaseService.acquireLock();
    if (!lockAcquired) {
      return;
    }

    event.preventDefault();

    try {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const data: any = { admission_type: formType };
      formData.forEach((value, key) => {
        data[key] = value;
      });

      const username = this.generateUsername();
      const password = this.generatePassword();

      data.username = username;
      data.password = password;

      const { error } = await this.supabaseService.supabase.from('admissions').insert(data);
      if (error) {
        console.error('Error saving data:', error);
        return;
      }

      this.container.nativeElement.innerHTML = `
        <div class="thank-you-message">
          <img src="assets/catsu.png" alt="Catanduanes State University" class="school-image mx-auto w-24 mb-4">
          <h1 class="text-2xl font-bold text-center mb-2">Catanduanes State University</h1>
          <p class="text-center mb-4">We appreciate your interest in applying with us.<br>
          Please save your username and password.</p>
          <p class="text-center">Username: ${username}</p>
          <p class="text-center">Password: ${password}</p>
          <button id="login-button" type="button" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">Login</button>
        </div>
      `;

      this.initEventListeners();
    } finally {
      this.supabaseService.releaseLock();
    }
  }

  generateUsername() {
    return 'user' + Math.floor(Math.random() * 10000);
  }

  generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  showCourses() {
    const applicantType = (this.container.nativeElement.querySelector('#applicant-type') as HTMLSelectElement).value;
    const courseSelect = this.container.nativeElement.querySelector('#course') as HTMLSelectElement;
    courseSelect.innerHTML = '';

    if (applicantType === 'freshman-undergraduate' || applicantType === 'transferee-undergraduate') {
      courseSelect.innerHTML = `
        <optgroup label="Undergraduate Courses">
          <option value="bs-civil-eng">Bachelor of Science in Civil Engineering</option>
          <option value="bs-comp-eng">Bachelor of Science in Computer Engineering</option>
          <option value="bs-arch">Bachelor of Science in Architecture</option>
          <option value="bs-bio">Bachelor of Science in Biology</option>
          <option value="bs-env-sci">Bachelor of Science in Environmental Science</option>
          <option value="bs-math">Bachelor of Science in Mathematics</option>
          <option value="ba-pol-sci">Bachelor of Arts in Political Science</option>
          <option value="ba-econ">Bachelor of Arts in Economics</option>
          <option value="bpa">Bachelor of Public Administration</option>
          <option value="ba-eng-lang">Bachelor of Arts in English Language</option>
          <option value="bs-accountancy">Bachelor of Science in Accountancy</option>
          <option value="bs-ais">Bachelor of Science in Accounting Information System</option>
          <option value="bs-ba-fm">Bachelor of Science in Business Administration - Major in Financial Management</option>
          <option value="bs-ba-hrdm">Bachelor of Science in Business Administration - Major in Human Resource Development Management</option>
          <option value="bs-ba-marketing">Bachelor of Science in Business Administration - Major in Marketing Management</option>
          <option value="bs-entrepreneurship">Bachelor of Science in Entrepreneurship</option>
          <option value="bs-internal-auditing">Bachelor of Science in Internal Auditing</option>
          <option value="bs-office-admin">Bachelor of Science in Office Administration</option>
          <option value="bs-nursing">Bachelor of Science in Nursing</option>
          <option value="bs-nutrition-dietetics">Bachelor of Science in Nutrition and Dietetics</option>
          <option value="bs-industrial-tech-auto">Laddered Bachelor of Science in Industrial Technology - Major in Automotive</option>
          <option value="bs-industrial-tech-drafting">Laddered Bachelor of Science in Industrial Technology - Major in Drafting</option>
          <option value="bs-industrial-tech-electrical">Laddered Bachelor of Science in Industrial Technology - Major in Electrical</option>
          <option value="bs-industrial-tech-electronics">Laddered Bachelor of Science in Industrial Technology - Major in Electronics</option>
          <option value="bs-industrial-tech-food">Laddered Bachelor of Science in Industrial Technology - Major in Food and Service Management</option>
          <option value="bs-industrial-tech-garments">Laddered Bachelor of Science in Industrial Technology - Major in Garments, Fashion and Design</option>
          <option value="bs-industrial-tech-mechanical">Laddered Bachelor of Science in Industrial Technology - Major in Mechanical</option>
          <option value="bs-agriculture-animal">Bachelor of Science in Agriculture - Major in Animal Husbandry</option>
          <option value="bs-agriculture-crop">Bachelor of Science in Agriculture - Major in Crop Science</option>
          <option value="bs-agri-business">Bachelor of Science in Agri-Business</option>
          <option value="bs-fisheries">Bachelor of Science in Fisheries</option>
          <option value="cert-agri-sci">Certificate in Agricultural Science</option>
          <option value="bs-elem-edu">Bachelor of Elementary Education</option>
          <option value="bs-secondary-edu-eng">Bachelor of Science in Secondary Education - Major in English</option>
          <option value="bs-secondary-edu-fil">Bachelor of Science in Secondary Education - Major in Filipino</option>
          <option value="bs-secondary-edu-math">Bachelor of Science in Secondary Education - Major in Mathematics</option>
          <option value="bs-secondary-edu-bio">Bachelor of Science in Secondary Education - Major in Biological Science</option>
          <option value="bs-secondary-edu-soc">Bachelor of Science in Secondary Education - Major in Social Studies</option>
          <option value="bs-secondary-edu-mape">Bachelor of Science in Secondary Education - Major in Music, Arts and Physical Education</option>
          <option value="bs-tech-voc-te-electronics">Bachelor of Science in Technical-Vocational Teacher Education - Major in Electronics Technology</option>
          <option value="bs-tech-voc-te-food">Bachelor of Science in Technical-Vocational Teacher Education - Major in Food and Service Management</option>
          <option value="bs-culture-arts-edu">Bachelor of Science in Culture and Arts Education</option>
          <option value="bs-phys-edu">Bachelor of Science in Physical Education</option>
          <option value="bs-info-systems">Bachelor of Science in Information Systems</option>
          <option value="bs-info-tech">Bachelor of Science in Information Technology</option>
          <option value="bs-comp-sci">Bachelor of Science in Computer Science</option>
          <option value="bs-entertainment-multimedia-game">Bachelor of Science in Entertainment and Multimedia Computing - Major in Game Development</option>
          <option value="bs-entertainment-multimedia-digital">Bachelor of Science in Entertainment and Multimedia Computing - Major in Digital Animation</option>
          <option value="bs-library-info-sci">Bachelor of Science in Library in Information Science</option>
        </optgroup>
      `;
    } else if (applicantType === 'freshman-graduate' || applicantType === 'transferee-graduate') {
      courseSelect.innerHTML = `
        <optgroup label="Graduate School Courses">
          <option value="phd-educ-management">Doctor of Philosophy in Educational Management</option>
          <option value="doctor-educ-management">Doctor of Education Major in Educational Management</option>
          <option value="ma-educ-management">Master of Arts in Educational Management</option>
          <option value="ma-filipino-edu">Master of Arts in Filipino Education</option>
          <option value="ma-math-edu">Master of Arts in Mathematics Education</option>
          <option value="ma-guidance-counseling">Master of Arts in Guidance and Counseling</option>
          <option value="ma-english">Master of Arts in English</option>
          <option value="ma-nursing">Master of Arts in Nursing</option>
          <option value="ma-teaching-bio">Master of Arts in Teaching Biology</option>
          <option value="ma-teaching-chem">Master of Arts in Teaching Chemistry</option>
          <option value="ma-teaching-physics">Master of Arts in Teaching Physics</option>
          <option value="ma-agricultural-edu">Master of Arts in Agricultural Education</option>
          <option value="mpa">Master of Public Administration</option>
          <option value="mba">Master in Business Administration</option>
          <option value="ma-industrial-edu">Master of Arts in Industrial Education</option>
          <option value="diploma-educ-management">Diploma in Educational Management</option>
          <option value="diploma-public-admin">Diploma in Public Administration</option>
        </optgroup>
      `;
    }
  }

  updateButtonSelection(selectedType: string) {
    const buttons = this.container.nativeElement.querySelectorAll('.buttons button');
    buttons.forEach((button: HTMLButtonElement) => {
      if (button.textContent && button.textContent.toLowerCase().includes(selectedType)) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  }

  showLoginForm(event?: Event) {
    event?.preventDefault();
    this.container.nativeElement.innerHTML = `
      <img src="assets/catsu.png" alt="Catanduanes State University" class="school-image mx-auto w-24 mb-4">
      <h1 class="text-2xl font-bold text-center mb-2">Catanduanes State University</h1>
      <h2 class="text-center mb-4">Online Admission System</h2>
      <label class="block text-sm font-medium" for="username">Username:</label>
      <input type="text" id="username" name="username" class="w-full px-4 py-2 border rounded-lg mb-4">
      <label class="block text-sm font-medium" for="password">Password:</label>
      <input type="password" id="password" name="password" class="w-full px-4 py-2 border rounded-lg mb-4">
      <button id="dashboard-go" type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
    `;

    this.initEventListeners();
  }

  showForm(formType: 'elementary' | 'junior' | 'senior' | 'higher') {
    const forms = {
      elementary: `
        <form id="elementary-form" class="space-y-4">
          <label for="given-name" class="block text-sm font-medium">Given Name:</label>
          <input type="text" id="given-name" name="given_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="middle-name" class="block text-sm font-medium">Middle Name:</label>
          <input type="text" id="middle-name" name="middle_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="last-name" class="block text-sm font-medium">Last Name:</label>
          <input type="text" id="last-name" name="last_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="mother-name" class="block text-sm font-medium">Mother's Name:</label>
          <input type="text" id="mother-name" name="mother_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="mother-occupation" class="block text-sm font-medium">Mother's Occupation:</label>
          <input type="text" id="mother-occupation" name="mother_occupation" class="w-full px-4 py-2 border rounded-lg">
          <label for="contact-number" class="block text-sm font-medium">Contact Number:</label>
          <input type="text" id="contact-number" name="contact_number" class="w-full px-4 py-2 border rounded-lg">
          <label for="guardian" class="block text-sm font-medium">Guardian:</label>
          <input type="text" id="guardian" name="guardian" class="w-full px-4 py-2 border rounded-lg">
          <label for="address" class="block text-sm font-medium">Address:</label>
          <textarea id="address" name="address" class="w-full px-4 py-2 border rounded-lg"></textarea>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
        </form>
      `,
      junior: `
        <form id="junior-form" class="space-y-4">
          <label for="given-name" class="block text-sm font-medium">Given Name:</label>
          <input type="text" id="given-name" name="given_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="middle-name" class="block text-sm font-medium">Middle Name:</label>
          <input type="text" id="middle-name" name="middle_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="last-name" class="block text-sm font-medium">Last Name:</label>
          <input type="text" id="last-name" name="last_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="previous-school" class="block text-sm font-medium">Previous School:</label>
          <input type="text" id="previous-school" name="previous_school" class="w-full px-4 py-2 border rounded-lg">
          <label for="mother-name" class="block text-sm font-medium">Mother's Name:</label>
          <input type="text" id="mother-name" name="mother_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="mother-occupation" class="block text-sm font-medium">Mother's Occupation:</label>
          <input type="text" id="mother-occupation" name="mother_occupation" class="w-full px-4 py-2 border rounded-lg">
          <label for="contact-number" class="block text-sm font-medium">Contact Number:</label>
          <input type="text" id="contact-number" name="contact_number" class="w-full px-4 py-2 border rounded-lg">
          <label for="guardian" class="block text-sm font-medium">Guardian:</label>
          <input type="text" id="guardian" name="guardian" class="w-full px-4 py-2 border rounded-lg">
          <label for="address" class="block text-sm font-medium">Address:</label>
          <textarea id="address" name="address" class="w-full px-4 py-2 border rounded-lg"></textarea>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
        </form>
      `,
      senior: `
        <form id="senior-form" class="space-y-4">
          <label for="given-name" class="block text-sm font-medium">Given Name:</label>
          <input type="text" id="given-name" name="given_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="middle-name" class="block text-sm font-medium">Middle Name:</label>
          <input type="text" id="middle-name" name="middle_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="last-name" class="block text-sm font-medium">Last Name:</label>
          <input type="text" id="last-name" name="last_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="mother-name" class="block text-sm font-medium">Mother's Name:</label>
          <input type="text" id="mother-name" name="mother_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="mother-occupation" class="block text-sm font-medium">Mother's Occupation:</label>
          <input type="text" id="mother-occupation" name="mother_occupation" class="w-full px-4 py-2 border rounded-lg">
          <label for="contact-number" class="block text-sm font-medium">Contact Number:</label>
          <input type="text" id="contact-number" name="contact_number" class="w-full px-4 py-2 border rounded-lg">
          <label for="guardian" class="block text-sm font-medium">Guardian:</label>
          <input type="text" id="guardian" name="guardian" class="w-full px-4 py-2 border rounded-lg">
          <label for="address" class="block text-sm font-medium">Address:</label>
          <textarea id="address" name="address" class="w-full px-4 py-2 border rounded-lg"></textarea>
          <label for="strand" class="block text-sm font-medium">Strand:</label>
          <select id="strand" name="strand" class="w-full px-4 py-2 border rounded-lg">
            <option value="" disabled selected>Choose your Strand</option>
            <option value="abm">ABM (Accountancy, Business and Management)</option>
            <option value="humms">HUMMS (Humanities and Social Science)</option>
            <option value="stem">STEM (Science, Technology, Engineering and Mathematics)</option>
          </select>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
        </form>
      `,
      higher: `
        <form id="higher-form" class="space-y-4">
          <label for="applicant-type" class="block text-sm font-medium">Applicant Type:</label>
          <select id="applicant-type" name="applicant_type" class="w-full px-4 py-2 border rounded-lg">
            <option value="" disabled selected>Choose your applicant type</option>
            <option value="freshman-undergraduate">Freshman Undergraduate</option>
            <option value="freshman-graduate">Freshman Graduate Studies</option>
            <option value="transferee-undergraduate">Transferee Undergraduate</option>
            <option value="transferee-graduate">Transferee Graduate Studies</option>
          </select>
          <label for="given-name" class="block text-sm font-medium">Given Name:</label>
          <input type="text" id="given-name" name="given_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="middle-name" class="block text-sm font-medium">Middle Name:</label>
          <input type="text" id="middle-name" name="middle_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="last-name" class="block text-sm font-medium">Last Name:</label>
          <input type="text" id="last-name" name="last_name" class="w-full px-4 py-2 border rounded-lg">
          <label for="school" class="block text-sm font-medium">School:</label>
          <input type="text" id="school" name="school" class="w-full px-4 py-2 border rounded-lg">
          <label for="email" class="block text-sm font-medium">Email Address:</label>
          <input type="email" id="email" name="email" class="w-full px-4 py-2 border rounded-lg">
          <label for="contact-number" class="block text-sm font-medium">Contact Number:</label>
          <input type="text" id="contact-number" name="contact_number" class="w-full px-4 py-2 border rounded-lg">
          <label for="address" class="block text-sm font-medium">Address:</label>
          <textarea id="address" name="address" class="w-full px-4 py-2 border rounded-lg"></textarea>
          <label for="course" class="block text-sm font-medium">Course:</label>
          <select id="course" name="course" class="w-full px-4 py-2 border rounded-lg">
            <option value="" disabled selected>Select a course</option>
          </select>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
        </form>
      `
    };

    this.formContainer.nativeElement.innerHTML = forms[formType];
    this.updateButtonSelection(formType);
    this.initFormListeners();
  }

  initFormListeners() {
    const formElement = this.formContainer.nativeElement.querySelector('form');
    if (formElement) {
      this.renderer.listen(formElement, 'submit', (event) => {
        this.handleInitialSubmit(event, formElement.id.split('-')[0] as 'elementary' | 'junior' | 'senior' | 'higher');
      });
    }

    const applicantTypeElement = this.formContainer.nativeElement.querySelector('#applicant-type');
    if (applicantTypeElement) {
      this.renderer.listen(applicantTypeElement, 'change', () => this.showCourses());
    }
  }
}

