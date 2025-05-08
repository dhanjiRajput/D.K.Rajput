const Joi=require("joi");
const express=require('express');
const app=express();

app.use(express.json());

const generes=[
    {id:1,gen:"Action"},
    {id:2,gen:"Thriller"},
];

app.post("/api/v1/generes",(req,res)=>{
    const result=validatation(req.body)
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    const cr={
        id:generes.length+1,
        gen:req.body.gen,
    }

    generes.push(cr);
    res.send(cr);

});

app.put("/api/v1/generes/:id",(req,res)=>{
    const cr=generes.find(c=>c.id==parseInt(req.params.id));
    if(!cr){
        res.status(404).send("data not found to update..");
    }

    const result=validatation(req.body)
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    cr.gen=req.body.gen;
    res.send(cr);

});

app.delete("/api/v1/generes/:id",(req,res)=>{
    const cr=generes.find(c=>c.id==parseInt(req.params.id));
    if(!cr){
        res.status(404).send("data not found to delete..");
    }

    const index=generes.indexOf(cr);
    const reslt=generes.splice(index,1);
    res.send(cr);
});

app.get("/api/v1/generes/:id",(req,res)=>{
    const cr=generes.find(c=>c.id==parseInt(req.params.id));
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
