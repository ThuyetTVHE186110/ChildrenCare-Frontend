document.addEventListener('DOMContentLoaded', function () {
    // Load cart data and update summary
    loadCartSummary();

    // Load user data if logged in
    loadUserData();

    // Initialize form validation
    initializeFormValidation();
});

// Load and display cart summary
function loadCartSummary() {
    const cart = JSON.parse(localStorage.getItem('serviceCart')) || { items: [] };
    if (cart.items.length === 0) {
        window.location.href = '/services';
        return;
    }

    renderCartSummary(cart);
    updateTotals(cart);
}

// Render cart summary table
function renderCartSummary(cart) {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;

    tbody.innerHTML = cart.items.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.title}" 
                         class="service-thumbnail me-2" width="50" height="50">
                    <span>${item.title}</span>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>${item.persons}</td>
            <td>$${(item.price * item.quantity * item.persons).toFixed(2)}</td>
        </tr>
    `).join('');
}

// Update totals
function updateTotals(cart) {
    const subtotal = cart.items.reduce((sum, item) =>
        sum + (item.price * item.quantity * item.persons), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Load user data if logged in
async function loadUserData() {
    try {
        const user = await checkLoginStatus();
        if (user) {
            fillUserData(user);
        }
    } catch (error) {
        console.log('User not logged in');
    }
}

// Fill form with user data
function fillUserData(user) {
    document.getElementById('fullName').value = user.fullName || '';
    document.getElementById('gender').value = user.gender || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('mobile').value = user.mobile || '';
    document.getElementById('address').value = user.address || '';
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const btnText = submitButton.querySelector('.btn-text');
            const btnLoader = submitButton.querySelector('.btn-loader');

            try {
                // Show loader
                btnText.classList.add('d-none');
                btnLoader.classList.remove('d-none');
                submitButton.disabled = true;

                // Get form data
                const formData = {
                    fullName: document.getElementById('fullName').value,
                    gender: document.getElementById('gender').value,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('mobile').value,
                    address: document.getElementById('address').value,
                    notes: document.getElementById('notes').value,
                    cart: JSON.parse(localStorage.getItem('serviceCart'))
                };

                // Submit reservation
                const response = await submitReservation(formData);

                if (response.success) {
                    // Clear cart
                    localStorage.removeItem('serviceCart');

                    // Redirect to success page
                    window.location.href = '/reservation-success';
                } else {
                    throw new Error(response.message || 'Submission failed');
                }

            } catch (error) {
                showAlert('danger', error.message || 'An error occurred. Please try again.');

                // Reset button state
                btnText.classList.remove('d-none');
                btnLoader.classList.add('d-none');
                submitButton.disabled = false;
            }
        });
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

    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form);

    setTimeout(() => alertDiv.remove(), 5000);
}

// API calls
async function checkLoginStatus() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock user data
    return {
        fullName: 'John Doe',
        gender: 'male',
        email: 'john@example.com',
        mobile: '+1234567890',
        address: '123 Main St, City, Country'
    };
}

async function submitReservation(formData) {
    try {
        const response = await submitReservationAPI(formData);
        if (response.success) {
            // Store reservation ID
            localStorage.setItem('lastReservationId', response.reservationId);
            // Redirect to success page
            window.location.href = `/reservation-success?id=${response.reservationId}`;
        }
    } catch (error) {
        showAlert('error', error.message);
    }
}

async function checkTimeSlotAvailability() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock availability check (90% chance of success)
    return Math.random() > 0.1;
} 