const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/relation")
.then(()=> console.log("Databse Conncted Successfully....."))
.catch(err=>console.log("Unable to connect Databse....!",err));

const authorSchema=new mongoose.Schema({
    name:String,
    bio:String,
    website:String,
});
const Author=mongoose.model("Author",authorSchema);

const courseSchema=new mongoose.Schema({
    name:String,
    author:{type:mongoose.Schema.Types.ObjectId,ref:"Author"},
});
const Course=mongoose.model("Course",courseSchema);

async function createAuthor(name,bio,website){
    const user=new Author({
        name,
        bio,
        website,
    });

    const result=await user.save();
    console.log(result);
};

async function createCourse(name,author){
    try {
        const course=new Course({
            name,
            author,
        });
        const result=await course.save();
        console.log(result);
    } catch (error) {
        console.log("error : ", error); 
    }
};

async function listCourse(){
    const courses=await Course.find()
    .populate('author','name-_id')
    .select('name auhtor')

    console.log(courses);
    
}

// createAuthor("dk","my bio","my website");

//   createCourse("nodejs",'681c344c032682032c6afcec');
listCourse();