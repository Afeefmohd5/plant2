(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

    
})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');
    const successPopupModal = new bootstrap.Modal(document.getElementById('successPopupModal'));
    const signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));
    const signInModal = new bootstrap.Modal(document.getElementById('signInModal'));
    const loginFirstModal = new bootstrap.Modal(document.getElementById('loginFirstModal'));
    const signInError = document.getElementById('signInError');

    // Helper to get users from localStorage
    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Helper to save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Helper to get current logged in user
    function getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Helper to set current logged in user
    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    // Helper to clear current logged in user
    function clearCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    // Sign Up form submit handler
    signUpForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('signUpUsername').value.trim();
        const email = document.getElementById('signUpEmail').value.trim();
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Prepare data to send
        const data = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8000/Api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const result = await response.json();

            // Assuming backend returns success status
            signUpModal.hide();
            successPopupModal.show();
        } catch (error) {
            alert('Error during sign up: ' + error.message);
        }
    });

    // Success popup OK button handler
    document.getElementById('successPopupCloseBtn').addEventListener('click', function () {
        successPopupModal.hide();
        // Open sign in modal after success popup
        signInModal.show();
    });

    // Sign In form submit handler
    signInForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('signInEmail').value.trim();
        const password = document.getElementById('signInPassword').value;

        let users = getUsers();

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            signInError.style.display = 'none';
            signInModal.hide();
            // Set current user in localStorage
            setCurrentUser(user);
            // Reload page to reflect login state
            window.location.href = 'index.html';
        } else {
            signInError.style.display = 'block';
        }
    });

    // Cart data structure
    const cart = [];

    // Utility to parse price string like "$29.99" to number 29.99
    function parsePrice(priceStr) {
        return parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
    }

    // Utility to format number to price string like "$29.99"
    function formatPrice(num) {
        return '$' + num.toFixed(2);
    }

    // Update cart count badge
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.length;
    }

    // Update cart modal items and total
    function updateCartModal() {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        let total = 0;
        cart.forEach((item, index) => {
            total += parsePrice(item.price);

            const itemElem = document.createElement('div');
            itemElem.className = 'list-group-item d-flex justify-content-between align-items-center';

            itemElem.innerHTML = `
            <div>
              <h6 class="my-0">${item.name}</h6>
              <small class="text-muted">${item.price}</small>
            </div>
            <button class="btn btn-danger btn-sm">Remove</button>
          `;

            // Remove button handler
            itemElem.querySelector('button').addEventListener('click', () => {
                cart.splice(index, 1);
                updateCartCount();
                updateCartModal();
            });

            cartItemsContainer.appendChild(itemElem);
        });

        document.getElementById('cart-total').textContent = formatPrice(total);
    }

    // Add event listeners to "Add to Cart" buttons with login check
    function setupAddToCartButtons() {
        const productGrid = document.getElementById('productGrid');
        productGrid.querySelectorAll('.btn-success').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const currentUser = getCurrentUser();
                if (!currentUser) {
                    // Show login first modal
                    loginFirstModal.show();
                    return;
                }
                const product = {
                    name: products[index].name,
                    price: products[index].price
                };
                cart.push(product);
                updateCartCount();
                updateCartModal();
            });
        });
    }

    // Initialize cart UI and setup buttons
    updateCartCount();
    setupAddToCartButtons();
});

