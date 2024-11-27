document.addEventListener('DOMContentLoaded', function () {
    // Initialize blog functionality
    initializeBlogs();

    // Initialize view options
    initializeViewOptions();

    // Initialize category filters
    initializeCategoryFilters();

    // Initialize search
    initializeSearch();

    // Load initial posts
    loadBlogPosts();
});

// Blog posts data (In real application, this would come from an API)
const blogPosts = [
    {
        id: 1,
        title: "10 Essential Tips for Child Nutrition",
        excerpt: "Discover the key nutrients your child needs for healthy growth and development...",
        image: "assets/images/blog-1.jpg",
        category: "nutrition",
        date: "Jan 18, 2024",
        readTime: "4 min read",
        author: "Dr. Emily Johnson"
    },
    {
        id: 2,
        title: "Understanding Child Development Stages",
        excerpt: "Learn about the important milestones in your child's developmental journey...",
        image: "assets/images/blog-3.jpg",
        category: "development",
        date: "Jan 16, 2024",
        readTime: "6 min read",
        author: "Dr. Michael Smith"
    },
    // Add more blog posts
];

let currentPage = 1;
const postsPerPage = 6;
let currentCategory = 'all';
let currentView = 'grid';

function initializeBlogs() {
    // Load more button functionality
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            loadBlogPosts(false);
        });
    }
}

function initializeViewOptions() {
    const viewButtons = document.querySelectorAll('.view-options .btn');
    const blogPosts = document.getElementById('blogPosts');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Update view
            currentView = button.dataset.view;
            blogPosts.className = `row g-4 blog-${currentView}-view`;
        });
    });
}

function initializeCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.categories-wrapper .btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Update category and reload posts
            currentCategory = button.dataset.category;
            currentPage = 1;
            loadBlogPosts(true);
        });
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            filterPosts(searchTerm);
        }, 300);
    });
}

function filterPosts(searchTerm) {
    const filteredPosts = blogPosts.filter(post => {
        return post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm);
    });

    currentPage = 1;
    renderPosts(filteredPosts, true);
}

function loadBlogPosts(reset = false) {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;

    let filteredPosts = blogPosts;
    if (currentCategory !== 'all') {
        filteredPosts = blogPosts.filter(post => post.category === currentCategory);
    }

    renderPosts(filteredPosts.slice(start, end), reset);

    // Hide load more button if no more posts
    const loadMoreBtn = document.querySelector('.load-more');
    if (end >= filteredPosts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function renderPosts(posts, reset = false) {
    const blogPostsContainer = document.getElementById('blogPosts');

    if (reset) {
        blogPostsContainer.innerHTML = '';
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        blogPostsContainer.appendChild(postElement);
    });

    // Add animation to new posts
    const newPosts = blogPostsContainer.querySelectorAll('.blog-card:not(.animated)');
    newPosts.forEach((post, index) => {
        setTimeout(() => {
            post.classList.add('animated', 'fadeInUp');
        }, index * 100);
    });
}

function createPostElement(post) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    col.innerHTML = `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title}" class="img-fluid">
                
            </div>
            <div class="blog-card-content">
                <div class="blog-meta">
                    <span><i class="far fa-calendar me-2"></i>${post.date}</span>
                    <span><i class="far fa-clock me-2"></i>${post.readTime}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <a href="/blog/${post.id}" class="btn btn-link text-primary p-0">
                        Read More <i class="fas fa-arrow-right ms-2"></i>
                    </a>
                    <span class="author text-muted small">By ${post.author}</span>
                </div>
            </div>
        </article>
    `;

    return col;
}

// Add smooth scrolling for load more
function scrollToNewPosts() {
    const lastPost = document.querySelector('.blog-card:last-child');
    if (lastPost) {
        lastPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Add animation classes
const fadeInUp = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .fadeInUp {
        animation: fadeInUp 0.5s ease forwards;
    }
`;

// Add animation styles
const style = document.createElement('style');
style.textContent = fadeInUp;
document.head.appendChild(style); 