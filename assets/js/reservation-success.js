document.addEventListener('DOMContentLoaded', function () {
    // Get reservation ID from URL or localStorage
    const reservationId = getReservationId();

    // Load reservation details
    loadReservationDetails(reservationId);

    // Load payment information
    loadPaymentInformation();

    // Send confirmation email
    sendConfirmationEmail();
});

// Get reservation ID
function getReservationId() {
    // Try to get from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Fallback to localStorage if not in URL
    return id || localStorage.getItem('lastReservationId');
}

// Load reservation details
async function loadReservationDetails(reservationId) {
    try {
        const reservation = await fetchReservationDetails(reservationId);

        // Update reservation ID displays
        document.getElementById('reservationId').textContent = reservation.id;
        document.getElementById('paymentRefId').textContent = reservation.id;

        // Update healthcare team information
        updateHealthcareTeam(reservation.healthcareTeam);

        // Update customer information
        updateCustomerInfo(reservation.customer);

    } catch (error) {
        showAlert('error', 'Failed to load reservation details');
    }
}

// Update healthcare team information
function updateHealthcareTeam(team) {
    // Update doctor information
    document.getElementById('doctorImage').src = team.doctor.image;
    document.getElementById('doctorName').textContent = team.doctor.name;
    document.getElementById('doctorSpecialty').textContent = team.doctor.specialty;

    // Update nurse information
    document.getElementById('nurseImage').src = team.nurse.image;
    document.getElementById('nurseName').textContent = team.nurse.name;
}

// Update customer information
function updateCustomerInfo(customer) {
    document.getElementById('customerName').textContent = customer.fullName;
    document.getElementById('customerEmail').textContent = customer.email;
    document.getElementById('customerPhone').textContent = customer.mobile;
    document.getElementById('customerAddress').textContent = customer.address;
}

// Load payment information from system config
async function loadPaymentInformation() {
    try {
        const config = await fetchSystemConfig();
        const bankAccounts = config.paymentAccounts;
        const paymentEmail = config.paymentEmail;

        // Update payment email
        document.getElementById('paymentEmail').textContent = paymentEmail;

        // Render bank accounts
        renderBankAccounts(bankAccounts);

    } catch (error) {
        showAlert('error', 'Failed to load payment information');
    }
}

// Render bank account information
function renderBankAccounts(accounts) {
    const container = document.getElementById('bankAccounts');
    if (!container) return;

    container.innerHTML = accounts.map(account => `
        <div class="bank-account-item">
            <div class="bank-logo">
                <img src="${account.bankLogo}" alt="${account.bankName}" class="img-fluid">
            </div>
            <div class="bank-details">
                <p class="mb-1"><strong>Bank Name:</strong> ${account.bankName}</p>
                <p class="mb-1"><strong>Account Name:</strong> ${account.accountName}</p>
                <p class="mb-1"><strong>Account Number:</strong> 
                    <span class="account-number">${account.accountNumber}</span>
                    <button class="btn btn-sm btn-link copy-btn" 
                            onclick="copyToClipboard('${account.accountNumber}')">
                        <i class="fas fa-copy"></i>
                    </button>
                </p>
                <p class="mb-0"><strong>Branch:</strong> ${account.branch}</p>
            </div>
        </div>
    `).join('');
}

// Send confirmation email
async function sendConfirmationEmail() {
    try {
        const emailSent = await sendEmail();
        if (!emailSent) {
            showAlert('warning', 'Confirmation email could not be sent. Please check your email address.');
        }
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy text');
    });
}

// Show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
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

    const container = document.querySelector('.success-content');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => alertDiv.remove(), 5000);
}

// API calls
async function fetchReservationDetails(reservationId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    return {
        id: reservationId || 'RES-2024-001',
        status: 'submitted',
        healthcareTeam: {
            doctor: {
                name: 'Dr. Sarah Wilson',
                specialty: 'Pediatrician',
                image: 'assets/images/doctors/doctor-1.jpg'
            },
            nurse: {
                name: 'Emily Brown',
                image: 'assets/images/staff/nurse-1.jpg'
            }
        },
        customer: {
            fullName: 'John Doe',
            email: 'john@example.com',
            mobile: '+1234567890',
            address: '123 Main St, City, Country'
        }
    };
}

async function fetchSystemConfig() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock system configuration
    return {
        paymentEmail: 'payments@childrencare.com',
        paymentAccounts: [
            {
                bankName: 'City Bank',
                bankLogo: 'assets/images/banks/citybank.png',
                accountName: 'Children Care Medical Center',
                accountNumber: '1234567890',
                branch: 'Main Branch'
            },
            {
                bankName: 'National Bank',
                bankLogo: 'assets/images/banks/nationalbank.png',
                accountName: 'Children Care Medical Center',
                accountNumber: '0987654321',
                branch: 'Healthcare Division'
            }
        ]
    };
}

async function sendEmail() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
} 