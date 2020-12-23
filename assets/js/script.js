var buttonEl = document.querySelector("#save-task");
var taskToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");


var createTaskHandler = function(event) {
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;
    event.preventDefault();
    //create list item
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //create div to hold task info and add to list item
    let taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    taskToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", createTaskHandler);