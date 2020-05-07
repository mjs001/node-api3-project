const express = require("express");
const Post = require("./postDb");
const router = express.Router();
const server = express();
server.use(express.json());
server.use(validatePostId);

router.get("/", (req, res) => {
  Post.get()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      console.log("error in get for posts", error);
      res.status(500).json({ error: "couldn't retrieve posts" });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  Post.getById(id).then((post) => {
    res.status(200).json(post);
  });
});

router.delete("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  Post.remove(id).then((post) => {
    res.status(200).json({ message: "removed post successfully" });
  });
});

router.put("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  const PostData = req.body;
  Post.getById(id).then((post) => {
    Post.update(id, {
      text: PostData.title,
    }).then((updatedData) => {
      postMessage.getById(id).then((post) => res.status(200).json(post));
    });
  });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  const post = Post.findById(id);
  if (post) {
    req.post = post;
    next();
  } else {
    res.status(400).json({ message: "invalid post id" });
  }
}

module.exports = router;
