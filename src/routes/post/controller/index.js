import { pool } from '../../../config/database.js';
import cloudinary from '../../../config/cloudinary.js';
import fs from 'fs';

export const createPost = async (req, res) => {
    try{
        const { title, description } = req.body;
        const userId = req.user.id;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const userOutput = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userOutput.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog_images'
            });
            console.log("Cloudinary upload result:", result);

            imageUrl = result.secure_url;

            // Delete local file
            fs.unlink(req.file.path, err => {
                if (err) console.error("Error deleting file:", err);
                else console.log("Local file deleted:", req.file.path);
            });
        }

        const query = `INSERT INTO posts (title, description, userId, image_url) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [title, description, userId, imageUrl];
        const dbResult = await pool.query(query, values);

        res.status(200).json(dbResult.rows[0]);
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

// User itself or admin can update a post
export const updatePost = async (req, res) => {
    try{
        if (!res.user){
            return res.status(401).json({ error: "Unauthorized: No user info found in request" });
        }
        const userIdToUpdate = parseInt(req.params.id, 10);
        const { id: requesterId, role } = req.user;
        if (userIdToUpdate !== requesterId && role !== "admin") {
            return res.status(403).json({ error: "You are not authorized to update this post" });
        }
        const { title, description } = req.body;
        if (!title && !description) {
            return res.status(400).json({ error: "Title or description is required" });
        }
        const query = `UPDATE posts SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE id = $3 RETURNING *`;
        const values = [title, description, userIdToUpdate];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// User itself or admin can delete a post
export const deletePost = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user info found in request" });
        }
        const userIdToDelete = parseInt(req.params.id, 10);
        const { id: requesterId, role } = req.user;
        if (userIdToDelete !== requesterId && role !== "admin") {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }
        const query = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [userIdToDelete]);
        if (query.rowCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPostById = async (req, res) => {
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Post ID is required" });
        }
        const query = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        if (query.rowCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(query.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};