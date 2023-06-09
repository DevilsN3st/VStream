const express = require("express");
const fs = require("fs");
const thumbsupply = require("thumbsupply");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const cookieParser = require('cookie-parser');

app.use(cookieParser(process.env.COOKIE_SECRET));

const prisma = new PrismaClient();


// endpoint to fetch all videos metadata
app.get("/videos", async function (req, res) {
  const videos = await prisma.video.findMany();
  res.json(videos);
});

app.get("/video/:id/caption", function (req, res) {
  res.sendFile("assets/captions/sample.vtt", { root: __dirname });
});

app.get("/video/:id/poster", function (req, res) {
  thumbsupply
    .generateThumbnail(`assets/${req.params.id}.mp4`)
    .then((thumb) => res.sendFile(thumb))
    .catch((err) => console.log(err));
});

// endpoint to fetch a single video's metadata
app.get("/video/:id/data", async function (req, res) {
  const videoData = await prisma.video.findUnique({
    where: { id: req.params.id },
  });
  // console.log(videoData);
  // const id = parseInt(req.params.id, 10);
  res.json(videoData);
});

app.get("/video/:id", async function (req, res) {

    const path = `assets/${req.params.id}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      console.log("we have range", range);
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      console.log(parts);
      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      console.log("no range", range);
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
});

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
}

app.get("/posts", async (req, res) => {
  const CURRENT_USER_ID = (
    await prisma.user.findFirst({ where: { name: "Kyle" } })
  ).id
  res.cookie('userId', CURRENT_USER_ID );
  
  const posts = await prisma.post.findMany();
  res.json(posts);
  
});

app.get("/posts/:id", async (req, res) => {
  const post = await
    prisma.post
      .findUnique({
        where: { id: req.params.id },
        select: {
          body: true,
          title: true,
          video: {
            select: {
              id: true,
            }
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
        console.log("post", post);
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
      })
  res.json(post);
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.json("Message is required");
  }

  return await commitToDb(
    prisma.comment
      .create({
        data: {
          message: req.body.message,
          userId: req.cookie,
          parentId: req.body.parentId,
          postId: req.params.id,
        },
        select: COMMENT_SELECT_FIELDS,
      })
      .then((comment) => {
        return {
          ...comment,
          likeCount: 0,
          likedByMe: false,
        };
      }), req, res
  );
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.json("Message is required");
  }

  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });
  if (userId !== req.cookie) {
    return res.send(
      
        "You do not have permission to edit this message"
      
    );
  }

  return await commitToDb(
    prisma.comment.update({
      where: { id: req.params.commentId },
      data: { message: req.body.message },
      select: { message: true },
    })
    , req, res
  );
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });
  if (userId !== req.cookie) {
    return res.send(
      
        "You do not have permission to delete this message"
      
    );
  }

  return await commitToDb(
    prisma.comment.delete({
      where: { id: req.params.commentId },
      select: { id: true },
    })
    ,req, res
  );
});

app.post("/posts/:postId/comments/:commentId/toggleLike", async (req, res) => {
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

async function commitToDb(promise, req, res) {
  await promise
  .then((data) => {
    console.log("data", data);
    return res.json(data);
  })
  .catch((error) => {
    console.log("error", error);
    return res.json(error.message);
  })
  // res.json(data);
  // if (error) return res.json(error.message);
}

app.listen(4000, function () {
  console.log("Listening on port 4000!"); 
});
