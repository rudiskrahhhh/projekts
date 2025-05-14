class StorageService {
    // Users storage
    static getUsers() {
        return JSON.parse(localStorage.getItem('taskManagerUsers')) || [];
    }

    static saveUsers(users) {
        localStorage.setItem('taskManagerUsers', JSON.stringify(users));
    }

    static getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    static addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
    }

    // Tasks storage
    static getTasks(userId) {
        const tasks = JSON.parse(localStorage.getItem(`taskManagerTasks_${userId}`)) || [];
        return tasks.map(task => ({
            ...task,
            dueDate: new Date(task.dueDate),
            createdAt: new Date(task.createdAt)
        }));
    }

    static saveTasks(userId, tasks) {
        localStorage.setItem(`taskManagerTasks_${userId}`, JSON.stringify(tasks));
    }

    static addTask(userId, task) {
        const tasks = this.getTasks(userId);
        tasks.push(task);
        this.saveTasks(userId, tasks);
    }

    static updateTask(userId, taskId, updatedTask) {
        const tasks = this.getTasks(userId);
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
            this.saveTasks(userId, tasks);
            return true;
        }
        return false;
    }

    static deleteTask(userId, taskId) {
        const tasks = this.getTasks(userId);
        const filteredTasks = tasks.filter(t => t.id !== taskId);
        this.saveTasks(userId, filteredTasks);
    }

    // Session storage
    static setCurrentUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    static getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    }

    static clearCurrentUser() {
        sessionStorage.removeItem('currentUser');
    }
}