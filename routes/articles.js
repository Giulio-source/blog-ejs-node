const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");
const slugify = require("slugify");

router.get("/new", (req, res) => {
  res.render("new", { post: new BlogPost() });
});

router.get("/:slug", async (req, res) => {
  const getPost = await BlogPost.findOne({ slug: req.params.slug });
  if (getPost == null) res.redirect("/");
  res.render("detail", { post: getPost });
});

router.get("/edit/:id", async (req, res) => {
  const getPost = await BlogPost.findById(req.params.id);
  res.render("edit", { post: getPost });
});

router.post("/new", async (req, res) => {
  const date = new Date();
  const dateString =
    date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
  const newPost = new BlogPost({
    title: req.body.new_title,
    date: dateString,
    content: req.body.new_content,
  });
  try {
    await newPost.save();
  } catch (error) {
    res.status(400);
  }
  res.redirect(`/articles/${newPost.slug}`);
});

router.post("/edit", async (req, res) => {
  const getPost = await BlogPost.findByIdAndUpdate(req.body.id, {
    title: req.body.new_title,
    content: req.body.new_content,
    slug: slugify(req.body.new_title, { lower: true, strict: true }),
  });
  res.redirect(`/`);
});

module.exports = router;
