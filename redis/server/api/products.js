// products.js
exports.getproducts = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                products: [
                    {
                        id: 1,
                        name: "product 1",
                        price: 200
                    }
                ]
            });
        }, 2000);
    });
};
