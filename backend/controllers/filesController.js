const multer = require('multer');
const upload = multer(); 
const db = require('../db');


const getFilesByEmail = async (req, res) => {
    const { email } = req.params;
    const { limit } = req.query;
    try {
        let query = 'SELECT * FROM files WHERE owner_email = $1';
        const params = [email];

        if (limit) {
            query += ' LIMIT $2';
            params.push(limit);
        }
        const result = await db.query(query, params);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching files by email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST upload file
const uploadFile = async (req, res) => {
    const ownerEmail = req.user?.email;
    const file = req.file;

    if (!ownerEmail) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Fetch owner name using email
        const userResult = await db.query(
            'SELECT name FROM users WHERE email = $1',
            [ownerEmail]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const ownerName = userResult.rows[0].name;

        const query = `
            INSERT INTO files (filename, file_data, size, uploaded_at, owner_email, owner_name)
            VALUES ($1, $2, $3, NOW(), $4, $5)
            RETURNING *;
        `;
        const values = [
            file.originalname,
            file.buffer,
            file.size,
            ownerEmail,
            ownerName
        ];

        const result = await db.query(query, values);
        res.status(201).json({ message: 'File uploaded successfully', file: result.rows[0] });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteFile = async (req, res) => {
    const { id } = req.params;
    const ownerEmail = req.user?.email;
  
    if (!ownerEmail) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const result = await db.query(
        'DELETE FROM files WHERE id = $1 AND owner_email = $2 RETURNING *',
        [id, ownerEmail]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'File not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

module.exports = {
    getFilesByEmail,
    uploadFile,
    deleteFile
};
