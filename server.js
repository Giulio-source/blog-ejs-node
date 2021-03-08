const express = require("express");
const app = express();
const mongoose = require("mongoose");
const BlogPost = require("./models/BlogPost");
const articlesRouter = require("./routes/articles");

mongoose.connect("mongodb://localhost/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Connected to DB"));
mongoose.set("useFindAndModify", false);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/articles", articlesRouter);

app.get("/", async (req, res) => {
  const posts = await BlogPost.find().sort({ createdAt: "desc" });
  res.render("index", { posts: posts });
});

app.post("/", async (req, res) => {
  const deletePost = await BlogPost.findByIdAndRemove(req.body.id);
  res.redirect("/");
});

app.get("/post", async (req, res) => {
  const posts = await BlogPost.find();
  res.send(posts);
});

app.post("/post", async (req, res) => {
  const date = new Date();
  const dateString =
    (await date.getDate()) + "/" + date.getMonth() + "/" + date.getFullYear();
  const newPost = await BlogPost.create({ title: "Marco", date: dateString });
  res.send("Saved");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
