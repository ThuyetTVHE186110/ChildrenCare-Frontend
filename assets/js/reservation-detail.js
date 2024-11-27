function proceedToCheckout() {
    // Save cart data
    saveCartToLocalStorage();
    // Redirect to contact page
    window.location.href = '/reservation-contact';
} 