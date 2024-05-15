const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, req.file.path);
        const file = fs.createReadStream(filePath);

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:5001/predict', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        fs.unlinkSync(filePath); // Delete the file after sending it to the Python backend

        res.json(response.data);
    } catch (error) {
        console.error('Error uploading the drawing:', error);
        res.status(500).json({ error: 'Error uploading the drawing' });
    }
});

app.listen(5000, () => {
    console.log('Node.js server listening on port 5000');
});