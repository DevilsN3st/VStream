const express = require("express");
const fs = require("fs");
const path = require("path");
const thumbsupply = require("thumbsupply");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");

const prisma = require("./utils/prisma-instance");
const {commitToDb} = require("./services/commit-to-db");

const multer = require("multer");

const app = express();

app.use(express.json());
// app.use(bodyParser.text({type: '/'}));
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const cookieParser = require("cookie-parser");

app.use(cookieParser(process.env.COOKIE_SECRET));

multer().any();

const videoRouter = require("./routes/videos-route");
const postRouter = require("./routes/posts-route");

app.get("/", async (req, res) => {
  const CURRENT_USER = await prisma.user.findFirst(
    { where: { name: "Kyle" } },
    { select: { id: true } }
  );
  console.log("CURRENT_USER_ID", CURRENT_USER);
  res.cookie("userId", CURRENT_USER);
  res.json({ user: CURRENT_USER });
});

app.use("/videos", videoRouter);
app.use("/posts", postRouter);

app.listen(4000, function () {
  console.log("Listening on port 4000!");
});
