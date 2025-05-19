// enum dayOfTheWeek{
//     MON,TUE,WED,THU,FRI,SAT,SUN
// };

// var day:number=0;

// if(day==dayOfTheWeek.MON){
//     console.log("Its Monday");
// }else{
//     console.log("Its not a Monday");
// }

// console.log(dayOfTheWeek);


// const details:{
//     id:number,
//     name:string,
//     role:[number,string]
// }={
//     id:1,
//     name:"DK",
//     role:[1,"Admin"]
// };

// console.log(details);

function checkNumber(a:any):boolean{
    if(typeof a==="number"){
        return true;
    }else{
        return false;
    }
}

var res=checkNumber(2);
console.log(res);

function checkType(a:any):object{
    if(typeof a==="number"){
        return {
            status:true,
            msg:`${a} is a Number`
        };
    }else{
        return {
            status:false,
            msg:`${a} is a Number`
        };
    }
}

var result=checkType(2);
console.log(result);
