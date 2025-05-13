exports.getproducts=()=>{
    new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve({
                products:[
                    {
                        id:1,
                        name:"product 1",
                        price:200
                    }
                ]
            })
        },2000)
    })
};