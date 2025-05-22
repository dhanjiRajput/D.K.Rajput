import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState:StateType={
    loading:false,
    words:[],
    result:[],
}
const rootSlice=createSlice({
    name:"root",
    initialState,
    reducers:{
        getWordsRequest:(state)=>{
            state.loading=true;
        },
        getWordsSuccess:(state,action:PayloadAction<WordType[]>)=>{
            state.loading=false;
            state.words=action.payload;
        },
        getWordsFail:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        saveResult:(state,action:PayloadAction<string[]>)=>{
            state.loading=false;
            state.result=action.payload;
        },
        clearState:(state)=>{
            state.loading=false;
            state.result=[];
            state.result=[];
            state.error=undefined;
        },
    },
});

export const {getWordsFail,getWordsRequest,getWordsSuccess,clearState,saveResult}=rootSlice.actions;

export default rootSlice.reducer;