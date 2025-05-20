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

// type funcType =(...m:number[])=>number[];

// const func:funcType=(...m)=>{
//    return m;
// }

// func(25,30,23,5,56,67);

//function with objects

// interface Product{
//    name:string;
//    stock:number;
//    price:number;
//    photo:string;
// }

// type GetDataType=(product:Product)=>void;

// const getData:GetDataType=(product)=>{
//    console.log(product);
// };

// const productOne={
//    name:"DK",
//    stock:20,
//    price:200,
//    photo:"URL"
// }

// getData(productOne);

//classes
// class Player{
//    id:string;
//    constructor(private height:number,public weight:number,protected power:number
//    ){this.id=String(Math.random()*100)}

//    get getMyHeight():number{
//       return this.height;
//    }
// }

// const p1=new Player(100,150,20);

// class Plater extends Player{
//    special:boolean;
//    constructor(height:number,weight:number,power:number,special:boolean){
//       super(height,weight,power)
//       this.special=special
//    }
// };

// const p2=new Plater(100,200,300,true);
// console.log(p2.getMyHeight);

// interface ProductType{
//    name:string,
//    price:number,
//    stock:number,
//    offer?:boolean,
// }

// interface GIveId {getId:()=>string  }

// class Product implements ProductType,GIveId{
//    private id:string=String(Math.random()*1000);
//    constructor(public name:string,public price:number,public stock:number){}

//    getId=()=> this.id;
// }

// const p1=new Product("DK",100,200);

//Type Assertion
// const btn=document.getElementById("btn")!;
// const btn=document.getElementById("btn") as HTMLElement;
// const btn=<HTMLElement>document.getElementById("btn");
// btn.onclick;

// const img=document.getElementById("myimg") as HTMLImageElement;
// img.src;

// const form=document.getElementById("myform") as HTMLFormElement;
// const myinput= document.querySelector("form>input") as HTMLInputElement;
// const h11=document.getElementById("h1") as HTMLHeadingElement;

// form.onsubmit=(e)=>{
//    e.preventDefault();
//    const value=(Number(myinput.value))+10;
//    console.log(value);
//    console.log(typeof value);
//    const h1=document.createElement("h1");
//    h1.innerText=value.toString();
//    h11.appendChild(h1);
// }

// interface Person{
//    name:string,
//    email:string,
// }

// const obj:Person={
//    name:"DK",
//    email:"dk@gmail.com"
// }

// const getData=(key:keyof Person):string=>{
//    return obj[key];
// }

// console.log(getData("name"));


// * Utility Type
// type User={
//    username:string,
//    name?:string,
//    email:string,
// }
//       //Partial Will Copy the User Completely
// type User2=Partial<User>

//       //Required fields make mandatory and opposite to partials   
// type user3=Required<User>

//       //make Readonly fields
// type user4=Readonly<User>

//       //pick which field u want
// type user5=Pick<User,"email"|"name">

//       //omit which field u dont want
// type user6=Omit<User,"email">

//       //which union type u want to omit
// type myUnion=string|number|boolean;
// type Random=Exclude<myUnion,boolean>


//       // omit null and undefined
// type myUnionn=string|number|boolean|null|undefined;
// type Randomm=NonNullable<myUnionn>


// TypeScript
// const func=<t>(n:t):t=>{
//    return n;
// }

// console.log(func(10));
// console.log(func("10"));
// console.log(func(true));

type Person={
   name:string,
   age:number,
};

const users:Person[]=[
   {
      name:"dk",
      age:29,
   },
   {
      name:"rk",
      age:29,
   },
   {
      name:"nk",
      age:30,
   },
];

const filterByPeoples=(arr:[],property:any,value:any)=>{};