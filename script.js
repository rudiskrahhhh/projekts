// Reģistrācija
function register() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-pass").value;
    const pass2 = document.getElementById("reg-pass2").value;
  
    if (pass !== pass2) return alert("Paroles nesakrīt!");
  
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.email === email)) return alert("E-pasts jau reģistrēts");
  
    users.push({ name, email, password: pass, tasks: [] });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Reģistrācija veiksmīga!");
    window.location = "index.html";
  }
  
  // Pieteikšanās
  function login() {
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;
  
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === pass);
    if (!user) return alert("Nepareizs e-pasts vai parole");
  
    localStorage.setItem("loggedInUser", email);
    window.location = "dashboard.html";
  }
  
  // Atslēgties
  function logout() {
    localStorage.removeItem("loggedInUser");
    window.location = "index.html";
  }
  
  // Uzdevumu pievienošana
  function addTask() {
    const title = document.getElementById("task-title").value;
    const desc = document.getElementById("task-desc").value;
    const date = document.getElementById("task-date").value;
  
    if (!title || !date) return alert("Aizpildi visus laukus");
  
    const users = JSON.parse(localStorage.getItem("users"));
    const email = localStorage.getItem("loggedInUser");
    const user = users.find(u => u.email === email);
  
    user.tasks.push({ title, desc, date, done: false });
    localStorage.setItem("users", JSON.stringify(users));
  
    showTasks();
  }
  
  // Uzdevumu attēlošana
  function showTasks() {
    const list = document.getElementById("task-list");
    if (!list) return;
  
    list.innerHTML = "";
    const users = JSON.parse(localStorage.getItem("users"));
    const email = localStorage.getItem("loggedInUser");
    const user = users.find(u => u.email === email);
  
    user.tasks.forEach((task, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <b>${task.title}</b> (${task.date})<br>
        ${task.desc}<br>
        Statuss: ${task.done ? "✅ Pabeigts" : "⏳ Nepabeigts"}<br>
        <button onclick="toggleTask(${i})">Mainīt statusu</button>
        <button onclick="deleteTask(${i})">Dzēst</button>
      `;
      list.appendChild(li);
    });
  }
  
  // Statusa maiņa
  function toggleTask(i) {
    const users = JSON.parse(localStorage.getItem("users"));
    const email = localStorage.getItem("loggedInUser");
    const user = users.find(u => u.email === email);
  
    user.tasks[i].done = !user.tasks[i].done;
    localStorage.setItem("users", JSON.stringify(users));
    showTasks();
  }
  
  // Dzēst uzdevumu
  function deleteTask(i) {
    const users = JSON.parse(localStorage.getItem("users"));
    const email = localStorage.getItem("loggedInUser");
    const user = users.find(u => u.email === email);
  
    user.tasks.splice(i, 1);
    localStorage.setItem("users", JSON.stringify(users));
    showTasks();
  }
  
  // Uzreiz ielādēt
  