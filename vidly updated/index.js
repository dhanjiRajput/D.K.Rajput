const mongoose=require('mongoose');
const Joi=require("joi");
const express=require('express');
const app=express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/vidly")
.then(()=> console.log("Database connected Successully...."))
.catch(err=> console.error("unable to connect database...",err)
);

const generSchema=new mongoose.Schema({
    gen:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50,
    }
});
const Genre=mongoose.model("Genre",generSchema);

app.get("/api/v1/generes",async(req,res)=>{
    const gen=await Genre.find().sort('name');
    res.send(gen);
});

app.post("/api/v1/generes",async(req,res)=>{
    const result=validatation(req.body)
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    const cr=await Genre.create(req.body);
    res.send(cr);
});

app.put("/api/v1/generes/:id",async(req,res)=>{
    const result=validatation(req.body)
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    const cr=await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true});
    if(!cr){
        res.status(404).send("data not found to update..");
    }
    res.send(cr);

});

app.delete("/api/v1/generes/:id",async(req,res)=>{
    const cr=await Genre.findByIdAndDelete(req.params.id);
    if(!cr){
        res.status(404).send("data not found to delete..");
    }
    res.send(cr);
});

app.get("/api/v1/generes/:id",async(req,res)=>{
    const cr=await Genre.findById(req.params.id);
    if(!cr){
        res.status(404).send("data not found");
    }

    res.send(cr);
});
app.listen(3000,()=>{
    console.log("server started on port 3000");
});

const validatation=(cr)=>{
    const schema = Joi.object({
        gen: Joi.string().min(3).required() 
    });

    return result = schema.validate(cr); 
};
