const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const config = require("../config/key")

const endpoint = new AWS.Endpoint("https://kr.object.ncloudstorage.com");
const region = "kr-standard";

const S3 = new AWS.S3({
  endpoint: endpoint,
  region: region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

function setUpload(bucket) {
  var upload = multer({
     storage: multerS3({
      s3: S3,
      bucket:bucket,
      acl: "public-read-write",
      key: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        cb(null, Date.now().toString() + extension);
      },
    }),
  }).single("file");
  return upload;
}

module.exports = setUpload;


/*
const storage = multer.diskStorage({
  destination : function (req, file, cd) {
    cd(null, "image/");
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
})
*/
