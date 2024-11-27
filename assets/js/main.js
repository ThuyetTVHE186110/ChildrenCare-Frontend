document.addEventListener('DOMContentLoaded', function () {
    // Load services
    loadServices();

    // Initialize any necessary components
    initializeComponents();

    // Counter Animation
    animateCounter(document.querySelector('.counter'));

    // Initialize counters when they come into view
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => animateCounter(counter));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statisticsSection = document.querySelector('.statistics-section');
    if (statisticsSection) {
        observer.observe(statisticsSection);
    }

    const header = document.querySelector('.header');
    const topBar = document.querySelector('.top-bar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const topBarHeight = topBar ? topBar.offsetHeight : 0;

        if (currentScroll > topBarHeight) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        lastScroll = currentScroll;
    });
});

// Function to load services
function loadServices() {
    // Sample services data (In real application, this would come from an API)
    const services = [
        {
            id: 1,
            title: "Pediatric Consultation",
            description: "Regular check-ups and consultations for children",
            icon: "fa-stethoscope"
        },
        {
            id: 2,
            title: "Vaccination",
            description: "Complete vaccination programs for children",
            icon: "fa-syringe"
        },
        {
            id: 3,
            title: "Child Development",
            description: "Monitoring and supporting child development",
            icon: "fa-child"
        }
    ];

    const servicesContainer = document.getElementById('services-container');

    services.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesContainer.appendChild(serviceCard);
    });
}

// Function to create service card
function createServiceCard(service) {
    const col = document.createElement('div');
    col.className = 'col-md-4';

    col.innerHTML = `
        <div class="service-card">
            <i class="fas ${service.icon} fa-3x mb-3 text-primary"></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <a href="/services/${service.id}" class="btn btn-outline-primary">Learn More</a>
        </div>
    `;

    return col;
}

// Function to initialize components
function initializeComponents() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.textContent);
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps

    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(count) + '+';
        }
    }, 16);
} 