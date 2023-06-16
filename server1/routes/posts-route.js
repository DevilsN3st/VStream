const express = require("express");
const prisma = require("../utils/prisma-instance");
const thumbsupply = require("thumbsupply");
const fs = require("fs");

const {commitToDb} = require("../services/commit-to-db");

const router = express.Router();

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {   
    select: {
      id: true,
      name: true,
    },
  },
};

router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany();
  // console.log("posts", posts);
  res.json(posts);
});

router.post("/", async (req, res) => {
  // console.log("req.body", req.body);
  if (req.body.title === "" || req.body.title == null) {
    return res.status(400).json("Title is required");
  }
  if (req.body.body === "" || req.body.body == null) {
    return res.status(400).json("Body is required");
  }
  return await commitToDb(
    prisma.post.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        userId: req.body.userId,
      },
    }),
    req,
    res
  );
});

router.get("/:id", async (req, res) => {
  const post = await prisma.post
    .findUnique({
      where: { id: req.params.id },
      select: {
        body: true,
        title: true,
        video: {
          select: {
            id: true,
            fileName: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            _count: { select: { likes: true } },
          },
        },
      },
    })
    .then(async (post) => {
      // console.log("post", post);
      const likes = await prisma.like.findMany({
        where: {
          userId: req.cookie,
          commentId: { in: post.comments.map((comment) => comment.id) },
        },
      });

      return {
        ...post,
        comments: post.comments.map((comment) => {
          const { _count, ...commentFields } = comment;
          return {
            ...commentFields,
            likedByMe: likes.find((like) => like.commentId === comment.id),
            likeCount: _count.likes,
          };
        }),
      };
    });
  res.json(post);
});

router.post("/:id/comments", async (req, res) => {
  // console.log("req.body", req.body)
  if (req.body.message === "" || req.body.message == null) {
    return res.json("Message is required");
  }
  const data = {
    message: req.body.message,
    userId: req.body.user.id,
    parentId: req.body.parentId,
    postId: req.params.id,
  };
  return await commitToDb(
    prisma.comment
      .create({
        data,
        select: COMMENT_SELECT_FIELDS,
      })
      .then((comment) => {
        return {
          ...comment,
          likeCount: 0,
          likedByMe: false,
        };
      }),
    req,
    res
  );
});

router.put("/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.json("Message is required");
  }

  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });
  if (userId !== req.cookie) {
    return res.send("You do not have permission to edit this message");
  }

  return await commitToDb(
    prisma.comment.update({
      where: { id: req.params.commentId },
      data: { message: req.body.message },
      select: { message: true },
    }),
    req,
    res
  );
});

router.delete("/:postId/comments/:commentId", async (req, res) => {
  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });
  if (userId !== req.cookie) {
    return res.send("You do not have permission to delete this message");
  }

  return await commitToDb(
    prisma.comment.delete({
      where: { id: req.params.commentId },
      select: { id: true },
    }),
    req,
    res
  );
});

router.post("/:postId/comments/:commentId/toggleLike", async (req, res) => {
  const data = {
    commentId: req.params.commentId,
    userId: req.userId,
  };

  const like = await prisma.like.findUnique({
    where: { userId_commentId: data },
  });

  if (like == null) {
    return await commitToDb(prisma.like.create({ data }), req, res).then(() => {
      return res.json({ addLike: true });
    });
  } else {
    return await commitToDb(
      prisma.like.delete({ where: { userId_commentId: data } }, req, res)
    ).then(() => {
      return res.json({ addLike: false });
    });
  }
});

module.exports = router;
