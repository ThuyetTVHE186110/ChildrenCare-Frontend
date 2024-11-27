document.addEventListener('DOMContentLoaded', function () {
    // Initialize cart from localStorage
    loadCart();

    // Update prices with latest from server
    updatePrices();

    // Initialize quantity and person controls
    initializeControls();
});

// Cart data structure
let cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
};

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('serviceCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart();
    } else {
        showEmptyCartMessage();
    }
}

// Update prices with latest from server
async function updatePrices() {
    try {
        const response = await fetchLatestPrices();
        cart.items = cart.items.map(item => ({
            ...item,
            price: response.prices[item.id] || item.price
        }));
        updateTotals();
        saveCart();
        renderCart();
    } catch (error) {
        showAlert('warning', 'Unable to fetch latest prices. Showing saved prices.');
    }
}

// Initialize quantity and person controls
function initializeControls() {
    // Quantity controls
    document.querySelectorAll('.quantity-control input').forEach(input => {
        input.addEventListener('change', function () {
            const serviceId = this.closest('.cart-item').dataset.serviceId;
            updateQuantity(serviceId, 0, this.value);
        });
    });

    // Person controls
    document.querySelectorAll('.persons-control input').forEach(input => {
        input.addEventListener('change', function () {
            const serviceId = this.closest('.cart-item').dataset.serviceId;
            updatePersons(serviceId, this.value);
        });
    });
}

// Update quantity
function updateQuantity(serviceId, change, newValue = null) {
    const item = cart.items.find(item => item.id === parseInt(serviceId));
    if (item) {
        if (newValue !== null) {
            item.quantity = Math.max(1, parseInt(newValue));
        } else {
            item.quantity = Math.max(1, item.quantity + change);
        }
        updateTotals();
        saveCart();
        renderCart();
    }
}

// Update persons
function updatePersons(serviceId, persons) {
    const item = cart.items.find(item => item.id === parseInt(serviceId));
    if (item) {
        item.persons = Math.max(1, parseInt(persons));
        updateTotals();
        saveCart();
        renderCart();
    }
}

// Remove item from cart
function removeItem(serviceId) {
    if (confirm('Are you sure you want to remove this service?')) {
        cart.items = cart.items.filter(item => item.id !== parseInt(serviceId));
        if (cart.items.length === 0) {
            showEmptyCartMessage();
        }
        updateTotals();
        saveCart();
        renderCart();
    }
}

// Calculate totals
function updateTotals() {
    cart.subtotal = cart.items.reduce((sum, item) =>
        sum + (item.price * item.quantity * item.persons), 0);
    cart.tax = cart.subtotal * 0.1; // 10% tax
    cart.total = cart.subtotal + cart.tax;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('serviceCart', JSON.stringify(cart));
}

// Render cart items and totals
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    cartContainer.innerHTML = cart.items.map(item => `
        <div class="cart-item" data-service-id="${item.id}">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image}" alt="${item.title}" class="img-fluid rounded">
                </div>
                <div class="col-md-4">
                    <h5 class="service-title">${item.title}</h5>
                    <p class="service-id text-muted">ID: ${item.id}</p>
                    <p class="service-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="col-md-2">
                    <div class="quantity-control">
                        <button type="button" class="btn btn-sm btn-quantity" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1">
                        <button type="button" class="btn btn-sm btn-quantity" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="persons-control">
                        <label class="form-label">Persons</label>
                        <input type="number" class="form-control" value="${item.persons}" min="1">
                    </div>
                </div>
                <div class="col-md-1">
                    <p class="item-total">$${(item.price * item.quantity * item.persons).toFixed(2)}</p>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-remove" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Update summary
    document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${cart.tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;

    // Reinitialize controls
    initializeControls();
}

// Show empty cart message
function showEmptyCartMessage() {
    const cartContainer = document.getElementById('cartItems');
    if (cartContainer) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add services to your reservation to get started.</p>
                <a href="/services" class="btn btn-primary">Browse Services</a>
            </div>
        `;
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.items.length === 0) {
        showAlert('warning', 'Please add services to your cart before proceeding to checkout.');
        return;
    }
    window.location.href = '/checkout';
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

    const cartContainer = document.querySelector('.cart-container');
    cartContainer.insertBefore(alertDiv, cartContainer.firstChild);

    setTimeout(() => alertDiv.remove(), 5000);
}

// Mock API call for latest prices
async function fetchLatestPrices() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    return {
        success: true,
        prices: {
            1: 100.00,
            2: 150.00,
            3: 200.00
        }
    };
} 