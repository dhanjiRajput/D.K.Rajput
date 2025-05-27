// IIFE  (Immediate Invoked function expression)
// (function goto() {
//     var foo = "hello";
//     console.log(foo);
// })();


//Closures

// function add(num){
//     function display(b){
//         console.log(num+b);
//     }
//     return display;
// }
// let addto5=add(5);
// let addto10=add(10);

// addto5(2);
// addto5(10);

// addto10(2);
// addto10(10);

//Real Example of Clousers in html

// const myname=document.getElementById("myname")
// const btn=document.getElementById("clickme")

// function maketextsizer(size){
//     function chngesize(){
//         myname.style.fontSize=`${size}px`;
//     }
//     return chngesize;
// }
// const size12=maketextsizer(12);
// const size22=maketextsizer(22);
// const size52=maketextsizer(52);
// const size100=maketextsizer(100);

// btn.addEventListener("click",size100);

//Hoisting
// game();
// console.log(x);
// console.log(game);

// var x=7;

// function game(){
//     console.log("Welcome to the future....");   
// }



//Currying

// function add(a){
//     return function(b){
//         return function(c){
//             return a+b+c;
//         }
//     }
// }

//modern javascript ES6
// const add=(a)=>(b)=>(c)=>a+b+c;

// console.log(add(2)(3)(4));

//this is old javascript
// function sendAutoEmail(to){
//     return function(subject){
//         return function(body){
//             console.log(`send enail to  ${to} with th subject of ${subject} and this content ${body}`);
//         }
//     }
// }

// this is ES6 version of javscript
// const sendAutoEmail=(to)=>(subject)=>(body)=>`send enail to  ${to} with th subject of ${subject} and this content ${body}`

// let step1=sendAutoEmail('kidechadhanji@gmail.com');
// let step2=step1('new order confirmation');
// console.log(step2("Hiii, ur the ready to receve your order we dispatch from here..."));

// let naming={
//     fname:"D.K.",
//     lname:"Rajput"
// }

// let printfullname=function(home,state){
//     console.log(this.fname+" "+this.lname+" from "+home+" and state of "+state);
// }

// //call method
// printfullname.call(naming,"Surat","Gujarat");

// //apply method
// printfullname.apply(naming,["Surat","Gujarat"]);

// //bind Method or Currying
// let data=printfullname.bind(naming);
// data("surat","Gujarat");


//Memoization(caching the data)
// function memoizedSquare(){
//     const cache={};

//     return function(n){
//         if(n in cache){
//             console.log("Fetchinf Data from Cache..");
//             return cache[n];
//         }else{
//             console.log("Calculating Result..");
//             const result=n*n;
//             cache[n]=result;
//             return result;
//         }
//     }
// }

// const square=memoizedSquare();
// console.log(square(5));

// console.log(square(5));

// function memoizedFibo(){
//     let cache={};

//     function fib(n){
//         if(n in cache) return cache[n];
//         if(n<=1) return n;
//         cache[n]=fib(n-1) + fib(n-2);
//         return cache[n];
//     }

//     return fib;
// }

// const fib=memoizedFibo();

// console.log(fib(5));



//Polymorphism  (Method Overriding and Method Overloading)

//Method Overrinding (different class ,same name, same parameteer) Run time Polymorphism

// class Animal{
//     speak(){
//         console.log("somethig Speaking.");
//     };
// };

// class Cat extends Animal{
//     speak(){
//         console.log("Cat speaks Mewwww.");
//     };
// };

// class Dogs extends Animal{
//     speak(){
//         console.log("Dogs speak Bhav bhav..");
//     };
// };

// const sounds=[new Animal(),new Cat(),new Dogs()]

// sounds.forEach(an=>an.speak());


// //Method Overloading ( same class ,same name, different Parameter)

// function greet(name,age){
//     if(arguments.length===1){
//         console.log(`Helllo ${name}`);
//     }else if(arguments.length===2){
//         console.log(`Hello ${name} and my age is ${age}`);
//     }else{
//         console.log("Welcome to the Future.....");
//     }
// }

// greet("DK");
// greet("Dk",20);
// greet();


//Duck Typing (Dynamic Polymorphism)

// const car={
//     move:()=>console.log("Car is Moving"),
// };

// const bus={
//     move:()=>console.log("Bus is Moving"),
// };

// const train={
//     move:()=>console.log("Train is Moving"),
// };

// function run(go){
//     go.move();
// }

// run(car);
// run(bus);
// run(train);

// callback/promises/async Await


// async function notifyCustomer() {
//     const customer = await getCustomer(1);
//     console.log('Customer: ', customer);
//     if (customer.isGold) {
//       const movies = await getTopMovies();
//       console.log('Top movies: ', movies);
//       await sendEmail(customer.email, movies);
//       console.log('Email sent...');
//     }
// }
//   notifyCustomer();
  
  
//   function getCustomer(id) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve({ 
//           id: 1, 
//           name: 'Mosh Hamedani', 
//           isGold: true, 
//           email: 'email' 
//         });
//       }, 4000);  
//     });
//   }
  
//   function getTopMovies() {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(['movie1', 'movie2']);
//       }, 4000);
//     });
//   }
  
//   function sendEmail(email, movies) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve();
//       }, 4000);
//     });
//   }

//Print data next by next
// function getData(data,nextDatta){
//     console.log(`Data ${data} is Fetching...`);
//     setTimeout(() => {
//         console.log(data);
//         nextDatta();
//     },2000);
// };
// //This is a Callback Hell(Nested Callback)
// getData(1,()=>{
//     getData(2,()=>{
//         getData(3,()=>console.log("You Fetched All Data..."));
//     })
// })

// let promise=new Promise((resolve,reject)=>{
//     console.log("i am Promise");
//     reject("fail");
// });
// console.log(promise);


// function getData(data){
//     return promise=new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             console.log(data);
//             resolve("successs get Data");
//         },5000)
//     })
// };

// getData(123);
// promise.then((result) => {
//     console.log("success");
// }).catch((err) => {
//     console.log("Failed...");
// });

// promise chaining
// function getData(data){
//     console.log(`Data is fetching....`);
    
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             console.log(data);
//             resolve("successs get Data");
//         },2000)
//     });
    
// };

// getData(123)
//     .then((res)=> getData(456))
//     .then((res)=> getData(789))
//     .then((res)=> getData(1011))
//     .then((res)=> getData(1213))


// async await
// function getData(data){
//     console.log(`Data is fetching....`);
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             console.log(data);
//             resolve("successs get Data");
//         },2000)
//     });
// };

// async function getAllData() {
//     await getData(123);
//     await getData(456);
//     await getData(789);
// }

// codes  => call Stack  => starting Execute
            // (if in call stack we will get the asychnous function like settimeout function etc..)
            //              => Web Api   => Task Queu (this resolve timer function)
            //                           => Miecro Task Queu (this resolve primise)  
                        

// function Person(fname,lname,contact){
//     this.fname=fname;
//     this.lname=lname;
//     this.contact=contact;
//     this.getName=function(){
//         console.log(this.fname,this.lname);
//     }
// };

// const p1=new Person("DK","Rajput","4343434");


// console.log(p1);


// const p1={
//     fname:"dk",
//     lname:"rajput",
//     getFullName(){
//         return `${this.fname}  ${this.lname}`
//     }
// };

// const p2=Object.create(p1);

// console.log("P1 is :",p1);
// console.log("P2 is :",p2);


// function makeIterator(start=0,end=Infinity,step=1){
//     let nextStart=start;
//     let iterationCount=0;

//     return{
//         next(){
//             let result;
//             if(iterationCount<end){
//                 result={value:nextStart,done:false}
//                 nextStart=nextStart+step;
//                 iterationCount++;
//                 return result;
//             }
//             return {value:iterationCount,done:true}
//         }
//     }
// }

// const myIterator=makeIterator(15,20,1);
// let result=myIterator.next();

// while(!result.done){
//     console.log(result.value);
//     result=myIterator.next();
// }

//Genrators 

// function* makeMyIterator(start,end){
//     for(let i=start;i<=end;i++){
//         yield i;
//     }
// }

// const one=makeMyIterator(10,20)

// for(const val of one){
//     console.log(val);
// }



