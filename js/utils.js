// Utility functions that might be used across the application

// Format date in a user-friendly way
function formatDateRelative(date) {
    const now = new Date();
    const diffInDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
        return 'Šodien';
    } else if (diffInDays === 1) {
        return 'Rīt';
    } else if (diffInDays === -1) {
        return 'Vakar';
    } else if (diffInDays > 0) {
        return `Pēc ${diffInDays} dienām`;
    } else {
        return `Pirms ${Math.abs(diffInDays)} dienām`;
    }
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Export functions if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDateRelative,
        debounce,
        isValidEmail
    };
}