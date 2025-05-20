// alert("Hii Guys");

// let nambo:number=123;
// let nambostr:string="123";

// type userName=(n:number,m:number)=>number;

// let func:userName=(n,m)=>{
//     console.log(n,m);
//     return n*m;
// }
// console.log(func(2,5));

// let arr1:number[]=[1,2,3,4,5];
// let arr2:string[]=['a','b','c','d'];

// console.log(arr1,arr2);

// interface Obj{
//     height:number;
//     weight:number;
//     gender?:boolean;
// }

// interface NewObj extends Obj{
//     scolar:boolean;
// }

// const obj:NewObj={
//     height:20,
//     weight:50,
//     scolar:true,
//     gender:false
// }

// console.log(obj);

// type funcType =(n:number,m:number,l?:number)=>number;

// const func:funcType=(n,m,l)=>{
//     if(typeof l==="undefined") return n*m;

//     return n*m*l;
// }

// func(25,30);

// const func:funcType=(n,m,l=20)=>{
//     return n*m*l;
// }

// func(25,30);

//Rest Operator

type funcType =(...m:number[])=>number[];

const func:funcType=(...m)=>{
   return m;
}

func(25,30,23,5,56,67);