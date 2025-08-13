document.addEventListener('DOMContentLoaded', () => {
    // Gallery "Load More/Less" functionality
    const loadMoreButton = document.getElementById('toggleGallery');
    // Select all hidden images within the gallery section
    const hiddenImages = document.querySelectorAll('.portfolio-section .image-grid .gallery-image.hidden');
    let isExpanded = false; // Track the state of the gallery

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            isExpanded = !isExpanded; // Toggle the state

            hiddenImages.forEach(image => {
                // Toggle display style directly for visibility
                image.style.display = isExpanded ? 'block' : 'none';
            });

            // Change button text based on state
            loadMoreButton.textContent = isExpanded ? 'Load Less Projects' : 'Load More Projects';
        });

        // Initialize: hide hidden images with style on page load
        hiddenImages.forEach(image => {
          image.style.display = 'none';
        });
    }

    // Image Shuffling for the gallery
    // This runs every 5 seconds to reorder the images in the grid
    setInterval(() => {
        const grid = document.querySelector('.image-grid');
        if (grid) {
            const images = Array.from(grid.children); // Get all current images in the grid
            // Filter out any non-image elements if necessary
            const imageElements = images.filter(el => el.tagName === 'IMG');
            imageElements.sort(() => Math.random() - 0.5); // Randomly sort the images
            imageElements.forEach(img => grid.appendChild(img)); // Re-append them in the new order
        }
    }, 5000); // shuffle every 5 seconds

    // Smooth Scrolling for Navbar Links
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Check if the link is meant for scrolling within the page (not external links or dropdown items)
            const scrollIdMatch = this.getAttribute('onclick')?.match(/scrollToSection\('(.*?)'\)/);
            if (scrollIdMatch && scrollIdMatch[1]) {
                e.preventDefault(); // Prevent default link behavior if it's an internal scroll
                scrollToSection(scrollIdMatch[1]);
            }
            // If it's a location.href or dropdown toggle, let default behavior proceed or handled by specific dropdown logic
        });
    });

    // Mobile Menu Toggle Functionality
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            if (mobileMenu.style.display === 'flex') {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'flex';
            }
        });
        // Close mobile menu when a nav item is clicked
        mobileMenu.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                // Check if it's an internal scroll link, then close menu
                const scrollIdMatch = item.getAttribute('onclick')?.match(/scrollToSection\('(.*?)'\)/);
                if (scrollIdMatch) {
                    menuToggle.classList.remove('open');
                    mobileMenu.style.display = 'none';
                }
                // For external links (location.href), let them navigate naturally
            });
        });
    }

    // Desktop "More" Dropdown functionality
    const moreDropdownToggle = document.getElementById('moreDropdownToggle');
    const moreDropdownContent = document.getElementById('moreDropdownContent');

    if (moreDropdownToggle && moreDropdownContent) {
        moreDropdownToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from immediately closing it if clicking on "More" itself
            moreDropdownToggle.classList.toggle('open');
            if (moreDropdownToggle.classList.contains('open')) {
                moreDropdownContent.style.display = 'block';
            } else {
                moreDropdownContent.style.display = 'none';
            }
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!moreDropdownToggle.contains(event.target)) {
                moreDropdownToggle.classList.remove('open');
                moreDropdownContent.style.display = 'none';
            }
        });

        // Close dropdown when a dropdown item is clicked (for internal scrolls)
        moreDropdownContent.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const scrollIdMatch = item.getAttribute('onclick')?.match(/scrollToSection\('(.*?)'\)/);
                if (scrollIdMatch) {
                    moreDropdownToggle.classList.remove('open');
                    moreDropdownContent.style.display = 'none';
                }
            });
        });
    }

    // FAQ Section functionality (Accordion)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling; // Get the next sibling element (the answer)
            const arrow = question.querySelector('.faq-arrow');

            // Close all other open FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.classList.remove('open');
                }
            });

            // Toggle current FAQ item
            question.classList.toggle('active');
            answer.classList.toggle('open');
        });
    });

    // Contact Form submission for main page (if it exists)
    // Using a distinct ID to avoid conflict with contact.html's form
    const contactFormMain = document.getElementById('contactFormMain');
    if (contactFormMain) {
        contactFormMain.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const formData = {
                name: document.getElementById('name-main').value, // Using specific IDs for main page form
                email: document.getElementById('email-main').value,
                message: document.getElementById('message-main').value,
            };

            // In a real application, you would send this formData to a server
            console.log('Main Contact Form Submitted:', formData);
            alert('Your message has been submitted from the main page!'); // Using alert for now

            // Reset the form
            this.reset();
        });
    }
});


// Global function for smooth scrolling, callable from inline onclick
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    // Get the height of the fixed navbar
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    // Calculate the target scroll position, accounting for the navbar
    const offsetPosition = element.offsetTop - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    // Close mobile menu if open after scrolling (already handled by event listeners)
    // const mobileMenu = document.getElementById('mobileMenu');
    // const menuToggle = document.getElementById('menuToggle');
    // if (mobileMenu && mobileMenu.style.display === 'flex') {
    //     mobileMenu.style.display = 'none';
    //     if (menuToggle) menuToggle.classList.remove('open');
    // }
  }
}

// Chatbot Toggle Function
// This function is called by the 'onclick' event on the chat button and the close button
// This remains in script.js as it controls the UI element on the main page.
function toggleChat() {
  const popup = document.getElementById("chatbotPopup");
  // Toggle between "block" (visible) and "none" (hidden)
  if (popup) {
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  }
}
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isMenuOpen = mobileMenu.style.display === 'flex';
            mobileMenu.style.display = isMenuOpen ? 'none' : 'flex';
        });
    }

    // --- Logout Button Logic ---
    const logoutButton = document.getElementById('logoutButton');
    const mobileLogoutButton = document.getElementById('mobileLogoutButton');

    const handleLogout = () => {
        // This is the key part: remove the login key from sessionStorage
        sessionStorage.removeItem('mievotech_is_logged_in');
        // Redirect back to the login page.
        window.location.href = 'login.html';
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', handleLogout);
    }
});

// --- Global Smooth Scrolling Function ---
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const offsetPosition = element.offsetTop - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    // Close mobile menu after clicking a link
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
        document.getElementById('menuToggle').classList.remove('open');
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
    // --- Welcome Message Logic ---
    const welcomeMessageContainer = document.getElementById('welcomeMessage');
    const userName = sessionStorage.getItem('mievotech_user_name');

    if (welcomeMessageContainer && userName) {
        welcomeMessageContainer.textContent = `Welcome, ${userName}!`;
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isMenuOpen = mobileMenu.style.display === 'flex';
            mobileMenu.style.display = isMenuOpen ? 'none' : 'flex';
        });
    }

    // --- Logout Button Logic ---
    const logoutButton = document.getElementById('logoutButton');
    const mobileLogoutButton = document.getElementById('mobileLogoutButton');

    const handleLogout = () => {
        // Clear both the login flag and the user's name
        sessionStorage.removeItem('mievotech_is_logged_in');
        sessionStorage.removeItem('mievotech_user_name');
        // Redirect back to the login page.
        window.location.href = 'login.html';
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', handleLogout);
    }
});

// --- Global Smooth Scrolling Function ---
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const offsetPosition = element.offsetTop - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    // Close mobile menu after clicking a link
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
        document.getElementById('menuToggle').classList.remove('open');
    }
  }
}



// NOTE: sendMessage and toggleVoice are expected to be defined in chatbot.js
// Their implementation has been moved there based on your request.