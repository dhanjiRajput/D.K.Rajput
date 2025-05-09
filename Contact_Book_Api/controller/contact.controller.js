const asyncMiddleware = require("../middleware/async");
const Contact = require("../model/contact.model")
const Joi=require('joi');

const createContact=asyncMiddleware( async(req,res)=>{
    const { error } = contactJoiSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error.message );
    }
    try {
        const contact=await Contact.create(req.body);
        res.status(201).send(contact);
    } catch (error) {
        return res.status(500).send(error);
    }
});

const addNumberToExistingContact=asyncMiddleware(async(req,res)=>{
    const { error } = phoneJoiSchema.validate(req.body);
    if (error) {    
        return res.status(400).json(error.message );
    }
    const {number,type}=req.body;
    try {
        const contact=await Contact.findByIdAndUpdate(req.params.id,{
            $push:{phones:{number,type}}
        },{new:true});
    
        res.status(201).send(contact);
    } catch (error) {
        return res.status(500).send(error);
    }
});

const updateNumberByType=asyncMiddleware(async(req,res)=>{
    const {id}=req.params;
    const {type,newPhone}=req.body;
    try {
        const contact=await Contact.findOne({_id:id});
        const phoneObj=contact.phones.find(p=>p.type===type);
        console.log(phoneObj);
        phoneObj.number=newPhone;
        await contact.save();
        res.send(contact);
    } catch (error) {
        return res.status(500).send(error);
    }
});

const removeNumberToExistingContact=asyncMiddleware(async(req,res)=>{
    
    const {type,number}=req.body;
    try {
        const contact=await Contact.findByIdAndUpdate(req.params.id,{
            $pull:{phones:{type,number}}
        },{new:true});
    
        res.status(201).send(contact);
    } catch (error) {
        return res.status(500).send(error);
    }
});

const deleteContact=asyncMiddleware(async(req,res)=>{
    const contact=await Contact.findByIdAndDelete(req.params.id);
    res.send(contact);
});

const editContact=asyncMiddleware(async(req,res)=>{
    const {type,number}=req.body;
    const contact=await Contact.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.send(contact);
});


module.exports={createContact,addNumberToExistingContact,updateNumberByType,removeNumberToExistingContact,deleteContact,editContact};

const phoneJoiSchema = Joi.object({
  number: Joi.string().required().min(10).max(12),
  type: Joi.string().valid('HOME', 'OFFICE', 'MOBILE').required()
});

const contactJoiSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).required(),
  city: Joi.string().min(2).max(100).required(),
  phones: Joi.array().items(phoneJoiSchema).min(1).required()
});