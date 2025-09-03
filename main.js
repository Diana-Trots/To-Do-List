// находим элементы на странице
const form = document.querySelector(".form");
const formLabel = form.querySelector("label");
const taskInput = document.getElementById("taskInput");
const tasksList = document.getElementById("tasksList");
const emptyList = document.getElementById("emptyList");
const btns = document.querySelectorAll(".form__btn");

//создаем пустой массив
let tasks = [];

// проверяем есть ли данные в LocalStorage
if (localStorage.getItem("tasks")) {
  // сохраняем данный из LocalStorage в массив
  tasks = JSON.parse(localStorage.getItem("tasks"));
  // отображаем на странице данные из Local Storage
  tasks.forEach((task) => renderTask(task));
}

// проверяем не пустой ли лист задач
checkEmptyList();

//добавление или редактирование задачи
form.addEventListener("submit", (event) => {
  // отменяем отправку формы
  event.preventDefault();
  form.dataset.action === "add" ? addTask() : updateTask();
});

//удаление задачи
tasksList.addEventListener("click", deleteTask);

//Отмечаем задачу завершённой
tasksList.addEventListener("click", toggleTask);

//Редактирование задачи
tasksList.addEventListener("click", editTask);

///////////////////////////Функции//////////////////////////////
function addTask() {
  // достаем текст из поля ввода
  const taskText = taskInput.value;

  // проверяем, не пустое ли поле ввода
  if (taskText === "") {
    return;
  }

  // добовляем задачу в массив tasks
  const newTask = { id: Date.now(), text: taskText, done: false };
  tasks.push(newTask);

  //сохраняем задачу на странице
  renderTask(newTask);

  //очищаем поле ввода и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();

  //проверяем не пустой ли лист задач
  checkEmptyList();

  //сохраняем в LocalStorage
  saveToLocalStorage();
}

function deleteTask(event) {
  //проверяем, чтобы клик был по кнопке "удалить"
  if (event.target.dataset.action !== "delete") {
    return;
  }

  // находим тег li который нужно удалить
  const parentNode = event.target.closest("li");

  //находим id задачи
  const id = +parentNode.id;

  //находим индекс задачи в массиве
  const index = tasks.findIndex((task) => task.id === id);

  //удаляем задачу из массива
  tasks.splice(index, 1);

  //удаляем тег li
  parentNode.remove();

  //проверяем не пустой ли лист задач
  checkEmptyList();

  //сохраняем в LocalStorage
  saveToLocalStorage();
}

function toggleTask(event) {
  //проверяем, чтобы клик был по задаче
  if (!event.target.classList.contains("task")) {
    return;
  }

  // находим li задачи и её id
  const listItem = event.target;
  const id = +listItem.id;

  // находим задачу в массиве tasks
  const task = tasks.find((task) => task.id === id);

  // меняем значение done
  task.done = !task.done;

  console.log(task);

  // отмечаем задачу завершенной или наоборот
  listItem.classList.toggle("task--done");

  //сохраняем в LocalStorage
  saveToLocalStorage();
}

function editTask(event) {
  //проверяем, чтобы клик был по кнопке "удалить"
  if (event.target.dataset.action !== "edit") {
    return;
  }
  // находим тег li, который нужно изменить
  const parentNode = event.target.closest("li");

  //находим текст задачи, которую нужно изменить
  let taskText = parentNode.querySelector("span").textContent;

  // добавляем класс тегу li
  parentNode.classList.add("task--edit");

  // переключаем форму с добавления задачи на редактирование
  form.classList.add("form--edit");
  form.dataset.action = "edit";
  btns.forEach((btn) => {
    btn.classList.toggle("hide");
  });
  taskInput.value = taskText;
  taskInput.focus();
  formLabel.textContent = "Измените задачу";
}

function updateTask() {
  // достаем текст из поля ввода
  const newTaskText = taskInput.value;

  // находим задачу, которую нужно изменить
  const parentNode = document.querySelector(".task--edit");
  const taskTextElement = parentNode.querySelector("span");

  // если новый текст не пустая строка
  if (newTaskText) {
    // меняем задачу
    taskTextElement.textContent = newTaskText;
    //сохраняем в массив tasks
    const id = +parentNode.id;
    const task = tasks.find((task) => task.id === id);
    task.text = newTaskText;
  }

  // удаляем класс task--edit
  parentNode.classList.remove("task--edit");

  // переключаем форму с редактирования на добавление
  form.classList.remove("form--edit");
  form.dataset.action = "add";
  btns.forEach((btn) => {
    btn.classList.toggle("hide");
  });
  taskInput.value = "";
  formLabel.textContent = "Введите задачу";

  //сохраняем в LocalStorage
  saveToLocalStorage();
}

function checkEmptyList() {
  console.log(tasks.length, !!tasks.length);
  if (!tasks.length) {
    const emptyListHTML = `<li id="emptyList" class="empty-list tasks-list__item">
            <p class="empty-list__title">Список дел пуст</p>
          </li>`;

    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  } else {
    const emptyListEL = document.getElementById("emptyList");
    emptyListEL ? emptyListEL.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done
    ? "tasks-list__item task--done"
    : "tasks-list__item";

  const taskHTML = `<li id="${task.id}" class="task ${cssClass}">
            <span class="task__title">${task.text}</span>
            <div class="tasks-list__btns">
              <button type="button" data-action="edit" class="tasks-list__btn">
                <img src="images/edit-pen.svg" alt="Done" />
              </button>
              <button
                type="button"
                data-action="delete"
                class="tasks-list__btn"
              >
                <img src="images/cross.png" alt="Delete" />
              </button>
            </div>
          </li>`;

  // добовляем задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
