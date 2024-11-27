document.addEventListener('DOMContentLoaded', function () {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Password visibility toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const password = document.getElementById('password');
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);

            // Toggle eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Handle registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Toggle password visibility for confirm password
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function () {
            const confirmPassword = document.getElementById('confirmPassword');
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Handle password reset form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handlePasswordReset);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    try {
        // Show loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitButton.disabled = true;

        // In a real application, you would make an API call here
        const response = await loginUser(email, password, remember);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Handle successful login
        if (response.success) {
            // Store auth token
            localStorage.setItem('authToken', response.token);

            // Redirect based on user role
            window.location.href = response.redirectUrl || '/dashboard';
        } else {
            showError(response.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again later.');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Simulated API call - Replace with actual API integration
async function loginUser(email, password, remember) {
    // This is a mock implementation
    return {
        success: true,
        token: 'mock-jwt-token',
        redirectUrl: '/dashboard',
        user: {
            id: 1,
            email: email,
            role: 'customer'
        }
    };
}

function showError(message) {
    // Create error alert if it doesn't exist
    let errorAlert = document.querySelector('.alert-danger');
    if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger alert-dismissible fade show mt-3';
        errorAlert.role = 'alert';

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'alert');

        errorAlert.appendChild(closeButton);
        document.querySelector('.auth-header').after(errorAlert);
    }

    errorAlert.textContent = message;
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validate passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    // Validate terms
    if (!terms) {
        showError('Please agree to the Terms of Service and Privacy Policy');
        return;
    }

    try {
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Creating Account...';
        submitButton.disabled = true;

        // Simulate API call
        const response = await registerUser({
            firstName,
            lastName,
            email,
            phone,
            password
        });

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (response.success) {
            // Show success message
            showSuccess('Account created successfully! Redirecting to login...');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            showError(response.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again later.');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Show success message
function showSuccess(message) {
    let successAlert = document.querySelector('.alert-success');
    if (!successAlert) {
        successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show mt-3';
        successAlert.role = 'alert';

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'alert');

        successAlert.appendChild(closeButton);
        document.querySelector('.auth-header').after(successAlert);
    }

    successAlert.textContent = message;
}

// Simulated API call
async function registerUser(userData) {
    // This is a mock implementation
    return {
        success: true,
        message: 'Registration successful',
        user: {
            id: 1,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
        }
    };
}

// Handle password reset form
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', handlePasswordReset);
}

async function handlePasswordReset(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;

    try {
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Simulate API call
        const response = await sendResetLink(email);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (response.success) {
            // Show success step
            document.getElementById('emailStep').classList.add('d-none');
            document.getElementById('successStep').classList.remove('d-none');
        } else {
            showError(response.message || 'Failed to send reset link. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again later.');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Handle resend email
let resendCooldown = false;

function resendEmail() {
    if (resendCooldown) return;

    const resendButton = document.querySelector('#successStep button');
    const email = document.getElementById('email').value;

    resendButton.classList.add('btn-cooldown');
    resendButton.disabled = true;
    resendCooldown = true;

    // Simulate sending email
    setTimeout(() => {
        resendButton.classList.remove('btn-cooldown');
        resendButton.disabled = false;
        resendCooldown = false;
        showSuccess('Reset link has been resent to your email.');
    }, 60000); // 60 seconds cooldown

    // Show immediate feedback
    showSuccess('Sending reset link...');
    sendResetLink(email);
}

// Simulated API call
async function sendResetLink(email) {
    // This is a mock implementation
    return {
        success: true,
        message: 'Reset link sent successfully'
    };
} 