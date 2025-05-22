import { AppBar, Button, Container, TextField, Toolbar, Typography } from "@mui/material";
import Stack from '@mui/material/Stack';
import { useEffect, useState } from "react";
import TodoItem from "./components/TodoItem";
import { getTodos, saveTodos } from "./utils/feature";

const App = () => {
  const [todos,setTodos]=useState<TodoItemType[]>(getTodos());
  const [title,setTitle]=useState<TodoItemType["title"]>("");


  const completeHandler=(id:TodoItemType["id"]):void=>{
    alert(id);
    const newTodo:TodoItemType[]=todos.map((i)=>{
      if(i.id===id) i.iscompleted=!i.iscompleted
      return i;
    })
    setTodos(newTodo);
  };


  const deleteHandler=(id:TodoItemType["id"]):void=>{
    alert(id);
    const newTodo:TodoItemType[]=todos.filter((i)=>i.id!==id)
    setTodos(newTodo);
  };


  const editHandler=(id:TodoItemType["id"],title:TodoItemType["title"]):void=>{
    alert(id);
    const newTodo:TodoItemType[]=todos.map((i)=>{
      if(i.id===id) i.title=title
      return i;
    })
    setTodos(newTodo);
  };


  const submitHandler=():void=>{
    const newTodo:TodoItemType={
      title,
      iscompleted:false,
      id:String(Math.random()*1000)
    }
    setTodos((prev)=>[...prev,newTodo]);
    setTitle("");
  };


  useEffect(() => {
    saveTodos(todos);
  }, [todos]);
  
  return (
    <Container maxWidth="sm">
      <AppBar position="static">
        <Toolbar>
          <Typography>
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack height={"80%"} direction={"column"} spacing={"1rem"} p={"1rem"}>
        {todos.map((i)=>(
          <TodoItem deleteHandler={deleteHandler} completeHandler={completeHandler} editHandler={editHandler} key={i.id} todo={i}/>
        ))}
      </Stack>
      <TextField onKeyDown={(e)=>{
        if(e.key==="Enter" && title!=="") submitHandler();
      }} value={title} onChange={(e)=>setTitle(e.target.value)} fullWidth label={"New Task"}/>
      <Button onClick={submitHandler} disabled={title===""} fullWidth variant="contained">Add</Button>
    </Container>
  )
};

export default App