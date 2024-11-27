document.addEventListener('DOMContentLoaded', function () {
    // Initialize form validation
    initializeFormValidation();

    // Initialize service type change handler
    initializeServiceTypeHandler();

    // Initialize date picker
    initializeDatePicker();

    // Load doctors list
    loadDoctors();
});

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('appointmentForm');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const btnLoader = submitButton.querySelector('.btn-loader');
            const btnText = submitButton.querySelector('.btn-text');

            try {
                // Show loader
                btnLoader.classList.remove('d-none');
                submitButton.disabled = true;

                // Simulate API call
                await submitAppointment(form);

                // Show success message
                showAlert('success', 'Appointment request submitted successfully! We will contact you shortly to confirm.');
                form.reset();
                form.classList.remove('was-validated');

            } catch (error) {
                showAlert('danger', 'An error occurred. Please try again later.');
            } finally {
                // Hide loader
                btnLoader.classList.add('d-none');
                submitButton.disabled = false;
            }
        });
    }
}

// Service type change handler
function initializeServiceTypeHandler() {
    const serviceType = document.getElementById('serviceType');
    const doctorSelect = document.getElementById('doctorSelect');

    if (serviceType && doctorSelect) {
        serviceType.addEventListener('change', function () {
            // Filter doctors based on service type
            loadDoctors(this.value);
        });
    }
}

// Date picker initialization
function initializeDatePicker() {
    const datePicker = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');

    if (datePicker) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        datePicker.min = today;

        datePicker.addEventListener('change', function () {
            loadTimeSlots(this.value);
        });
    }
}

// Load doctors list
async function loadDoctors(serviceType = '') {
    const doctorSelect = document.getElementById('doctorSelect');

    if (doctorSelect) {
        try {
            // Simulate API call
            const doctors = await getDoctors(serviceType);

            // Clear existing options except the first one
            doctorSelect.innerHTML = '<option value="">Select doctor (Optional)</option>';

            // Add new options
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `Dr. ${doctor.name} - ${doctor.specialty}`;
                doctorSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error loading doctors:', error);
        }
    }
}

// Load time slots
function loadTimeSlots(date) {
    const timeSelect = document.getElementById('appointmentTime');

    if (timeSelect) {
        // Clear existing options
        timeSelect.innerHTML = '<option value="">Select time slot</option>';

        // Get day of week (0 = Sunday, 6 = Saturday)
        const dayOfWeek = new Date(date).getDay();

        // Define time slots based on day
        let startTime = dayOfWeek === 0 ? 10 : dayOfWeek === 6 ? 9 : 8;
        let endTime = dayOfWeek === 0 ? 16 : dayOfWeek === 6 ? 18 : 20;

        // Add time slots
        for (let hour = startTime; hour < endTime; hour++) {
            for (let minute of ['00', '30']) {
                const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                const option = document.createElement('option');
                option.value = time;
                option.textContent = `${time}`;
                timeSelect.appendChild(option);
            }
        }
    }
}

// Show alert message
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';

    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const form = document.getElementById('appointmentForm');
    form.parentNode.insertBefore(alertDiv, form);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Simulated API calls
async function submitAppointment(form) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate successful submission
    return {
        success: true,
        message: 'Appointment submitted successfully'
    };
}

async function getDoctors(serviceType = '') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock doctors data
    return [
        { id: 1, name: 'Emily Johnson', specialty: 'General Pediatrics' },
        { id: 2, name: 'Michael Smith', specialty: 'Pediatric Cardiology' },
        { id: 3, name: 'Sarah Wilson', specialty: 'Child Development' }
    ].filter(doctor =>
        !serviceType ||
        (serviceType === 'checkup' && doctor.specialty === 'General Pediatrics') ||
        (serviceType === 'cardiology' && doctor.specialty === 'Pediatric Cardiology')
    );
} 