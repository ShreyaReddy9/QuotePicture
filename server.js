const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

// Environment-aware port
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  const memory = req.body.memory;
  res.json({ imageUrl: imagePath, memory });
});

// List uploaded images
app.get('/images', (req, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (
