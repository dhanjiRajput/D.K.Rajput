const client = require("./client");

async function init() {
    const result=await client.get("user");
    console.log("Result : ",result);
}

init();