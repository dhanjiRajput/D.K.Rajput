const {Router}=require("express");
const { getCustomer, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require("../Controller/customer.controller");
const customerRoutes=Router();

customerRoutes.get("/",getCustomer);
customerRoutes.get("/:id",getCustomerById);
customerRoutes.post("/",createCustomer);
customerRoutes.put("/:id",updateCustomer);
customerRoutes.delete("/:id",deleteCustomer);

module.exports=customerRoutes;