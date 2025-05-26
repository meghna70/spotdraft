const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Share file via link 
const shareFileByLink = async (req, res) => {
  const { fileId } = req.body;
  const publicLinkId = uuidv4();

  try {
    await db.query(
      `INSERT INTO shared_with (file_id, shared_via, share_link_id, role)
       VALUES ($1, 'link', $2, 'viewer')`,
      [fileId, publicLinkId]
    );

    res.status(200).json({
      link: `https://yourdomain.com/shared/${publicLinkId}`,
      linkId: publicLinkId,
    });
  } catch (error) {
    console.error('Error creating public link:', error);
    res.status(500).json({ error: 'Failed to generate link' });
  }
};

// Share file via email
const shareFileByEmail = async (req, res) => {
  const { file_id, user_name, user_email, role } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO shared_with (file_id, user_name, user_email, role, shared_via)
       VALUES ($1, $2, $3, $4, 'email')
       RETURNING *`,
      [file_id, user_name, user_email, role || 'viewer']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error sharing via email:', error);
    res.status(500).json({ error: 'Failed to share via email' });
  }
};

// Get shared file info by public link
const getFileByLinkId = async (req, res) => {
  const { linkId } = req.params;

  try {
    const result = await db.query(
      `SELECT f.*, sw.role, sw.shared_at
       FROM shared_with sw
       JOIN files f ON sw.file_id = f.id
       WHERE sw.share_link_id = $1 AND sw.shared_via = 'link'`,
      [linkId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found or expired' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error accessing file by link:', error);
    res.status(500).json({ error: 'Failed to fetch shared file' });
  }
};




const getSharedFilesByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const { limit } = req.query;

        let query = `
        SELECT f.*
        FROM shared_with sw
        JOIN files f ON sw.file_id = f.id
        WHERE sw.user_email = $1
        ORDER BY sw.last_accessed DESC
      `;
        const params = [email];

        if (limit) {
            query += ' LIMIT $2';
            params.push(limit);
        }

        const result = await db.query(query, params);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching shared files:', error);
        res.status(500).json({ error: 'Failed to fetch shared files' });
    }
};


const getSharedUsers = async (req, res) => {
    try {
        const { email } = req.params;
        const { limit } = req.query;

        let query = `
        SELECT f.*
        FROM shared_with s
        JOIN files f ON s.file_id = f.id
        WHERE s.user_email = $1
        ORDER BY s.shared_at DESC
      `;

        const params = [email];

        if (limit) {
            query += ' LIMIT $2';
            params.push(limit);
        }

        const result = await db.query(query, params);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching shared files:', error);
        res.status(500).json({ error: 'Failed to fetch shared files' });
    }
};


const shareFile = async (req, res) => {
    try {
        const { file_id, user_name, user_email, role } = req.body;
        const result = await db.query(
            `INSERT INTO shared_with (file_id, user_name, user_email, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [file_id, user_name, user_email, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to share file' });
    }
};

const updateLastAccessed = async (req, res) => {
    try {
        const { file_id, user_email } = req.body;
        const result = await db.query(
            `UPDATE shared_with SET last_accessed = NOW()
       WHERE file_id = $1 AND user_email = $2
       RETURNING *`,
            [file_id, user_email]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update last accessed' });
    }
};

module.exports = {
    getSharedUsers,
    getSharedFilesByEmail,
    shareFile,
    updateLastAccessed,
    shareFileByLink,
    shareFileByEmail,
    getFileByLinkId,
};
