document.addEventListener('DOMContentLoaded', function() {
    // Login functionality
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Validate inputs
            if (!email || !password) {
                errorMessage.textContent = 'Lūdzu aizpildiet visus laukus';
                return;
            }
            
            // Check if user exists
            const user = StorageService.getUserByEmail(email);
            
            if (!user || user.password !== password) {
                errorMessage.textContent = 'Nepareizs e-pasts vai parole';
                return;
            }
            
            // Login successful
            StorageService.setCurrentUser(user);
            window.location.href = 'dashboard.html';
        });
    }
    
    // Registration functionality
    if (document.getElementById('registerForm')) {
        const registerForm = document.getElementById('registerForm');
        const errorMessage = document.getElementById('errorMessage');

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate inputs
            if (!name || !email || !password || !confirmPassword) {
                errorMessage.textContent = 'Lūdzu aizpildiet visus laukus';
                return;
            }
            
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Paroles nesakrīt';
                return;
            }
            
            if (password.length < 6) {
                errorMessage.textContent = 'Parolei jābūt vismaz 6 simbolus garai';
                return;
            }
            
            // Check if user already exists
            if (StorageService.getUserByEmail(email)) {
                errorMessage.textContent = 'Lietotājs ar šādu e-pastu jau eksistē';
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password
            };
            
            StorageService.addUser(newUser);
            
            // Auto login after registration
            StorageService.setCurrentUser(newUser);
            window.location.href = 'dashboard.html';
        });
    }
    
    // Logout functionality
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            StorageService.clearCurrentUser();
            window.location.href = 'index.html';
        });
    }
    
    // Check authentication on protected pages
    const protectedPages = ['dashboard.html', 'task-form.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const currentUser = StorageService.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'index.html';
        }
        
        // Display user name in dashboard
        if (currentPage === 'dashboard.html' && document.getElementById('userName')) {
            document.getElementById('userName').textContent = currentUser.name;
        }
    }
    
    // Back button functionality
    if (document.getElementById('backBtn') || document.getElementById('cancelBtn')) {
        const backBtn = document.getElementById('backBtn') || document.getElementById('cancelBtn');
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
});