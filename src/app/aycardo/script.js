document.addEventListener('DOMContentLoaded', function () {
    const supabaseUrl = 'https://hvqvmxakmursjidtfmdj.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cXZteGFrbXVyc2ppZHRmbWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2MDA4MjQsImV4cCI6MjAzNDE3NjgyNH0.dykJM61G-58LEnAyCUU6-irano2f4vraV8t1l8C5KZ8';
    const s = supabase.createClient(supabaseUrl, supabaseKey);

    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key:', supabaseKey.substring(0, 5) + '...');

    const form = document.getElementById('enrollmentForm');
    const sections = document.querySelectorAll('.form-section');
    const nextButtons = document.querySelectorAll('button[id^="nextStep"]');
    const backButtons = document.querySelectorAll('.backButton');
    const container = document.querySelector('.container');
    const modal = document.getElementById('consentModal');
    const closeModal = document.querySelector('.close');
    const confirmSubmit = document.getElementById('confirmSubmit');
    const agreeCheckbox = document.getElementById('agreeCheckbox');

    let currentStep = 0;

    function showStep(step) {
        sections.forEach((section, index) => {
            section.classList.toggle('hidden', index !== step);
            if (index === step) {
                section.classList.add('slide-in');
            } else {
                section.classList.remove('slide-in');
            }
        });

        if (step % 2 === 1) {
            container.classList.add('switch');
        } else {
            container.classList.remove('switch');
        }

        currentStep = step;
    }

    nextButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            if (validateStep(currentStep)) {
                showStep(index + 1);
            }
        });
    });

    backButtons.forEach((button) => {
        button.addEventListener('click', function () {
            showStep(currentStep - 1);
        });
    });

    const email = document.getElementById('email');
    const reEmail = document.getElementById('reEmail');
    const emailError = document.getElementById('emailError');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (email.value !== reEmail.value) {
            emailError.textContent = 'Email addresses do not match';
        } else {
            emailError.textContent = '';
            if (validateStep(currentStep)) {
                modal.style.display = "block"; // Show the modal
            }
        }
    });

    closeModal.onclick = function () {
        modal.style.display = "none"; // Hide the modal
    }

    agreeCheckbox.addEventListener('change', function () {
        confirmSubmit.disabled = !this.checked;
    });

    confirmSubmit.onclick = async function () {
        modal.style.display = "none"; // Hide the modal
        await saveFormDataToSupabase();
        location.reload(); // Reload the page after submission
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none"; // Hide the modal if clicked outside
        }
    }

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function () {
            const fileNameSpan = document.getElementById(`${this.id}FileName`);
            if (this.files.length > 0) {
                fileNameSpan.textContent = this.files[0].name;
            } else {
                fileNameSpan.textContent = 'No file chosen';
            }
        });
    });

    function validateStep(step) {
        const inputs = sections[step].querySelectorAll('input, select');
        for (const input of inputs) {
            if (input.type === 'file' && input.files.length === 0) {
                alert(`Please upload a file for ${input.previousElementSibling.textContent}`);
                return false;
            } else if (input.type !== 'file' && !input.value) {
                alert(`Please fill out the ${input.previousElementSibling.textContent} field`);
                return false;
            }
        }
        return true;
    }

    async function saveFormDataToSupabase() {
        const firstName = document.getElementById('firstName').value;
        const middleName = document.getElementById('middleName').value;
        const lastName = document.getElementById('lastName').value;
        const course = document.getElementById('course').value;
        const year = document.getElementById('year').value;
        const section = document.getElementById('section').value;
        const lastSchool = document.getElementById('lastSchool').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const paymentStatus = document.getElementById('paymentStatus').value === 'paid';
        const scholarship = document.getElementById('scholarship').value;

        const fileUploads = [
            { bucket: 'birth_certificates', file: document.getElementById('birthCertificate').files[0] },
            { bucket: 'graduation_certificates', file: document.getElementById('graduationCertificate').files[0] },
            { bucket: 'pictures', file: document.getElementById('pictures').files[0] },
            { bucket: 'signatures', file: document.getElementById('eSignature').files[0] },
            { bucket: 'cbc', file: document.getElementById('cbc').files[0] },
            { bucket: 'chest_xrays', file: document.getElementById('chestXray').files[0] },
            { bucket: 'drug_tests', file: document.getElementById('drugTest').files[0] },
            { bucket: 'report_cards', file: document.getElementById('reportCard').files[0] },
            { bucket: 'medical_certificates', file: document.getElementById('medicalCertificate').files[0] },
            { bucket: 'good_moral_certificates', file: document.getElementById('goodMoralCertificate').files[0] },
            { bucket: 'als_certificates', file: document.getElementById('alsCertificate').files[0] },
            { bucket: 'transfer_certificates', file: document.getElementById('transferCertificate').files[0] }
        ];

        const uploadedUrls = {};
        let failedUploads = 0;

        for (const { bucket, file } of fileUploads) {
            const url = await uploadFileToSupabaseStorage(bucket, file);
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

        try {
            const { data, error } = await s
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

    async function uploadFileToSupabaseStorage(bucket, file) {
        if (!file || !(file instanceof File)) {
            console.error(`Invalid file object for bucket: ${bucket}`);
            return null;
        }

        const fileName = `${Date.now()}_${file.name}`;
        console.log(`Attempting to upload file: ${fileName} to bucket: ${bucket}`);
        console.log(`File details: name=${file.name}, size=${file.size}, type=${file.type}`);

        try {
            const { data, error } = await s.storage.from(bucket).upload(fileName, file);

            if (error) {
                console.error(`Error uploading ${file.name} to bucket ${bucket}:`, error.message);
                return null;
            }

            const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
            console.log(`Public URL constructed:`, publicUrl);
            return publicUrl;
        } catch (e) {
            console.error(`Unexpected error during file upload:`, e);
            return null;
        }
    }

    async function checkBuckets() {
        const buckets = [
            'birth_certificates', 'graduation_certificates', 'pictures', 'signatures',
            'cbc', 'chest_xrays', 'drug_tests', 'report_cards', 'medical_certificates',
            'good_moral_certificates', 'als_certificates', 'transfer_certificates'
        ];

        for (const bucket of buckets) {
            try {
                const { data, error } = await s.storage.getBucket(bucket);
                if (error) {
                    console.error(`Error checking bucket ${bucket}:`, error);
                } else {
                    console.log(`Bucket ${bucket} exists:`, data);
                }
            } catch (e) {
                console.error(`Unexpected error checking bucket ${bucket}:`, e);
            }
        }
    }

    async function testUpload() {
        const testFile = new File(["test content"], "test.txt", { type: "text/plain" });
        const url = await uploadFileToSupabaseStorage('pictures', testFile);
        if (url) {
            console.log("Test upload successful:", url);
        } else {
            console.error("Test upload failed");
        }
    }

    // Initial checks 
    checkBuckets();
    testUpload();

    showStep(currentStep);
});