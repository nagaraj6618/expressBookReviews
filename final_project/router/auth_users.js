const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username:"nagaraj",
    password:"1234"
  }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({error:"Username and password are required"});
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken
  }
    return res.json({message:"User Loggedin successfully",token:accessToken});
  }
  return res.status(300).json({message: "Login Failed"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { accesstoken } = req.headers;



  jwt.verify(accesstoken, 'access', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const { data } = decoded;
      if (!data) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = users.find(user => user.username === data);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!books[isbn]) {
        return res.status(404).json({ error: "Book not found" });
      }

      books[isbn].review = review;
      return res.json({ message: "Review added/updated successfully" });
    }
  });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { accesstoken } = req.headers;

console.log(accesstoken)
  jwt.verify(accesstoken, 'access', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const { data } = decoded;
      if (!data) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = users.find(user => user.username === data);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log(books[isbn].reviews)
      if (books[isbn] && books[isbn].reviews ) {

        delete books[isbn].reviews;
        return res.json({ message: "Review deleted successfully" });
      } else {
        return res.status(404).json({ error: "Review not found or you are not authorized to delete this review" });
      }
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
