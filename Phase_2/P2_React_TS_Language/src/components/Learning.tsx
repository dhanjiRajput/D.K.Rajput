import { Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowBack, VolumeUp } from "@mui/icons-material"
import { fetchAudio, translateWords } from "../utils/feature";
import { useDispatch, useSelector } from "react-redux";
import { clearState, getWordsFail, getWordsRequest, getWordsSuccess } from "../Redux/Slices";
import Loader from "./Loader";

const Learning = () => {

    const [count, setCount] = useState<number>(0);

    const [audio,setAudio]=useState<string>("");

    const audioRef=useRef(null);

    const params = useSearchParams()[0].get("language") as LangType

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {loading,error,words}=useSelector((state:{root:StateType})=>state.root);

    const audioHandler=async()=>{
        const player:HTMLAudioElement=audioRef.current!
        if(player){
            player.play();
        }else{
            const data=await fetchAudio(words[count]?.word,params);
        setAudio(data);
        }  
    };

    const nextHandler = (): void => {
        setCount((prev) => prev + 1);
        setAudio("");
    };

    useEffect(() => {
        dispatch(getWordsRequest());
        translateWords(params)
        .then((arr) => dispatch(getWordsSuccess(arr)))
        .catch((err) => dispatch(getWordsFail(err)));

        if(error){
            alert(error);
            dispatch(clearState());
        }
    }, [])

    if(loading) return <Loader/>
    return (
        <Container maxWidth="sm" sx={{ padding: "1rem" }}>
            {audio && <audio src={audio} autoPlay ref={audioRef}></audio>}
            <Button onClick={count === 0 ? () => navigate("/") : () => setCount((prev) => prev - 1)}>
                <ArrowBack />
            </Button>
            <Typography m={"2rem 0"}>Learning Made Easy</Typography>
            <Stack direction={"row"} spacing={"1rem"}>
                <Typography variant="h4">
                    {count + 1}-{words[count]?.word}
                </Typography>
                <Typography color="blue" variant="h4">
                    : {words[count]?.meaning}
                </Typography>
                <Button onClick={audioHandler} sx={{ borderRadius: "50%" }}>
                    <VolumeUp />
                </Button>
            </Stack>
            <Button sx={{
                margin: "3rem 0",
            }} variant="contained" fullWidth onClick={count === words.length-1 ? () => navigate("/quize") : nextHandler}>
                {count === words.length-1 ? "Go Head Quize" : "Next"}
            </Button>
        </Container>
    )
};

export default Learning;