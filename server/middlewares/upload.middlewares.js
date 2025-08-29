const multer = require("multer");
const bucket = require("../firebase");
const { v4: uuidv4 } = require("uuid");

// Multer: store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to upload file to Firebase Storage
const uploadToFirebase = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  try {
    const file = req.file;
    const filename = `${uuidv4()}-${file.originalname}`;
    const blob = bucket.file(filename);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      return res.status(500).json({ msg: err.message });
    });

    blobStream.on("finish", async () => {
      // Generate signed URL valid for long time
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-01-2100", // far future
      });
      req.file.firebaseUrl = url; // attach URL for controller
      next();
    });

    blobStream.end(file.buffer);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { upload, uploadToFirebase };
