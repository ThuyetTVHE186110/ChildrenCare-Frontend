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