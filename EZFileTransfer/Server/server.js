// Initalize the server
const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();
const PORT = 3000; // Port

// Upload Directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Upload
const upload = multer({ dest: uploadDir });


// Get Local IP Address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  const preferred = [];
  const fallback = [];

  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (/wlan|wi-?fi/i.test(name)) {
          preferred.push(iface.address);
        } else {
          fallback.push(iface.address);
        }
      }
    }
  }

  if (preferred.length > 0) return preferred[0];
  if (fallback.length > 0) return fallback[0];

  // Return: Fallback
  return '127.0.0.1';
};


// Static Page
app.use(express.static('public'));

// File Upload
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const destPath = path.join(__dirname, 'uploads', file.originalname);
  fs.renameSync(file.path, destPath);
  res.send('Upload Success');
});

// File List
app.get('/files', (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, 'uploads'));
  res.json(files);
});

// File Download
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Access URL: http://${getLocalIP()}:${PORT}`);
});