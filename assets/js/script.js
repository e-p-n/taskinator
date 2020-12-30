// GLOBAL VARIABLES
var types = [];
var taskTypeEl = document.querySelector("#task-type");
var tasks = [];
var taskIdCounter = 0;
var buttonEl = document.querySelector("#save-task");
var taskToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");


// FUNCTIONS

// add tasks types to form drop down
var  readTaskType = function(newType) {
    
    // create option element
    let typeOptionEl = document.createElement("option");
    typeOptionEl.textContent = newType;
    typeOptionEl.setAttribute("value", newType);

    // append to select
    taskTypeEl.appendChild(typeOptionEl);

}

// Load task types to "Pick a task type" dropdown from local storage
var loadTasksTypes = function() {
    let savedTaskTypes = localStorage.getItem("taskTypes");
    if (!savedTaskTypes) {
        return false;
    }
    types = JSON.parse(savedTaskTypes);

    for (var i = 0; i < types.length; i++) {
        // pass each object into the readTaskType() function
        readTaskType(types[i]);
    } 
}

// Add new task typ to local storage and drop down and make it the selcted option. 
var addTaskType = function() {
    if (taskTypeEl.value === "Add") {
        let newTaskType = prompt("Enter name for new task type.");
        if (newTaskType) {
            readTaskType(newTaskType);
            taskTypeEl.value = newTaskType;
            types.push(newTaskType);
            saveTaskType();
        } else {
            taskTypeEl.value = "Pick";
        }
    } 
}

// process form for adding new tasks
var taskFormHandler = function(event) {
    event.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;
    //Check to confirm code was filled in
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();

    let isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {

    // package up data as an object
        let taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }
        createTaskEl(taskDataObj);
    }
}


var createTaskEl = function(taskDataObj) { 
    //create list item
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true")

    //create div to hold task info and add to list item
    let taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    var taskActionsEl =  createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    taskToDoEl.appendChild(listItemEl);

   // increase task counter for next unique id
   taskIdCounter++;

   saveTasks();
 
};



var createTaskActions = function(taskId) {
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);


    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};


var taskButtonHandler = function(event) {
    targetEl = event.target;
    if (targetEl.matches(".delete-btn")){
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    } else if (targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
     } 
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    let confirmDelete = confirm("Delete cannot be undone. Are you sure you want to remove this task?");
    if (confirmDelete) {
        taskSelected.remove();
        // create new array to hold updated list of tasks
        var updatedTaskArr = [];

        //loop throgh current tasks
        for (var i = 0; i < tasks.length; i++) {
            // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
            if (tasks[i].id !== parseInt(taskId)){
                updatedTaskArr.push(tasks[i]);
            }
        }
        tasks = updatedTaskArr;
        saveTasks();
    } 
};

var editTask = function(taskId) {

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get the task name and type and add them to the form
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    document.querySelector("input[name='task-name']").value = taskName;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("select[name='task-type']").value = taskType;

    //update button label
    document.querySelector("#save-task").textContent = "Save Task";


    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    for (var i=0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    saveTasks();

}

// update the status and move task to appropriate column
var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  
    if (statusValue === "to do") {
        taskToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's status in array
    for (var i=0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
 
    saveTasks();
};

var dragTaskHandler = function(event) {
    let taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
}

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");

    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;")
    }

}
var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    // set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']")
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    } else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    } else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.removeAttribute("style");
    dropZoneEl.appendChild(draggableElement);

    //loop through array to find and update the updated task's status in array
    for (var i=0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }    
    saveTasks();
}
var dragLeaveHandler = function(event) {    
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

//write tasks array to local storage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var saveTaskType = function() {
    localStorage.setItem("taskTypes",JSON.stringify(types));
}



var loadTasks = function() {
    let savedTasks = localStorage.getItem("tasks");
    if (!savedTasks) {
        return false;
    }
    savedTasks = JSON.parse(savedTasks);

    for (var i = 0; i < savedTasks.length; i++) {
        // pass each object into the createTasksEl() function
        createTaskEl(savedTasks[i]);
    } 
}

// RUN CODE
loadTasks();
loadTasksTypes();

formEl.addEventListener("submit", taskFormHandler);



pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("dragstart", dragTaskHandler);

pageContentEl.addEventListener("dragover", dropZoneDragHandler);

pageContentEl.addEventListener("drop", dropTaskHandler);

pageContentEl.addEventListener("dragleave", dragLeaveHandler);

taskTypeEl.addEventListener("change", addTaskType);

