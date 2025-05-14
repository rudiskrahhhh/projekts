document.addEventListener('DOMContentLoaded', function() {
    const currentUser = StorageService.getCurrentUser();
    if (!currentUser) return;
    
    // Dashboard functionality
    if (document.getElementById('taskList')) {
        const taskList = document.getElementById('taskList');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const filterStatus = document.getElementById('filterStatus');
        const sortBy = document.getElementById('sortBy');
        
        // Load tasks
        function loadTasks() {
            let tasks = StorageService.getTasks(currentUser.id);
            
            // Filter tasks
            const statusFilter = filterStatus.value;
            if (statusFilter === 'completed') {
                tasks = tasks.filter(task => task.completed);
            } else if (statusFilter === 'pending') {
                tasks = tasks.filter(task => !task.completed);
            }
            
            // Sort tasks
            const sortField = sortBy.value;
            tasks.sort((a, b) => {
                if (sortField === 'dueDate') {
                    return a.dueDate - b.dueDate;
                } else if (sortField === 'createdAt') {
                    return b.createdAt - a.createdAt;
                } else if (sortField === 'title') {
                    return a.title.localeCompare(b.title);
                }
                return 0;
            });
            
            renderTasks(tasks);
        }
        
        // Render tasks
        function renderTasks(tasks) {
            taskList.innerHTML = '';
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<p class="no-tasks">Nav pievienotu uzdevumu</p>';
                return;
            }
            
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-card ${task.completed ? 'completed' : ''}`;
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isOverdue = !task.completed && task.dueDate < today;
                
                taskElement.innerHTML = `
                    <h3>${task.title}</h3>
                    <p class="description">${task.description || 'Nav apraksta'}</p>
                    <p class="due-date ${isOverdue ? 'overdue' : ''}">
                        Termiņš: ${formatDate(task.dueDate)} ${isOverdue ? '(Nokavēts)' : ''}
                    </p>
                    <span class="status">${task.completed ? 'Pabeigts' : 'Nepabeigts'}</span>
                    <div class="task-actions">
                        <button class="btn btn-secondary edit-btn" data-id="${task.id}">Rediģēt</button>
                        <button class="btn btn-secondary toggle-btn" data-id="${task.id}">
                            ${task.completed ? 'Atzīmēt kā nepabeigtu' : 'Atzīmēt kā pabeigtu'}
                        </button>
                        <button class="btn btn-secondary delete-btn" data-id="${task.id}">Dzēst</button>
                    </div>
                `;
                
                taskList.appendChild(taskElement);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    window.location.href = `task-form.html?edit=${this.getAttribute('data-id')}`;
                });
            });
            
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    toggleTaskStatus(this.getAttribute('data-id'));
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    deleteTask(this.getAttribute('data-id'));
                });
            });
        }
        
        // Toggle task status
        function toggleTaskStatus(taskId) {
            const tasks = StorageService.getTasks(currentUser.id);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                StorageService.saveTasks(currentUser.id, tasks);
                showNotification(`Uzdevums "${tasks[taskIndex].title}" atzīmēts kā ${tasks[taskIndex].completed ? 'pabeigts' : 'nepabeigts'}`);
                loadTasks();
            }
        }
        
        // Delete task
        function deleteTask(taskId) {
            if (confirm('Vai tiešām vēlaties dzēst šo uzdevumu?')) {
                StorageService.deleteTask(currentUser.id, taskId);
                showNotification('Uzdevums veiksmīgi dzēsts');
                loadTasks();
            }
        }
        
        // Add task button
        addTaskBtn.addEventListener('click', function() {
            window.location.href = 'task-form.html';
        });
        
        // Filter and sort changes
        filterStatus.addEventListener('change', loadTasks);
        sortBy.addEventListener('change', loadTasks);
        
        // Initial load
        loadTasks();
    }
    
    // Task form functionality
    if (document.getElementById('taskForm')) {
        const taskForm = document.getElementById('taskForm');
        const errorMessage = document.getElementById('errorMessage');
        const taskIdInput = document.getElementById('taskId');
        const titleInput = document.getElementById('title');
        const descriptionInput = document.getElementById('description');
        const dueDateInput = document.getElementById('dueDate');
        const completedInput = document.getElementById('completed');
        const formTitle = document.getElementById('formTitle');
        
        // Check if we're editing a task
        const urlParams = new URLSearchParams(window.location.search);
        const editTaskId = urlParams.get('edit');
        
        if (editTaskId) {
            formTitle.textContent = 'Rediģēt uzdevumu';
            
            // Load task data
            const tasks = StorageService.getTasks(currentUser.id);
            const task = tasks.find(t => t.id === editTaskId);
            
            if (task) {
                taskIdInput.value = task.id;
                titleInput.value = task.title;
                descriptionInput.value = task.description || '';
                dueDateInput.value = formatDateForInput(task.dueDate);
                completedInput.checked = task.completed;
            } else {
                window.location.href = 'dashboard.html';
            }
        }
        
        // Form submission
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = titleInput.value.trim();
            const description = descriptionInput.value.trim();
            const dueDate = dueDateInput.value;
            const completed = completedInput.checked;
            
            // Validate inputs
            if (!title || !dueDate) {
                errorMessage.textContent = 'Lūdzu aizpildiet visus obligātos laukus';
                return;
            }
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(dueDate);
            
            if (selectedDate < today && !completed) {
                if (!confirm('Izvēlētais termiņš jau ir pagājis. Vai tiešām vēlaties turpināt?')) {
                    return;
                }
            }
            
            const taskData = {
                id: taskIdInput.value || Date.now().toString(),
                title,
                description,
                dueDate: new Date(dueDate),
                completed,
                createdAt: taskIdInput.value ? 
                    StorageService.getTasks(currentUser.id).find(t => t.id === taskIdInput.value).createdAt : 
                    new Date()
            };
            
            // Save task
            if (taskIdInput.value) {
                // Update existing task
                StorageService.updateTask(currentUser.id, taskIdInput.value, taskData);
                showNotification('Uzdevums veiksmīgi atjaunināts');
            } else {
                // Add new task
                StorageService.addTask(currentUser.id, taskData);
                showNotification('Uzdevums veiksmīgi pievienots');
            }
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
});

// Helper functions
function formatDate(date) {
    return date.toLocaleDateString('lv-LV', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}