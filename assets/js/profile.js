document.addEventListener('DOMContentLoaded', function () {
    // Add this new function call
    initializeTabs();

    // Your existing initialization code...
    loadUserProfile();
    initializeFormControls();
    initializeAvatarUpload();
    initializePasswordChange();
    initializeReservations();
});

// Add this new function to handle tab switching
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.profile-nav .nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and contents
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('d-none'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show corresponding content
            const targetId = link.getAttribute('href').substring(1);
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('d-none');
            }

            // If it's the reservations tab, refresh the reservations
            if (targetId === 'myReservationsContent') {
                loadReservations();
            }
        });
    });

    // Show initial tab (Profile Information)
    const initialTab = document.querySelector('.profile-nav .nav-link');
    if (initialTab) {
        initialTab.click();
    }
}

// Load user profile data
async function loadUserProfile() {
    try {
        const profile = await fetchUserProfile();
        populateProfileForm(profile);
        updateSidebarInfo(profile);
        updateAvatarPreview(profile.avatar);
    } catch (error) {
        showAlert('error', 'Failed to load profile information');
    }
}

// Initialize form controls
function initializeFormControls() {
    const form = document.getElementById('profileForm');
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');

    // Initially disable form fields
    toggleFormEditing(false);

    // Edit button click handler
    editBtn.addEventListener('click', () => {
        toggleFormEditing(true);
        editBtn.style.display = 'none';
        cancelBtn.style.display = 'inline-block';
    });

    // Cancel button click handler
    cancelBtn.addEventListener('click', () => {
        toggleFormEditing(false);
        editBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'none';
        loadUserProfile(); // Reset form to original values
    });

    // Form submission handler
    form.addEventListener('submit', handleProfileUpdate);
}

// Toggle form editing state
function toggleFormEditing(enabled) {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input:not([readonly]), select, textarea');

    inputs.forEach(input => {
        input.disabled = !enabled;
    });
}

// Initialize avatar upload
function initializeAvatarUpload() {
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('userAvatar');

    avatarUpload.addEventListener('change', async function (e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type and size
            if (!validateImageFile(file)) {
                return;
            }

            try {
                // Show loading state
                avatarPreview.classList.add('loading');

                // Upload image to server
                const uploadedUrl = await uploadAvatar(file);

                // Update preview
                avatarPreview.src = uploadedUrl;
                showAlert('success', 'Profile picture updated successfully');

            } catch (error) {
                showAlert('error', 'Failed to upload profile picture');
            } finally {
                avatarPreview.classList.remove('loading');
            }
        }
    });
}

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();

    if (!e.target.checkValidity()) {
        e.stopPropagation();
        e.target.classList.add('was-validated');
        return;
    }

    const submitButton = e.target.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoader = submitButton.querySelector('.btn-loader');

    try {
        // Show loading state
        btnText.classList.add('d-none');
        btnLoader.classList.remove('d-none');
        submitButton.disabled = true;

        // Gather form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
            birthDate: document.getElementById('birthDate').value,
            address: document.getElementById('address').value
        };

        // Submit update
        const response = await updateProfile(formData);

        if (response.success) {
            showAlert('success', 'Profile updated successfully');
            toggleFormEditing(false);
            document.getElementById('editProfileBtn').style.display = 'inline-block';
            document.getElementById('cancelEditBtn').style.display = 'none';
            updateSidebarInfo(formData);
        } else {
            throw new Error(response.message || 'Update failed');
        }

    } catch (error) {
        showAlert('error', error.message || 'Failed to update profile');
    } finally {
        btnText.classList.remove('d-none');
        btnLoader.classList.add('d-none');
        submitButton.disabled = false;
    }
}

// Populate form with user data
function populateProfileForm(data) {
    document.getElementById('firstName').value = data.firstName || '';
    document.getElementById('lastName').value = data.lastName || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('gender').value = data.gender || '';
    document.getElementById('birthDate').value = data.birthDate || '';
    document.getElementById('address').value = data.address || '';
}

// Update sidebar information
function updateSidebarInfo(data) {
    document.getElementById('sidebarUserName').textContent =
        `${data.firstName} ${data.lastName}`;
    document.getElementById('sidebarUserEmail').textContent = data.email;
}

// Update avatar preview
function updateAvatarPreview(avatarUrl) {
    const avatar = document.getElementById('userAvatar');
    avatar.src = avatarUrl || 'assets/images/default-avatar.png';
}

// Validate image file
function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        showAlert('error', 'Please upload a valid image file (JPEG, PNG, or GIF)');
        return false;
    }

    if (file.size > maxSize) {
        showAlert('error', 'Image file size must be less than 5MB');
        return false;
    }

    return true;
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

    const container = document.querySelector('.profile-content');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => alertDiv.remove(), 5000);
}

// API calls
async function fetchUserProfile() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        gender: 'male',
        birthDate: '1990-01-01',
        address: '123 Main St, City, Country',
        avatar: 'assets/images/avatars/user-1.jpg'
    };
}

async function updateProfile(data) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        success: true,
        message: 'Profile updated successfully'
    };
}

async function uploadAvatar(file) {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return mock URL
    return URL.createObjectURL(file);
}

// Handle password change
function initializePasswordChange() {
    const form = document.getElementById('changePasswordForm');
    const toggleBtns = document.querySelectorAll('.toggle-password');

    // Password visibility toggle
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;

            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Password form submission
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!validatePasswords()) {
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            try {
                btnText.classList.add('d-none');
                btnLoader.classList.remove('d-none');
                submitBtn.disabled = true;

                const response = await updatePassword({
                    currentPassword: document.getElementById('currentPassword').value,
                    newPassword: document.getElementById('newPassword').value
                });

                if (response.success) {
                    showAlert('success', 'Password updated successfully');
                    form.reset();
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                showAlert('error', error.message || 'Failed to update password');
            } finally {
                btnText.classList.remove('d-none');
                btnLoader.classList.add('d-none');
                submitBtn.disabled = false;
            }
        });
    }
}

// Validate passwords
function validatePasswords() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showAlert('error', 'Passwords do not match');
        return false;
    }

    return true;
}

// Initialize reservations
function initializeReservations() {
    loadReservations();
    initializeReservationFilters();
}

// Load reservations
async function loadReservations(page = 1, filters = {}) {
    try {
        const response = await fetchReservations(page, filters);
        renderReservations(response.reservations);
        renderPagination(response.totalPages, page);
    } catch (error) {
        showAlert('error', 'Failed to load reservations');
    }
}

// Render reservations
function renderReservations(reservations) {
    const tbody = document.getElementById('reservationsTableBody');
    if (!tbody) return;

    tbody.innerHTML = reservations.map(reservation => `
        <tr>
            <td>${reservation.id}</td>
            <td>${reservation.serviceName}</td>
            <td>${formatDate(reservation.date)}</td>
            <td>
                <span class="badge bg-${getStatusBadgeClass(reservation.status)}">
                    ${reservation.status}
                </span>
            </td>
            <td>$${reservation.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" 
                        onclick="viewReservation('${reservation.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${reservation.status === 'pending' ? `
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="cancelReservation('${reservation.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Helper functions
function getStatusBadgeClass(status) {
    const classes = {
        pending: 'warning',
        confirmed: 'success',
        completed: 'info',
        cancelled: 'danger'
    };
    return classes[status] || 'secondary';
}

// Initialize filters
function initializeReservationFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const searchInput = document.getElementById('searchReservation');

    const applyFilters = () => {
        const filters = {
            status: statusFilter.value !== 'all' ? statusFilter.value : null,
            date: dateFilter.value,
            search: searchInput.value
        };
        loadReservations(1, filters);
    };

    statusFilter?.addEventListener('change', applyFilters);
    dateFilter?.addEventListener('change', applyFilters);

    let searchTimeout;
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 500);
    });
}

// Add these to your existing API calls
async function updatePassword(data) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Password updated successfully' };
}

async function fetchReservations(page, filters) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        reservations: [
            {
                id: 'RES001',
                serviceName: 'Pediatric Consultation',
                date: '2024-03-20',
                status: 'confirmed',
                total: 150.00
            },
            // Add more mock reservations
        ],
        totalPages: 5
    };
} 