document.addEventListener('DOMContentLoaded', function () {
    // Initialize services
    loadServices();

    // Initialize search
    initializeSearch();

    // Initialize category filters
    initializeCategoryFilters();
});

// Pagination settings
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let currentType = 'all';
let searchQuery = '';

// Load services with pagination
async function loadServices() {
    try {
        const response = await fetchServices(currentPage, currentType, searchQuery);
        renderServices(response.services);
        renderPagination(response.totalPages);
    } catch (error) {
        showAlert('error', 'Failed to load services. Please try again later.');
    }
}

// Render services grid
function renderServices(services) {
    const container = document.getElementById('servicesContainer');

    container.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-image">
                <img src="${service.thumbnail}" alt="${service.title}">
                ${service.salePrice ? `
                    <div class="discount-badge">
                        ${calculateDiscount(service.originalPrice, service.salePrice)}% OFF
                    </div>
                ` : ''}
            </div>
            <div class="service-content">
                <h3 class="service-title">
                    <a href="/service/${service.id}">${service.title}</a>
                </h3>
                <p class="service-brief">${service.brief}</p>
                <div class="service-price">
                    ${service.salePrice ? `
                        <span class="original-price">$${service.originalPrice.toFixed(2)}</span>
                        <span class="sale-price">$${service.salePrice.toFixed(2)}</span>
                    ` : `
                        <span class="regular-price">$${service.originalPrice.toFixed(2)}</span>
                    `}
                </div>
                <div class="service-actions">
                    <button class="btn btn-primary" onclick="addToCart(${service.id})">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-outline-primary" onclick="showFeedback(${service.id})">
                        <i class="fas fa-comment me-2"></i>Feedback
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render pagination
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    let html = `
        <ul class="pagination">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    </ul>
    `;

    pagination.innerHTML = html;
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('serviceSearch');
    let searchTimeout;

    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = this.value;
            currentPage = 1;
            loadServices();
        }, 500);
    });
}

// Initialize category filters
function initializeCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.category-list a');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentType = this.dataset.type;
            currentPage = 1;
            loadServices();
        });
    });
}

// Add to cart functionality
async function addToCart(serviceId) {
    try {
        const service = await fetchServiceDetails(serviceId);
        const cart = JSON.parse(localStorage.getItem('serviceCart')) || { items: [] };

        const existingItem = cart.items.find(item => item.id === serviceId);
        if (existingItem) {
            showAlert('info', 'This service is already in your cart');
            return;
        }

        cart.items.push({
            id: service.id,
            title: service.title,
            price: service.salePrice || service.originalPrice,
            image: service.thumbnail,
            quantity: 1,
            persons: 1
        });

        localStorage.setItem('serviceCart', JSON.stringify(cart));
        showAlert('success', 'Service added to cart successfully');
    } catch (error) {
        showAlert('error', 'Failed to add service to cart');
    }
}

// Show feedback modal
function showFeedback(serviceId) {
    // Implement feedback modal functionality
    window.location.href = `/feedback/${serviceId}`;
}

// Helper functions
function calculateDiscount(original, sale) {
    return Math.round((1 - sale / original) * 100);
}

function showAlert(type, message) {
    // Implement alert functionality
}

// API calls
async function fetchServices(page, type, search) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response
    return {
        services: [
            {
                id: 1,
                title: "Pediatric Consultation",
                brief: "Comprehensive health check-up for children",
                thumbnail: "assets/images/service-1.jpg",
                originalPrice: 150.00,
                salePrice: 120.00,
                updatedDate: "2024-03-15"
            },
            // Add more mock services
        ],
        totalPages: 4
    };
}

async function fetchServiceDetails(serviceId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock response
    return {
        id: serviceId,
        title: "Pediatric Consultation",
        thumbnail: "assets/images/service-1.jpg",
        originalPrice: 150.00,
        salePrice: 120.00
    };
} 