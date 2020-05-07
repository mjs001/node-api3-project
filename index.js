// code away!

const express = require("express");

const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");
const server = express();
server.use(express.json());
server.use(logger);

server.use("/api/posts/", postRouter);
server.use("/api/user/", userRouter);

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

server.get("/", (req, res) => {
  res.json({ query: req.query, params: req.params, headers: req.headers });
});

server.listen(4001, () => {
  console.log("\n server is running on port 4001 \n");
});
