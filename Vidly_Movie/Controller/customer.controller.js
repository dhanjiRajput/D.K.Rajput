const Joi = require('joi');
const Customer = require('../model/customer.model');

const getCustomer=async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
};

const createCustomer=async (req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.message);

  let customer = new Customer({ 
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();
  res.send(customer);
};

const updateCustomer=async (req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, { new: true });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
};

const deleteCustomer=async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
};

const getCustomerById= async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
};

module.exports = {getCustomer,getCustomerById,createCustomer,updateCustomer,deleteCustomer}; 

const validateCustomer = (customer) => {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean()
    });
    return schema.validate(customer);
};
  