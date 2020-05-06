// code away!

const express = require("express");
const Users = require("./users/userDb.js");
const Posts = require("./posts/postDb.js");
const server = express();
server.use(express.json());
server.use(logger);
server.use(validateUserId);
server.use(validateUser);

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      "Origin"
    )}`
  );
  next();
}

function validateUserId(req, res, next) {
  const { id } = req.params;
  const user = Users.findById(id);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(400).json({ message: "invalid user id" });
  }
}

function validateUser(req, res, next) {
  const { body } = res.body;
  if (body === null || body === "") {
    res.status(400).json({ message: "missing user data" });
  } else if (body.name === null || body.name === "") {
    res.status(400).json({ message: "missing required name field" });
  } else next();
}
