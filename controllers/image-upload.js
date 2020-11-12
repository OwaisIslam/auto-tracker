const express = require("express");
const router = express.Router();

const upload = require("../public/javascript/image-upload");

//'image' is the key name of our file input field in the html form
const singleUpload = upload.single("image");

router.post("/image-upload", function (req, res) {
  singleUpload(req, res, function (err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "File Upload Error", detail: err.message }],
      });
    }
    console.log("Uploaded!");
    //returning the url of the image that is stored on aws s3 bucket
    //  res.json({ image_url: req.file.location });
    let image = res.send({ image_url: req.file.location });
    // console.log(image);
    return image

  });
});

module.exports = router;
