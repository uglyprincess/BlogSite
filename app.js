//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "This blogsite was created by Aaryan Bhardwaj on a fine evening when he realized that upon close inspection, life, the universe and everything in it bears no inherent meaning or order. Everything is random and disconnected, in the sense that there is really nothing along the lines of karmic justice in the world. We all operate on our independent frequencies, each sure of that somehow our understanding of life and its purpose is the only correct way of perceiving it, and that everyone else must be wrong. But every so often, we are faced with something completely inexplicable and random, something that we had no hand in bringing about and shouldn't by any logical system have any affect on our lives. But it does, because no one exists in a vacuum. We are constantly affecting the lives of others in ways we can never fully grasp; in a certain manner, in fact, none of us really do have free will. The website employs some rather basic back-end and front-end. Also if you want to write your own blogs, simply go to the title bar and type compose.";
const contactContent = "There are a couple of buttons down below, click them if you want to tell me how hideous this site looks, or if you want to offer me a sizeable sum of money in return for me never being within a two-metre of radius of web development again. :)";
const actualAbout = "To compose a new blog, simply go to the address bar and type 'compose'.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  fakeTitle: String,
  content: String,
  link: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  // res.render("home", {firstPara: homeStartingContent, Model: Post});

  Post.find({}, function(err, posts){
    res.render("home", {firstPara: homeStartingContent, postsHere: posts});
  });

});

app.get("/about", function(req, res){
  res.render("about", {secondPara: aboutContent, thirdPara: actualAbout});
});

app.get("/contact", function(req, res){
  res.render("contact", {thirdPara: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const userPost = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  userPost.save(function(err){
    if(!err) {
      res.redirect("/");
    }
  });

  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postContent,
  //   link: "posts/" + req.body.postTitle
  // };

  // posts.push(post);

  // res.redirect("/");
});

app.get("/posts/:postName", function(req, res){

  var postID = req.params.postName;

  Post.find({_id: postID}, function(err, result){
    if(result !== null)
    {
      console.log("Match found!");
      // console.log(result[0]);
      res.render("post", {newTitle: result[0].title, newPost: result[0].content});
    }
  });

  // var browserTitle = lodash.kebabCase(req.params.postName);
  //
  // Post.find({}, function(err, results){
  //   results.forEach(function(result){
  //     var userTitle = lodash.kebabCase(result.title);
  //     if(userTitle === browserTitle)
  //     {
  //       console.log("Match found!");
  //       res.render("post", {newTitle: result.title, newPost: result.content});
  //     }
  //
  //   });
  // });

  // posts.forEach(function(post){
  //   var userTitle = lodash.kebabCase(post.title);
  //   var browserTitle = lodash.kebabCase(req.params.postName);
  //
  //   if(userTitle === browserTitle)
  //   {
  //     console.log("Match found!");
  //     res.render("post", {newTitle: post.title, newPost: post.content});
  //   }
  // });
});

// var title = document.querySelector("p.never-brand");
// title.style.color = "white";

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
