var express = require("express");
var router = express.Router();
const multer = require("multer")
const multerS3 = require("multer-s3");

const { Post } = require("../Model/Post");
const { Counter } = require("../Model/Counter");
const { User } = require("../Model/User");
const setUpload = require("../Util/Upload")

router.post("/submit", (req, res) => {
  let temp = {
    title : req.body.title,
    content : req.body.content,
    image : req.body.image,
    uid : req.body.uid,
    reple : req.body.postId,
  }
  Counter.findOne({name:"counter"})
    .exec()
    .then((counter) => {
    temp.postNum = counter.postNum;
    User.findOne({ uid: temp.uid })
      .exec()
      .then((userInfo) => {
        temp.author = userInfo._id;
      const CommunityPost = new Post(temp);
      CommunityPost.save().then((doc) => {
      Counter.updateOne(
        {name:"counter"},
        {$inc:{postNum:1}}
      ).then(() => {
        res.status(200).json({success:true});
      });
    })
  })
  }).catch((error) => {
    res.status(400).json({success:false});    
  });
});  

router.post("/list", (req, res) => {
  let sort = {};

  if(req.body.sort == "최신순") {
    sort.createdAt = -1;
  } else {
    sort.repleNum = -1
  }

  Post.find({$or : [
      { title : {$regex : req.body.search }},
      { content : {$regex : req.body.search } }
    ],
  })
      .populate("author")
      .sort(sort)
      .skip(req.body.skip)
      .limit(5)
      .exec()
      .then((doc) => {
        res.status(200).json({ success : true, postList:doc })
      })
      .catch((error) => {
        res.status(400).json({ success : false });
      })
    });

router.post("/detail", (req, res) => {
  Post.findOne({postNum : Number(req.body.postNum)})
      .populate("author")
      .exec()
      .then((doc) => {
        console.log(doc)
        res.status(200).json({ success : true, post:doc })
      })
      .catch((error) => {
        res.status(400).json({ success : false });
      })
    });

router.post("/edit", (req, res) => {
  let temp = {
  title: req.body.title,
  content: req.body.content,
  image: req.body.image,
  }
  
  Post.updateOne({postNum : Number(req.body.postNum)}, {$set : temp})
      .exec()
      .then(() => {
        console.log("수정성공")
        res.status(200).json({ success : true })
        })
        .catch((error) => {
          console.log("수정실패")
          res.status(400).json({ success : false });
        })
      });
    
router.post("/delete", (req, res) => {
  Post.deleteOne({postNum : Number(req.body.postNum)})
      .exec()
      .then(() => {
        res.status(200).json({ success : true })
        })
      .catch((error) => {
        res.status(400).json({ success : false });
        })
      });


/*const storage = multer.diskStorage({
  destination : function (req, file, cb) {
    cb(null, "image/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
})

const upload = multer({ storage : storage }).single("file");

router.post("/image/upload", (req, res) => {
  upload(req, res, (err) => {
    if(err) {
      res.status(400).json({ success : false });
    } else {
      res.status(200).json({ success : true, filePath : res.req.file.path });
    }
  })
})*/
 

router.post(
  "/image/upload",
  setUpload("r-community/post"),
  (req, res, next) => {
    res.status(200).json({ success: true, filePath: res.req.file.location });
  }
); 


module.exports = router;