const prisma = require("../utils/prisma-instance");
const thumbsupply = require("thumbsupply");
const fs = require("fs");

const {commitToDb} = require("../services/commit-to-db");


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

  

  const addComment = async (req, res) => {
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
  }

  const editComment = async (req, res) => {
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
  }

  const deleteComment = async (req, res) => {
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
  }


  const toggleLikeOnComment = async (req, res) => {
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
  }

  module.exports = { addComment, editComment, deleteComment, toggleLikeOnComment };
