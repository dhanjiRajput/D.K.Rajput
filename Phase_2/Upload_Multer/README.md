### How to Upload a file using Multer

To upload a file using Multer, you can follow these steps:
1. Install Multer using npm : `npm install multer` add
2. Import Multer in your Node.js file: `const multer = require('multer');`

# Create uploads Folder

## multer.js
const multer = require('multer');
const path = require('path');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'/uploads');
    };
    filename:(req,file,cb)=>{
        const fileName=`${Date.now()}-${file.originalName}`
        cb(null,fileName);
    };
});

const upload=multer({storage:storage});
module.exports=upload;

3. use in controller while create the data

exports.createBlog = async (req, res) => {
    const {title}=req.body;
    const blog=await User.create({
        title,
        profilePicture: `/uploads/${req.file.filename}`,
    });
    res.redirect("http://localhost:3000/upload");
};

4. use in route 

userRoutes.post("/upload",uploads.single('profilePicture'),createBlog);

5. app.js

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("Views",path.join(__dirname,"Views"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));

6.  set render file

exports.getPage = async (req, res) => {
  try {
    const data = await User.find(); // assuming Mongoose
    res.render('index', { data }); // this must be an array
  } catch (err) {
    console.error(err);
    res.render('index', { data: [] }); // fallback to empty array
  }
};

7. set index.ejs file

<div class="container">
    <h1 class="text-center mb-4">Add Blog</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data" class="border p-4 bg-white shadow-sm rounded">
      <div class="mb-3">
        <label for="profilePicture" class="form-label">Cover Image</label>
        <input type="file" id="profilePicture" name="profilePicture" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="title" class="form-label">Blog Title</label>
        <input type="text" id="title" name="title" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Add Blog</button>
    </form>
  </div>

  <div class="container">
    <h2 class="mt-5 mb-3">Uploaded Blogs</h2>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <% if (Array.isArray(data)) { %>
        <% data.forEach(element => { %>
          <div class="col">
            <div class="card shadow-lg border-0 h-100">
              <img src="<%= element.profilePicture %>" class="card-img-top img-fluid" alt="Blog Image" />

              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title text-primary fw-bold"><%= element.title %></h5>
              </div>
            </div>
          </div>
        <% }) %>
      <% } else { %>
        <div class="col-12">
          <p class="text-muted">No blog data available.</p>
        </div>
      <% } %>
    </div>
  </div>

