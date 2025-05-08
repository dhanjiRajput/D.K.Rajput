console.log("Before");
const user=getUser(1);
console.log("After");

const getUser=()=>{
    setTimeout(()=>{
        console.log("its Learning Time..");
        return {id:id,gitHubUsername:"dk"};
        
    },2000);
    return 1;
}