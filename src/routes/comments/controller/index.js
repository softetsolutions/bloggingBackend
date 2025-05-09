import { pool } from "../../../config/database.js";

export const createComment = async (req, res) => {
    try{
        const { postId, comment } = req.body;
        if (!postId || !comment) {
            return res.status(400).json({ error: "Post ID and comment are required" });
        }

        const query = `INSERT INTO comments (postId, comment) VALUES ($1, $2) RETURNING *`;
        const values = [postId, comment];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error:  error.message });
    }
};

export const getAllCommentsOfPost = async (req, res) => {
    try{
        const { postId } = req.params;
        const query = await pool.query('SELECT * FROM comments WHERE postId = $1', [postId]);
        if (query.rowCount === 0) {
            return res.status(404).json({ error: "No comments found for this post" });
        }
        res.status(200).json(query.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try{
        const commentId = req.params.commentId;
        const query = await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
        if (query.rowCount === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try{
        const commentId = req.params.commentId;
        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json({ error: "Comment is required" });
        }
        const query = await pool.query('UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *', [comment, commentId]);
        if (query.rowCount === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.status(200).json(query.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};