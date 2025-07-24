//1
// function sum(a,b){
//     return a+b;
// };
// module.exports=sum;



//2
// function myFunction(input){
//     if(typeof input !== 'number'){
//         throw new Error('Invalid Input');
//     }
// };
// module.exports=myFunction;




//3
// function fetchData(callback) {
//     setTimeout(()=>{
//         callback('Penaut Butter')
//     },1000);
// };
// module.exports=fetchData;




//4
function fetchPromise(params) {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>resolve('Penaut Butter'),1000);
    });
};
module.exports=fetchPromise;