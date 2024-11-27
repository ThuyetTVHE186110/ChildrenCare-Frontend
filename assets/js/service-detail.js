document.addEventListener('DOMContentLoaded', function () {
    // Initialize service details
    loadServiceDetails();

    // Initialize image gallery
    initializeGallery();

    // Load reviews
    loadReviews();

    // Load related services
    loadRelatedServices();
});

// Service data structure
let serviceData = {
    id: 'SRV001',
    title: 'Pediatric Consultation',
    category: 'Pediatric Care',
    originalPrice: 150.00,
    salePrice: 120.00,
    rating: 4.5,
    reviewCount: 128,
    images: [
        'assets/images/services/pediatric-main.jpg',
        'assets/images/services/pediatric-1.jpg',
        'assets/images/services/pediatric-2.jpg',
        'assets/images/services/pediatric-3.jpg'
    ]
};

// Load service details
async function loadServiceDetails() {
    try {
        const response = await fetchServiceDetails();
        serviceData = { ...serviceData, ...response };
        updateServiceUI();
    } catch (error) {
        showAlert('error', 'Failed to load service details');
    }
}

// Initialize image gallery
function initializeGallery() {
    const gallery = document.getElementById('imageGallery');
    if (!gallery) return;

    gallery.innerHTML = serviceData.images.map((image, index) => `
        <div class="col-3">
            <img src="${image}" 
                 alt="Service Image ${index + 1}" 
                 class="img-fluid rounded cursor-pointer"
                 onclick="updateMainImage('${image}')">
        </div>
    `).join('');
}

// Update main image
function updateMainImage(imageSrc) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
}

// Load reviews
async function loadReviews() {
    try {
        const reviews = await fetchReviews();
        renderReviews(reviews);
    } catch (error) {
        showAlert('error', 'Failed to load reviews');
    }
}

// Render reviews
function renderReviews(reviews) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.userAvatar}" alt="${review.userName}" class="reviewer-avatar">
                    <div>
                        <h5 class="mb-0">${review.userName}</h5>
                        <div class="review-rating">
                            ${generateStarRating(review.rating)}
                        </div>
                    </div>
                </div>
                <div class="review-date text-muted">
                    ${formatDate(review.date)}
                </div>
            </div>
            <div class="review-content">
                <p>${review.comment}</p>
            </div>
        </div>
    `).join('');
}

// Load related services
async function loadRelatedServices() {
    try {
        const services = await fetchRelatedServices();
        renderRelatedServices(services);
    } catch (error) {
        showAlert('error', 'Failed to load related services');
    }
}

// Render related services
function renderRelatedServices(services) {
    const container = document.getElementById('relatedServices');
    if (!container) return;

    container.innerHTML = services.map(service => `
        <div class="related-service-card">
            <img src="${service.thumbnail}" alt="${service.title}" class="img-fluid rounded">
            <div class="service-info">
                <h5>${service.title}</h5>
                <div class="service-price">
                    ${service.salePrice ? `
                        <span class="original-price">$${service.originalPrice.toFixed(2)}</span>
                        <span class="sale-price">$${service.salePrice.toFixed(2)}</span>
                    ` : `
                        <span class="regular-price">$${service.originalPrice.toFixed(2)}</span>
                    `}
                </div>
                <a href="/service/${service.id}" class="btn btn-link p-0">View Details</a>
            </div>
        </div>
    `).join('');
}

// Add to cart functionality
async function addToCart() {
    const personCount = parseInt(document.getElementById('personCount').value) || 1;

    try {
        const cart = JSON.parse(localStorage.getItem('serviceCart')) || { items: [] };

        const existingItem = cart.items.find(item => item.id === serviceData.id);
        if (existingItem) {
            showAlert('info', 'This service is already in your cart');
            return;
        }

        cart.items.push({
            id: serviceData.id,
            title: serviceData.title,
            price: serviceData.salePrice || serviceData.originalPrice,
            image: serviceData.images[0],
            quantity: 1,
            persons: personCount
        });

        localStorage.setItem('serviceCart', JSON.stringify(cart));
        showAlert('success', 'Service added to cart successfully');

        // Optional: Redirect to cart page
        // window.location.href = '/reservation-detail';
    } catch (error) {
        showAlert('error', 'Failed to add service to cart');
    }
}

// Helper functions
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return `
        ${Array(fullStars).fill('<i class="fas fa-star text-warning"></i>').join('')}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt text-warning"></i>' : ''}
        ${Array(emptyStars).fill('<i class="far fa-star text-warning"></i>').join('')}
    `;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';

    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('.service-detail-content');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => alertDiv.remove(), 5000);
}

// API calls
async function fetchServiceDetails() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        description: 'Detailed service description...',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        duration: '45-60 minutes',
        expertLevel: 'Board-certified pediatricians'
    };
}

async function fetchReviews() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
        {
            id: 1,
            userName: 'Sarah Johnson',
            userAvatar: 'assets/images/avatars/user-1.jpg',
            rating: 5,
            date: '2024-03-01',
            comment: 'Excellent service! The doctor was very thorough and patient with my child.'
        },
        // Add more reviews
    ];
}

async function fetchRelatedServices() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
        {
            id: 'SRV002',
            title: 'Vaccination Service',
            thumbnail: 'assets/images/services/vaccination.jpg',
            originalPrice: 200.00,
            salePrice: 180.00
        },
        // Add more related services
    ];
} 