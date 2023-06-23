const express = require("express");
const prisma = require("../utils/prisma-instance");
const thumbsupply = require("thumbsupply");
const fs = require("fs");

const {commitToDb} = require("../services/commit-to-db");

const { getAllPosts, addPost, getPost} = require('../controllers/posts-controllers');
const { addComment, editComment, deleteComment, toggleLikeOnComment } = require('../controllers/comments-controller');

const router = express.Router();


router.get("/", getAllPosts );

router.post("/", addPost );

router.get("/:id", getPost );

router.post("/:id/comments", addComment );

router.put("/:postId/comments/:commentId", editComment);

router.delete("/:postId/comments/:commentId", deleteComment);

router.post("/:postId/comments/:commentId/toggleLike", toggleLikeOnComment);

module.exports = router;
