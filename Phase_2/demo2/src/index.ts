// console.log("Hello World");

// let age:number=20;

// if(age>50){
//     age+=10;
// }
// console.log(age);

// let employee:{
//     readonly id:number,
//     name:string,
//     retire:(date:Date)=>void,

// }={
//     id:1,
//     name:"DK",
//     retire:(date:Date)=>{
//         console.log(date);
//     }
// }

// console.log(employee);


//Type ALies
// type Employee={
//     readonly id:number,
//     name:string,
//     retire:(date:Date)=>void,
// }

// let employee:Employee={
//     id:1,
//     name:"DK",
//     retire:(date:Date)=>{
//         console.log(date);
//     }
// }

// console.log(employee);

//Unio Types(at a time two datatype)
// function kgtolbs(weight:number|string) {
//     if(typeof weight==='number')
//         return weight*2.2;
//     else
//         return parseInt(weight)*2.2;   
// }

// kgtolbs(10)
// kgtolbs('10Kg')


//Intersaction Types

// type Draggable={
//     drag:()=>void
// };

// type Resizable={
//     resize:()=>void
// };

// type uiWidget=Draggable & Resizable;

// let textBox:uiWidget={
//     drag:()=>{
//         console.log("This is Intersaction Types from Draggable.");
//     },
//     resize:()=>{
//         console.log("This is Intersaction Types from Resizable..");
//     }
// }
// console.log(textBox);

// Literal Types(at a time two value)
// type Quantity=50|100;

// let quantity:Quantity=100;


//Nullable types using union types
// function greet(name:string|null|undefined){
//     if(name){
//         console.log(name.toUpperCase());
//     }else{
//         console.log("Hola!");
//     }
// }
// greet(null);

// Optional Chaining

type Customer={
    birthday:Date
}
function getCustomer(id:number):Customer|null|undefined{
    return id===0?null:{birthday:new Date()}
}

let customer=getCustomer(1);

console.log(customer?.birthday?.getFullYear());