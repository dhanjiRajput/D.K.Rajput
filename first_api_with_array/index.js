const Joi = require('joi');
const express=require('express');

const app=express();

app.use(express.json());

let course = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" }
];

app.get("/",(req,res)=>{
    res.send("welcome to the app...");
});

app.get("/api/v1",(req,res)=>{
    res.send(course);
});

app.get("/api/v1/:id",(req,res)=>{
    const cr=course.find(c=>c.id==parseInt(req.params.id));
    if(!cr){
        res.status(404).send("data not found.....");
    }
    res.send(cr);
});

app.post("/api/v1", (req, res) => {
    
    const result=validatation(req.body); 

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    const cr = {
        id: course.length + 1,
        name: req.body.name
    };

    course.push(cr);
    res.send(cr);
});

app.put("/api/v1/:id",(req,res)=>{
    const cr=course.find(c=>c.id==parseInt(req.params.id));
    if(!cr){
        res.status(404).send("data not found.....");
    }

    const result=validatation(req.body);

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    cr.name=req.body.name;
    res.send(cr);
});


app.delete("/api/v1/:id",(req,res)=>{
    const cr=course.find(c=>c.id==parseInt(req.params.id));
    if(!cr){
        res.status(404).send("data not found.....");
    }
    
    const index=course.indexOf(cr);
    course.splice(index,1);

    res.send(cr);
});

app.listen(3000,()=>{
    console.log("Server Started on port 3000");
});

const validatation=(cr)=>{
    const schema = Joi.object({
        name: Joi.string().min(3).required() 
    });

    return result = schema.validate(cr); 
};