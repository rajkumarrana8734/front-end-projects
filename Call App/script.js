const mainContainer = document.getElementById('mainContainer');
const form = document.getElementById('newCallModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const cardStack = document.querySelector('.card-stack');
const dots = document.querySelectorAll('.right-colors .dot');

const noteForm = document.getElementById('noteForm');
const textInputs = document.querySelectorAll('#noteForm input[type="text"]');
const imageUrlInput = textInputs[0];
const fullNameInput = textInputs[1];
const homeTownInput = textInputs[2];
const purposeInput = textInputs[3];

let currentIndex = 0;


function getTasks() {
  try {
    return JSON.parse(localStorage.getItem('task')) || [];
  } catch (e) {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem('task', JSON.stringify(tasks));
}


function createInfoRow(label, value) {
  const row = document.createElement('div');
  row.className = 'info-row';

  const l = document.createElement('span');
  l.className = 'label';
  l.textContent = label;

  const v = document.createElement('span');
  v.className = 'value';
  v.textContent = value;

  row.append(l, v);
  return row;
}

function createCard(task) {
  const card = document.createElement('div');
  card.className = 'card';

  if (task.color && task.color !== '#ffffff') {
    card.classList.add('colored');
    card.style.backgroundColor = task.color;
  }

  
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  const img = document.createElement('img');
  img.src = task.imageurl;
  img.alt = task.fullname;
  img.onerror = () => img.remove(); // galat URL ho to sirf orange circle dikhega
  avatar.appendChild(img);


  const name = document.createElement('h2');
  name.className = 'name';
  name.textContent = task.fullname;


  const actions = document.createElement('div');
  actions.className = 'actions';

  const callBtn = document.createElement('button');
  callBtn.className = 'btn btn-call';
  const icon = document.createElement('i');
  icon.className = 'ri-phone-fill';
  callBtn.append(icon, ' Call');

  const msgBtn = document.createElement('button');
  msgBtn.className = 'btn btn-message';
  msgBtn.textContent = 'Message';

  actions.append(callBtn, msgBtn);

  card.append(
    avatar,
    name,
    createInfoRow('Home town', task.homecity),
    createInfoRow('Purpose', task.purpose),
    createInfoRow('Category', task.selectedCategory),
    actions
  );

  return card;
}


function showcard() {
  const tasks = getTasks();
  cardStack.innerHTML = '';

  const layer2 = document.createElement('div');
  layer2.className = 'card-layer layer-2';
  const layer1 = document.createElement('div');
  layer1.className = 'card-layer layer-1';
  cardStack.append(layer2, layer1);

  if (tasks.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.style.justifyContent = 'center';
    empty.style.alignItems = 'center';
    empty.style.color = '#666';
    empty.textContent = 'No cards yet. Click + to add one';
    cardStack.appendChild(empty);
    return;
  }

  // index ko range mein rakho (wrap around)
  if (currentIndex >= tasks.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = tasks.length - 1;

  const task = tasks[currentIndex];

  if (task.color && task.color !== '#ffffff') {
    layer1.style.backgroundColor = task.color;
    layer2.style.backgroundColor = task.color;
  }

  cardStack.appendChild(createCard(task));
}


openModalBtn.addEventListener('click', function () {
  form.style.display = 'block';
  mainContainer.style.display = 'none';
});

closeModalBtn.addEventListener('click', function () {
  form.style.display = 'none';
  mainContainer.style.display = 'flex';
});

noteForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const imageurl = imageUrlInput.value.trim();
  const fullname = fullNameInput.value.trim();
  const homecity = homeTownInput.value.trim();
  const purpose = purposeInput.value.trim();
  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value;

  if (imageurl === '') return alert('Please enter an Image URL.');
  if (fullname === '') return alert('Please enter your Full Name.');
  if (homecity === '') return alert('Please enter your Home Town.');
  if (purpose === '') return alert('Please enter a Purpose.');
  if (!selectedCategory) return alert('Please select a Category.');

  const tasks = getTasks();
  tasks.push({
    fullname,
    homecity,
    purpose,
    imageurl,
    selectedCategory,
    color: '#ffffff'
  });
  saveTasks(tasks);

  noteForm.reset();
  form.style.display = 'none';
  mainContainer.style.display = 'flex';

  currentIndex = tasks.length - 1; // naya card turant dikhe
  showcard();
});


upBtn.addEventListener('click', function () {
  currentIndex--;
  showcard();
});

downBtn.addEventListener('click', function () {
  currentIndex++;
  showcard();
});


dots.forEach(function (dot) {
  dot.addEventListener('click', function () {
    const tasks = getTasks();
    if (tasks.length === 0) return;

    tasks[currentIndex].color = dot.dataset.color;
    saveTasks(tasks);
    showcard();
  });
});


showcard();