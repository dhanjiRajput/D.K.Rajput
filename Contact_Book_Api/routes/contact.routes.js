const {Router}=require('express');
const { createContact, addNumberToExistingContact, updateNumberByType, removeNumberToExistingContact, deleteContact, editContact } = require('../controller/contact.controller');
const contactRoutes=Router();

contactRoutes.post("/",createContact);
contactRoutes.put("/:id",addNumberToExistingContact);
contactRoutes.put("/update/:id",updateNumberByType);
contactRoutes.put("/remove/:id",removeNumberToExistingContact);
contactRoutes.delete("/delete/:id",deleteContact);
contactRoutes.put("/edit/:id",editContact);

module.exports=contactRoutes;