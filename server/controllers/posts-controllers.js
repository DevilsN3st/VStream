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

  
  const getAllPosts = async (req, res) => {
    console.log("GET /posts");
    console.log( req.query.user );
    let posts;
    if( req.query.user !== 'undefined' ){
      console.log(" user query present");
      posts = await prisma.post.findMany({
        select:{
          title: true,
          id: true
        },
        where:{
          userId : req.query.user,
          
        }
      })
    }
    else{
      console.log("no user query present");
      posts = await prisma.post.findMany();

    }
    // console.log("posts", posts);
    res.json(posts);
  }

  const addPost = async (req, res) => {
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
  }

  const getPost = async (req, res) => {
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
  }

  module.exports = { getAllPosts, addPost, getPost };
