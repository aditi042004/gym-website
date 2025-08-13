/**
 * This script handles the authentication check.
 * It runs on the main page (index.html) before anything else loads.
 * Its purpose is to protect the page and redirect users who are not logged in.
 */

// Define a key for sessionStorage. This key will act as our login "token".
const MIEVO_AUTH_KEY = 'mievotech_is_logged_in';

// Check if the login key exists in sessionStorage.
const isLoggedIn = sessionStorage.getItem(MIEVO_AUTH_KEY);

// If the user is NOT logged in and is trying to access a protected page
// (we assume any page other than login/loader is protected),
// we redirect them to the start of the login flow.
if (!isLoggedIn) {
    // We use window.location.replace() so the user cannot click the "back" button
    // to get to the protected main page.
    window.location.replace('loader.html');
}
