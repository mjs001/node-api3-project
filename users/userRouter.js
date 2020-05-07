const express = require("express");
const Users = require("./userDb.js");
const router = express.Router();
const server = express();
const Post = require("../posts/postDb.js");
server.use(express.json());
server.use(validateUserId);
server.use(validateUser);
server.use(validatePost);
router.post("/", (req, res) => {
  Users.insert(req.body).then((user) => {
    res.status(201).json(user);
  });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const newText = req.body;
  Post.insert(newText).then((post) => {
    res.status(201).json(post);
  });
});

router.get("/", (req, res) => {
  Users.get().then((user) => {
    res.status(200).json(user);
  });
});

router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  Users.getById(id).then((user) => {
    res.status(200).json(user);
  });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  Users.getUserPosts(id).then((user) => {
    res.status(200).json(user);
  });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  Users.remove(id).then((user) => {
    res.status(200).json({ message: "the post has successfully been deleted" });
  });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const userData = req.body;
  Users.getById(id).then((user) => {
    Users.update(id, {
      name: userData.name,
    }).then((updated) => {
      Users.getById(id).then((user) => res.status(200).json(user));
    });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id)
    .then((res) => {
      req.user = res.id;
      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ message: "invalid user id" });
    });
}

function validateUser(req, res, next) {
  const { body } = req.body;
  if (body === null || body === "") {
    res.status(400).json({ message: "missing user data" });
  } else if (body.name === null || body.name === "") {
    res.status(400).json({ message: "missing required name field" });
  } else next();
}

function validatePost(req, res, next) {
  const { body } = req.body;
  if (body === null || body === "") {
    res.status(400).json({ message: "missing post data" });
  } else if (body.text === null || body.text === "") {
    res.status(400).json({ message: "missing required text field" });
  } else next();
}

module.exports = router;
