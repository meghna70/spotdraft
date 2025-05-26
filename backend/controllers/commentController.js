const db = require('../db');

// Create a new comment
exports.createComment = async (req, res) => {
  const { text, commenter_email, commenter_name, file_id } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO comments (text, commenter_email, commenter_name, file_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [text, commenter_email, commenter_name, file_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get all comments for a file
exports.getCommentsByFileId = async (req, res) => {
  const { file_id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM comments WHERE file_id = $1 ORDER BY created_at ASC`,
      [file_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
