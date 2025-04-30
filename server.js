const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static('frontend'));

const fs = require('fs');

app.get('/images', (req, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read uploads folder' });
    }

    // Send back file paths as /uploads/...
    const imageList = files.map(file => ({
      imageUrl: `/uploads/${file}`,
      memory: '' // could later be loaded from a DB or file
    }));

    res.json(imageList);
  });
});



// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  const memory = req.body.memory;
  res.json({ imageUrl: imagePath, memory });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
