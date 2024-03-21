const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')

public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  if(!username || !password){
    return res.status(400).send("Username and password are required");
  }
  const existingUser = users.find((user)=> user.username == username )
  if(existingUser){
    return res.status(400).send("Username already exists");
  }
  users.push({username,password});
  res.status(200).send("User registerd Successfully");
});

public_users.get('/list',(req,res)=> {
  res.json(books)
})
// Get the book list available in the shop


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let filteredBooks = books[req.params.isbn]
  return res.status(200).send(filteredBooks)
  
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author === author);
  
  if (authorBooks.length > 0) {
      res.json(authorBooks);
  } else {
      res.status(404).json({ error: "No books found for the provided author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleBook = Object.values(books).filter((book) => book.title === req.params.title)
  if(titleBook.length>0){
    res.status(200).send(titleBook);
  }
  else{
    res.status(404).json("Not Found");
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const review = books[req.params.isbn].reviews;
  res.json({review:review})
  return res.status(300).json({message: "Yet to be implemented"});
});

//Axios
public_users.get('/',function (req, res) {
  axios.get('http://localhost:5000/list')
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(error => {
            res.status(500).send("Error fetching books data");
        });
  
});



 //Using Axios
 public_users.get('/axios/:isbn',(req,res) => {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => {
          res.status(200).send(response.data);
      })
      .catch(error => {
          res.status(500).send("Error fetching book details");
      });
})

public_users.get('/axios/author/:author',(req,res) => {
  const author = req.params.author;
    axios.get(`http://localhost:5000/author/${author}`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(error => {
            res.status(500).send("Error fetching book details");
        });
})


public_users.get('/axios/title/:title',(req,res) => {
  const title = req.params.title;
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(error => {
            res.status(500).send("Error fetching book details");
        });
})
module.exports.general = public_users;
