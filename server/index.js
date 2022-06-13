const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const config = require("./config/key.js")
const cors = require('cors');

app.use(express.json());
app.use(cors())
app.use("/image", express.static("./image"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/post", require("./Router/Post.js"));
app.use("/api/user", require("./Router/User.js"));
app.use("/api/reple", require("./Router/Reple.js"));

app.listen(port, () => {
  mongoose.connect(config.mongoURI 
  ).then(() => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(`연결 중...`)
  }).catch((error) => {
    console.log(`뭐가 문제일까용..${error}`)
  })
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));  
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));  
});

