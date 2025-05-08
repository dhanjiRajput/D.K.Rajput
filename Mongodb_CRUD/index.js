const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/first")
.then(()=> console.log("Database connected Successully...."))
.catch(err=> console.error("unable to connect database...",err)
);


const courseScema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        uppercase:true,
    },
    author:String,
    tags:{
        type:Array,
        validate:{
            isAsync:true,
            validator:function(v,callback){
                setTimeout(()=>{
                    const result= v && v.length>0;
                    callback(result)
                },4000);
            },
            message:"Acourse Should have at least one tags..",
        }
    },
    category:{
        type:String,
        required:true,
        enum:["web","mobile","network"],
    },
    date:{type:Date,default:Date.now},
    isPublished:Boolean,
    price:{
        type:Number,
        required:function(){return this.isPublished},
        get:v=>Math.round(v),
        set:v=>Math.round(v),
    }
});

const Course=mongoose.model("Course",courseScema);

async function createCourse(){
    const course=new Course({
        name:'Angular Course',
        author:'DK',
        category:"web",
        tags:['angular','fronted'],
        isPublished:true,
        price:15,
    });

    try {
        const result=await course.save();
        console.log(result);
    } catch (ex) {
        console.log(ex.message);
    }
}

async function getCourse(){
    const pagenumber=2;
    const pagesize=10;

    const courses=await Course.find({author:'DK',isPublished:true})
    .skip((pagenumber-1)*pagesize)
    .limit(pagesize)
    .sort({name:1})
    .countDocuments()
    .select({name:1,tags:1,author:1});
    
    console.log(courses);
    
}

async function updateCourse(id){
        const course=await Course.findByIdAndUpdate(id,{
        $set:{
            author:'Mosh',
            isPublished:false
        }
    },{new:true});
    console.log(course);
}

async function deleteCourse(id){
    const course=await Course.findByIdAndDelete(id);
    console.log(course);
}

createCourse('681b06e6791fe11897101742');