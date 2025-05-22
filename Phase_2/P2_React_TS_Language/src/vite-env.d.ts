/// <reference types="vite/client" />

type LangType="ja"|"fr"|"hi"|"es";

type WordType={
    word:string;
    meaning:string;
    options:string[];
}

interface StateType{
    loading:boolean;
    result:string[];
    error?:string;
    words:WordType[];
};

type FetchedDataType={
    translations:{
        text:string
    }[]
}
