import './style.css'

interface Todo{
  title:string,
  isCompleted:boolean,
  readonly id:string
};

const todos:Todo[]=[];

const todoContainer=document.querySelector(".todoContainer") as HTMLDivElement;

const inputElement=document.getElementById("title") as HTMLInputElement;

const myForm=document.getElementById("myForm") as HTMLFormElement;

myForm.onsubmit=(e:SubmitEvent)=>{
  e.preventDefault();

  const todo:Todo={
    title:inputElement.value,
    isCompleted:false,
    id:String(Math.random()*1000),
  };

  todos.push(todo);
  inputElement.value="";
  renderTodo(todos);
};

const generateTodoItem=(title:string,isCompleted:boolean,id:string)=>{
  const todo:HTMLDivElement=document.createElement("div");
  todo.className="todo";

  const checkbox:HTMLInputElement=document.createElement("input");
  checkbox.setAttribute("type","checkbox");
  checkbox.className="isCompleted";
  checkbox.checked=isCompleted;
  checkbox.onchange=()=>{
    todos.find((item)=>{
      if(item.id==id) item.isCompleted=checkbox.checked;
    })
    paragraph.className=checkbox.checked ?"textcut":"";
  }

  const paragraph:HTMLParagraphElement=document.createElement("p");
  paragraph.innerText=title;
  paragraph.className=isCompleted ?"textcut":"";

  const deletebtn:HTMLButtonElement=document.createElement("button");
  deletebtn.innerText="X";
  deletebtn.className="deleteBtn";
  deletebtn.onclick=()=>{
    deleteTodo(id);
  }

  todo.append(checkbox,paragraph,deletebtn);

  todoContainer.append(todo);
};

const deleteTodo=(id:string)=>{
  const idx=todos.findIndex((item)=>item.id===id);
  todos.splice(idx,1);
  renderTodo(todos);
}

const renderTodo=(todos:Todo[])=>{
  todoContainer.innerText="";
  todos.forEach((item)=>{
    generateTodoItem(item.title,item.isCompleted,item.id);
  });
};