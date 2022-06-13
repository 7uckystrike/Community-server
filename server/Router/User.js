var express = require("express");
var router = express.Router();
const { User } = require("../Model/User")
const { Counter } = require("../Model/Counter");
const setUpload = require("../Util/Upload")


router.post("/register", (req, res) => {
  let temp = req.body
  Counter.findOne({name:"counter"}).then((doc) => {
    temp.userNum = doc.userNum
    const userData = new User(req.body);
    userData.save().then(() => {
      Counter.updateOne({name:"counter"}, {$inc:{userNum:1}}).then(() => {
        res.status(200).json({ success : true})
      })
    })
  }).catch((err) => {
    console.log(err)
    res.status(400).json({ success : false })
  })
})

router.post("/nameCheck", (req, res) => {
  User.findOne({displayName : req.body.displayName})
    .exec()
    .then((doc) => {
      let check = true;
      if(doc) {
        check = false;
      }
      res.status(200).json({ success : true, check})
  })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ success : false })
    })
});

router.post("/profile/update", (req, res) => {
  let temp = {
    photoURL : req.body.photoURL,
    displayName : req.body.displayName,
  }
  User.updateOne({ uid: req.body.uid}, {$set: temp} )
    .exec()
    .then(() => {
      res.status(200).json({ success: true});
    })
    .catch((error) => {
      res.state(400).json({ success: false});
    })
})

router.post(
  "/profile/img",
  setUpload("r-community/user"),
  (req, res, next) => {
    res.status(200).json({ success: true, filePath: res.req.file.location });
  }
); 


module.exports = router;