document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const loginForm = document.getElementById('loginForm');
    const otpForm = document.getElementById('otpForm');
    const loginSection = document.getElementById('loginSection');
    const otpSection = document.getElementById('otpSection');

    // Navigation logic for the different sections on the login page
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.nav-link.active').classList.remove('active');
            link.classList.add('active');
            
            const sectionId = link.getAttribute('data-section');
            document.querySelector('.content-section.active').classList.remove('active');
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Step 1: Send a request to the server to get an OTP
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        if (name && email) {
            try {
                // Send a request to the server to generate and send the OTP
                const response = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('OTP sent to your email!');
                    sessionStorage.setItem('mievotech_user_name', name);
                    // Hide login form and show OTP form
                    loginSection.classList.add('hidden');
                    otpSection.classList.remove('hidden');
                } else {
                    alert(result.message || 'Failed to send OTP. Please try again.');
                }
            } catch (error) {
                console.error('Error sending OTP request:', error);
                alert('An error occurred. Please check the server logs.');
            }
        } else {
            alert('Please enter both your name and email to continue.');
        }
    });

    // Step 2: Send a request to the server to verify the OTP
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const otpInput = document.getElementById('otpInput').value;

        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, otp: otpInput })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // OTP is correct, set session key and redirect
                    sessionStorage.setItem('mievotech_is_logged_in', 'true');
                    window.location.href = 'index.html';
                } else {
                    alert(result.message || 'Invalid OTP. Please try again.');
                }
            } catch (error) {
                console.error('Error verifying OTP:', error);
                alert('An error occurred during verification. Please try again later.');
            }
        }
    );
});