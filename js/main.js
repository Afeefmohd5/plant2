document.addEventListener('DOMContentLoaded', function () {
    // Toggle between sign-in and sign-up forms in the userAuthModal
    const userAuthModal = document.getElementById('userAuthModal');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signUpFormContainer = document.getElementById('signUpFormContainer');
    const modalTitle = document.getElementById('userAuthModalLabel');
    const showSignUpFormLink = document.getElementById('showSignUpForm');
    const showSignInFormLink = document.getElementById('showSignInForm');

    function showSignInForm() {
        loginFormContainer.style.display = 'block';
        signUpFormContainer.style.display = 'none';
        modalTitle.textContent = 'Sign In';
    }

    function showSignUpForm() {
        loginFormContainer.style.display = 'none';
        signUpFormContainer.style.display = 'block';
        modalTitle.textContent = 'Sign Up';
    }

    showSignUpFormLink.addEventListener('click', function (e) {
        e.preventDefault();
        showSignUpForm();
    });

    showSignInFormLink.addEventListener('click', function (e) {
        e.preventDefault();
        showSignInForm();
    });

    userAuthModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        if (button && button.getAttribute('data-default-form') === 'signup') {
            showSignUpForm();
        } else {
            showSignInForm();
        }
    });
});
