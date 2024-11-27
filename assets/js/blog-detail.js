document.addEventListener('DOMContentLoaded', function () {
    // Initialize Table of Contents
    generateTableOfContents();

    // Initialize Popular Posts
    loadPopularPosts();

    // Initialize Related Articles
    loadRelatedArticles();

    // Initialize Share Buttons
    initializeShareButtons();

    // Initialize Scroll Spy for TOC
    initializeScrollSpy();
});

// Generate Table of Contents
function generateTableOfContents() {
    const articleContent = document.querySelector('.article-content');
    const tocNav = document.querySelector('.toc-nav ul');
    const headings = articleContent.querySelectorAll('h2, h3');

    headings.forEach((heading, index) => {
        // Add ID to heading if not present
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }

        const li = document.createElement('li');
        li.className = 'nav-item';

        const a = document.createElement('a');
        a.className = `nav-link ${heading.tagName === 'H3' ? 'ms-3' : ''}`;
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;

        li.appendChild(a);
        tocNav.appendChild(li);
    });
}

// Popular Posts Data
const popularPosts = [
    {
        title: "10 Essential Tips for Child Nutrition",
        date: "Jan 18, 2024",
        image: "assets/images/blog-2.jpg",
        url: "/blog/child-nutrition-tips"
    },
    {
        title: "Understanding Child Development Stages",
        date: "Jan 16, 2024",
        image: "assets/images/blog-3.jpg",
        url: "/blog/development-stages"
    }
    // Add more popular posts
];

// Load Popular Posts
function loadPopularPosts() {
    const popularPostsContainer = document.querySelector('.popular-posts');

    popularPosts.forEach(post => {
        const postElement = createPopularPostElement(post);
        popularPostsContainer.appendChild(postElement);
    });
}

// Create Popular Post Element
function createPopularPostElement(post) {
    const div = document.createElement('div');
    div.className = 'popular-post-item d-flex align-items-center mb-3';

    div.innerHTML = `
        <img src="${post.image}" alt="${post.title}" class="rounded" width="80" height="80" style="object-fit: cover;">
        <div class="ms-3">
            <h6 class="mb-1"><a href="${post.url}" class="text-decoration-none">${post.title}</a></h6>
            <small class="text-muted">${post.date}</small>
        </div>
    `;

    return div;
}

// Related Articles Data
const relatedArticles = [
    {
        title: "The Role of Iron in Child Development",
        excerpt: "Understanding how iron supports your child's growth...",
        image: "assets/images/blog-4.jpg",
        category: "Nutrition",
        url: "/blog/iron-development"
    }
    // Add more related articles
];

// Load Related Articles
function loadRelatedArticles() {
    const relatedArticlesContainer = document.querySelector('.related-articles .row');

    relatedArticles.forEach(article => {
        const articleElement = createRelatedArticleElement(article);
        relatedArticlesContainer.appendChild(articleElement);
    });
}

// Create Related Article Element
function createRelatedArticleElement(article) {
    const div = document.createElement('div');
    div.className = 'col-md-6';

    div.innerHTML = `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="${article.image}" alt="${article.title}" class="img-fluid">
                <span class="category-badge">${article.category}</span>
            </div>
            <div class="blog-card-content">
                <h5 class="blog-title">${article.title}</h5>
                <p class="blog-excerpt">${article.excerpt}</p>
                <a href="${article.url}" class="btn btn-link text-primary p-0">
                    Read More <i class="fas fa-arrow-right ms-2"></i>
                </a>
            </div>
        </article>
    `;

    return div;
}

// Initialize Share Buttons
function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-buttons .btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl;

            if (this.querySelector('.fa-facebook-f')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            } else if (this.querySelector('.fa-twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            } else if (this.querySelector('.fa-linkedin-in')) {
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            }

            window.open(shareUrl, 'Share', 'width=600,height=400');
        });
    });
}

// Initialize Scroll Spy
function initializeScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-nav .nav-link');

    window.addEventListener('scroll', () => {
        const fromTop = window.scrollY + 100;

        tocLinks.forEach(link => {
            const section = document.querySelector(link.hash);

            if (section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
} 