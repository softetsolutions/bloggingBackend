import { pool } from "../../../config/database.js";

export const getAllUsers = async (req, res) => {
    try {
        const query = `SELECT * FROM users`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getByIdUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = result.rows[0];
        user
            ? res.status(200).json(user)
            : res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

