let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
let currentFilter = 'all';
let editId = null;

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('category');
const levelSelect = document.getElementById('level');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submit');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('search');
const searchCategory = document.getElementById('search-category');
const sortSelect = document.getElementById('sort');
const summaryEl = document.getElementById('summary');
const progressBar = document.getElementById('bar');
const themeBtn = document.getElementById('themeBtn');
const toastEl = document.getElementById('toast');

function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}


themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeBtn.textContent = isLight ? 'Dark mode' : 'Light mode';
});


taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    if (editId) {
        tasks = tasks.map(t => t.id === editId ? {
            ...t,
            text,
            category: categorySelect.value,
            level: levelSelect.value,
            date: dateInput.value
        } : t);
        editId = null;
        submitBtn.textContent = 'Add task';
        showToast('Task updated!');
    } else {
        tasks.push({
            id: Date.now(),
            text,
            category: categorySelect.value,
            level: levelSelect.value,
            date: dateInput.value,
            completed: false
        });
        showToast('Task added!');
    }

    taskForm.reset();
    levelSelect.value = 'Medium';
    saveTasks();
    renderTasks();
});

// Format Date & Check Overdue
function formatDueDate(dateStr, completed) {
    if (!dateStr) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr + 'T00:00:00');
    const formatted = due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    if (!completed && due < today) {
        return `<span class="due-text overdue">Overdue: ${formatted}</span>`;
    }
    return `<span class="due-text">Due: ${formatted}</span>`;
}

// Render Tasks
function renderTasks() {
    const query = searchInput.value.toLowerCase();
    const catFilter = searchCategory.value;
    const sortBy = sortSelect.value;

    let filtered = tasks.filter(t => {
        const matchesStatus =
            currentFilter === 'all' ||
            (currentFilter === 'active' && !t.completed) ||
            (currentFilter === 'done' && t.completed);
        const matchesCat = catFilter === 'All' || t.category === catFilter;
        const matchesSearch = t.text.toLowerCase().includes(query);
        return matchesStatus && matchesCat && matchesSearch;
    });

    // Sorting
    const priorityRank = { High: 1, Medium: 2, Low: 3 };
    if (sortBy === 'priority') {
        filtered.sort((a, b) => priorityRank[a.level] - priorityRank[b.level]);
    } else if (sortBy === 'due') {
        filtered.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    } else if (sortBy === 'newest') {
        filtered.sort((a, b) => b.id - a.id);
    }

    taskList.innerHTML = '';
    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.level} ${task.completed ? 'completed' : ''}`;
        li.draggable = sortBy === 'manual';
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <div>
                    <div class="task-title">${task.text}</div>
                    <div class="task-meta">
                        <span class="badge">${task.category}</span>
                        <span class="badge">${task.level.toLowerCase()}</span>
                        ${formatDueDate(task.date, task.completed)}
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-sm btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="btn-sm btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        // Drag and Drop events
        li.addEventListener('dragstart', () => li.classList.add('dragging'));
        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            updateManualOrder();
        });

        taskList.appendChild(li);
    });

    // Update Summary & Progress Bar
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    summaryEl.textContent = `${done} of ${total} tasks completed`;
    progressBar.style.width = total === 0 ? '0%' : `${(done / total) * 100}%`;
}

// Actions
window.toggleTask = (id) => {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    showToast('Task deleted');
};

window.editTask = (id) => {
    const t = tasks.find(item => item.id === id);
    if (!t) return;
    taskInput.value = t.text;
    categorySelect.value = t.category;
    levelSelect.value = t.level;
    dateInput.value = t.date;
    editId = id;
    submitBtn.textContent = 'Update task';
    taskInput.focus();
};

// Filter Tabs
document.querySelectorAll('#filters button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('#filters .on').classList.remove('on');
        btn.classList.add('on');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Clear Completed
document.getElementById('clearDone').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    showToast('Cleared completed tasks');
});

// Search, Category & Sort Listeners
searchInput.addEventListener('input', renderTasks);
searchCategory.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

// Drag Reorder Logic
taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const siblings = [...taskList.querySelectorAll('.task-item:not(.dragging)')];
    const nextSibling = siblings.find(sib => e.clientY <= sib.offsetTop + sib.offsetHeight / 2);
    taskList.insertBefore(dragging, nextSibling);
});

function updateManualOrder() {
    const orderedIds = [...taskList.querySelectorAll('.task-item')].map(li => Number(li.dataset.id));
    tasks.sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
    saveTasks();
}

// Initial Render
renderTasks();