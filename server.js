const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  const memory = req.body.memory;
  res.json({ imageUrl: imagePath, memory });
});

app.get('/images', (req, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to load images' });
    const imageList = files.map(file => ({ imageUrl: `/uploads/${file}`, memory: "" }));
    res.json(imageList);
  });
});

app.listen(5000, () => console.log(`Server running at http://localhost:5000/`));

