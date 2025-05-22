import { Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import {ArrowBack, VolumeUp} from "@mui/icons-material"
import { translateWords } from "../utils/feature";

const Learning = () => {
    const [count,setCount]=useState<number>(0);

    const params=useSearchParams()[0].get("language") as LangType

    const navigate=useNavigate();
    

    const nextHandler=():void=>{
        setCount((prev)=>prev+1);
    };

    useEffect(()=>{
        translateWords("hi").then(()=>{
            console.log("wroked");  
        })
    },[])
  return (
    <Container maxWidth="sm" sx={{padding:"1rem"}}>
        <Button onClick={count===0?()=>navigate("/"):()=>setCount((prev)=>prev-1)}>
            <ArrowBack/>
        </Button>
        <Typography m={"2rem 0"}>Learning Made Easy</Typography>
        <Stack direction={"row"} spacing={"1rem"}>
            <Typography variant="h4">
                {count+1}-{"sample"}
            </Typography>
            <Typography color="blue" variant="h4">
                : {"Lol"}
            </Typography>
            <Button sx={{borderRadius:"50%"}}>
                <VolumeUp/>
            </Button>
        </Stack>
        <Button sx={{
            margin:"3rem 0",
        }} variant="contained" fullWidth onClick={count===7?()=>navigate("/quize"):nextHandler}>
            {count===7 ?"Go Head Quize":"Next"}
        </Button>
    </Container>
  )
}

export default Learning