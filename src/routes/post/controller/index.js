import { pool } from '../../../config/database.js';

export const createPost = async (req, res) => {
    try{
        const { title, description, userId } = req.body;
        if (!title || !description || !userId) {
            return res.status(400).json({ error: "Title, description, and userId are required" });
        }
        const userOutput = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userOutput.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const query = `INSERT INTO posts (title, description, userId) VALUES ($1, $2, $3) RETURNING *`;
        const values = [title, description, userId];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try{
        const query = await pool.query('SELECT * FROM posts');
        if (query.rowCount === 0) {
            return res.status(404).json({ error: "No posts found" });
        }
        res.status(200).json(query.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPostOfUser = async (req, res) => {
    try{
        const { userId } = req.params;
        const query = await pool.query('SELECT * FROM posts WHERE userId = $1', [userId]);
        if (query.rowCount === 0) {
            return res.status(404).json({ error: "No posts found for this user" });
        }
        res.status(200).json(query.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, description } = req.body;
        if (!title && !description) {
            return res.status(400).json({ error: "Title or description is required" });
        }
        const query = `UPDATE posts SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE id = $3 RETURNING *`;
        const values = [title, description, id];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try{
        const { id } = req.params;
        const query = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
        if (query.rowCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};