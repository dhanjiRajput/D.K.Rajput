const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/exercise")
.then(()=> console.log("Database connected Successully...."))
.catch(err=> console.error("unable to connect database...",err)
);

const courseSchema = new mongoose.Schema({
    name: String,
    author: String, 
    tags: [ String ],
    date: Date, 
    isPublished: Boolean,
    price: Number
  });
  
  const Db = mongoose.model('Db', courseSchema);

  async function getCourses() {
    const result=await Db.find({isPublished:true})
    .or([{tags:'fronted'},{tags:'backend'}])
    .sort({price:-1})
    .select({name:1,author:1})

    console.log(result);
  }

  getCourses();