// находим элементы на странице

const form = document.querySelector(".form");
const formLabel = form.querySelector("label");
const taskInput = document.getElementById("taskInput");
const tasksList = document.getElementById("tasksList");
const emptyList = document.getElementById("emptyList");
const btns = document.querySelectorAll(".form__btn");

//добавление или редактирование задачи
form.addEventListener("submit", (event) => {
  // отменяем отправку формы
  event.preventDefault();

  if (form.dataset.action === "add") {
    addTask();
  } else updateTask();
});

//удаление задачи
tasksList.addEventListener("click", deleteTask);

//Отмечаем задачу завершённой
tasksList.addEventListener("click", toggleTask);

//Редактирование задачи
tasksList.addEventListener("click", editTask);

//Функции
function addTask() {
  // достаем текст из поля ввода
  const taskText = taskInput.value;

  // проверяем, не пустое ли поле ввода
  if (taskText === "") {
    return;
  }

  // формулируем разметку для новой задачи
  const taskHTML = `<li class="task tasks-list__item">
            <span class="task__title">${taskText}</span>
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

  //очищаем поле ввода и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();

  // скрываем emptyList
  if (tasksList.children.length > 1) {
    emptyList.classList.add("hide");
  }
}

function deleteTask(event) {
  //проверяем, чтобы клик был по кнопке "удалить"
  if (event.target.dataset.action !== "delete") {
    return;
  }

  // находим тег li который нужно удалить
  const parentNode = event.target.closest("li");

  //удаляем
  parentNode.remove();

  // проверяем пуст ли список задач
  if (tasksList.children.length === 1) {
    emptyList.classList.remove("hide");
  }
}

function toggleTask(event) {
  //проверяем, чтобы клик был по задаче
  if (!event.target.classList.contains("task")) {
    return;
  }

  // отмечаем задачу завершенной или наоборот
  const listItem = event.target;
  listItem.classList.toggle("task--done");
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
  const taskText = taskInput.value;
  // находим задачу, которую нужно изменить
  const task = document.querySelector(".task--edit");
  const taskTextElement = task.querySelector("span");

  // меняем задачу
  taskTextElement.textContent = taskText;

  // удаляем класс task--edit
  task.classList.remove("task--edit");

  // переключаем форму с редактирования на добавление
  form.classList.remove("form--edit");
  form.dataset.action = "add";
  btns.forEach((btn) => {
    btn.classList.toggle("hide");
  });
  taskInput.value = "";
  formLabel.textContent = "Введите задачу";

  console.log(task);
}
