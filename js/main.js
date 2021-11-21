
let player = document.getElementById("items-list");
new Sortable(player,{
    handle:'.handle',
    animation:200
});
function Todo(text) {
    this.id = Math.floor(Math.random()*1000000).toString();
    this.text = text;
    this.isDone = "notDone"
}
let mode = "";
if(localStorage.getItem("mode") === null) {
    mode = "light"
    localStorage.setItem("mode" , mode)
}
else {
    mode = localStorage.getItem("mode")
}

function setMode() {
    if (mode === "light") {
        document.querySelectorAll(".dark").forEach(element => {
            element.className = element.className.replace("dark" , "light")
        })
        document.getElementById("todo-mode-img").src = "img/moon-solid.svg"
    }
    else {
        document.querySelectorAll(".light").forEach(element => {
            element.className = element.className.replace("light" , "dark")
        })
        document.getElementById("todo-mode-img").src = "img/sun-solid.svg"
    }

}
let TodosInfo = []
if(!!localStorage.todoList){
    TodosInfo = JSON.parse(localStorage.todoList)
}
else {
    TodosInfo.push(new Todo("sample number one"))
    TodosInfo.push(new Todo("sample number two"))
    TodosInfo.push(new Todo("sample number three"))
    TodosInfo.push(new Todo("sample number four"))
    localStorage.setItem("todoList" , JSON.stringify(TodosInfo))
}
const TodoView = (TodoInfo) => {
    return `
        <div class="handle ${TodoInfo.isDone} ${mode}">
             <div class="todo-id">${TodoInfo.id}</div>
             <div class="todo-circle ${mode}">
                <img class="todo-circle-checkmark" src="img/icons8-done.svg" alt="">
             </div>
             <span>${TodoInfo.text}</span>
             <div class="todo-delete">
                  <span class="material-icons">close</span>
              </div>
        </div>
`
}

const generateTodos = (TodoInfoList) => {
    return TodoInfoList.map(TodoInfo => {
        return TodoView(TodoInfo)
    }).join(' ');
}

const TodoContainer = document.getElementById("items-list");
TodoContainer.innerHTML = generateTodos(TodosInfo)
setMode()
function resetQuery() {
    document.querySelectorAll(".todo-delete").forEach(element => {
        element.addEventListener('click', deleteTodo)
    })
    document.querySelectorAll(".handle").forEach(element => {
        element.addEventListener('dragend', rearrangeTodoList)
    })
    document.querySelectorAll(".todo-circle").forEach(element => {
        element.addEventListener('click', toggleIsDone)
    })
}

function activeCount() {
    let count = 0
    for (let todo of TodosInfo) {
        if (todo.isDone === "notDone")
            count++
    }
    document.getElementById("items-count").textContent = count.toString()
}
activeCount()

function rearrangeTodoList(e) {
    let elements = document.getElementsByClassName("todo-id")
    let newTodosInfo = []
    let ids = []
    for (let element of elements) {
        ids.push(element.textContent)
    }
    for (let id of ids) {
        for (let todo of TodosInfo) {
            if(todo.id === id.toString()) {
                newTodosInfo.push(todo)
            }
        }
    }
    TodosInfo = newTodosInfo
    localStorage.todoList = JSON.stringify(TodosInfo)
}

document.querySelectorAll(".handle").forEach(element => {
    element.addEventListener('dragend', rearrangeTodoList)
})
let input = document.getElementById("todo-input")

function addNewTodo(e) {
    if (e.type === "click" || e.keyCode === 13) {
        let newTodo = new Todo(input.value)
        TodosInfo.push(newTodo)
        localStorage.todoList = JSON.stringify(TodosInfo)
        TodoContainer.innerHTML = generateTodos(TodosInfo)
        input.value = ""
        activeCount()
        resetQuery()
    }
}

document.getElementById("todo-click").addEventListener("click",addNewTodo)
document.getElementById("todo-input").addEventListener("keypress",addNewTodo)

function deleteTodo(e) {
    let id = e.target.parentElement.parentElement.getElementsByClassName("todo-id")[0].textContent
    for (let index in TodosInfo) {
        if(TodosInfo[index].id === id.toString()) {
            TodosInfo.splice(parseInt(index) , 1)
        }
    }
    localStorage.todoList = JSON.stringify(TodosInfo)
    TodoContainer.innerHTML = generateTodos(TodosInfo)
    activeCount()
    resetQuery()
}

document.querySelectorAll(".todo-delete").forEach(element => {
    element.addEventListener('click', deleteTodo)
})

function toggleIsDone(e) {
    let id = e.target.parentElement.getElementsByClassName("todo-id")[0].textContent
    for (let index in TodosInfo) {
        if(TodosInfo[index].id === id.toString()) {
            if (TodosInfo[index].isDone === "Done") {
                TodosInfo[index].isDone = "notDone"
            }
            else {
                TodosInfo[index].isDone = "Done"
            }
        }
    }
    localStorage.todoList = JSON.stringify(TodosInfo)
    TodoContainer.innerHTML = generateTodos(TodosInfo)
    activeCount()
    resetQuery()
}

document.querySelectorAll(".todo-circle").forEach(element => {
    element.addEventListener('click', toggleIsDone)
})

function TodoFilter(e) {
    let clicked = e.target.parentElement.parentElement.getElementsByClassName("clicked")[0]
    clicked.className = ""
    e.target.className = "clicked"
    if (e.target.textContent === "All") {
        document.querySelectorAll(".handle").forEach(element => {
            element.style.display = "flex"
        })
    }
    else if (e.target.textContent === "Active") {
        document.querySelectorAll(".notDone").forEach(element => {
            element.style.display = "flex"
        })
        document.querySelectorAll(".Done").forEach(element => {
            element.style.display = "none"
        })
    }
    else if (e.target.textContent === "Completed") {
        document.querySelectorAll(".Done").forEach(element => {
            element.style.display = "flex"
        })
        document.querySelectorAll(".notDone").forEach(element => {
            element.style.display = "none"
        })
    }
}

document.getElementById("todo-show-all").addEventListener("click",TodoFilter)
document.getElementById("todo-show-active").addEventListener("click",TodoFilter)
document.getElementById("todo-show-completed").addEventListener("click",TodoFilter)

function clearDone(e) {
    for (let index in TodosInfo)
    {
        if (TodosInfo[index].isDone === "Done"){
            TodosInfo.splice(parseInt(index) , 1)
        }
    }
    localStorage.todoList = JSON.stringify(TodosInfo)
    TodoContainer.innerHTML = generateTodos(TodosInfo)
    activeCount()
    resetQuery()
}

document.getElementById("todo-clear").addEventListener("click",clearDone)

function switchMode(e) {
    document.querySelectorAll(`.${mode}`).forEach(element => {
        if (mode === "light") {
            element.className = element.className.replace("light" , "dark")
        }
        else {
            element.className = element.className.replace("dark" , "light")
        }
    })
    if (mode === "light"){
        mode = "dark"
        document.getElementById("todo-mode-img").src = "../img/sun-solid.svg"
    }
    else {
        mode = "light"
        document.getElementById("todo-mode-img").src = "../img/moon-solid.svg"
    }

    localStorage.mode = mode
}

document.getElementById("todo-mode").addEventListener("click", switchMode)