const express = require("express");
const router = express.Router();

const prisma = require("../utils/prisma-instance");
const {commitToDb} = require("../services/commit-to-db");

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const user_password = await prisma.user.findFirst(
    { where: { email: email } },
    { select: { password: true } }
  );

  const CURRENT_USER = await prisma.user.findFirst(
    { where: { email: email } },
    { select: { id: true, name: false, email:false, password:false } }
  );

  if (user_password.password === req.body.password) {
    console.log("CURRENT_USER_ID", CURRENT_USER);
    res.cookie("userId", CURRENT_USER.id);
    res.json({ user: CURRENT_USER });
  } else {
    res.status(500).json("something went wrong");
  }
});

router.post("/register", async (req, res) => {
  // res.send('Register');
    console.log("req.body from register router", req.body);
  if (req.body.name === "" || req.body.email == "" || req.body.password == "") {
    return res.status(400).json("Incomplete Details Provided");
  }
  return await commitToDb(
    prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    }),
    req,
    res
  );
});

module.exports = router;
