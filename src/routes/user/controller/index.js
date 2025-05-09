import { pool } from '../../../config/database.js';
import EctDct from '../../../config/managePassword.js';
import jsonwebtoken from 'jsonwebtoken';

// Register user
export const registerUser = async (req, res) => {
    try {
        req.body.password = EctDct.encrypt(req.body.password, process.env.KEY);
        req.body.role = "user";
        const query = `INSERT INTO users (${Object.keys(req.body)
            .join(", ")}) 
            VALUES (${Object.keys(req.body)
                .map((_, i) => `$${i + 1}`)
                .join(", ")}) RETURNING *;`;
        const result = await pool.query(query, Object.values(req.body));
        const token = btoa(`${result.rows[0].id}`);
        console.log("token", token);
        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isPasswordValid = await EctDct.decrypt(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }
        const tokenData = {
            id: user.id,
            email: user.email
        };
        const authToken = jsonwebtoken.sign(tokenData, process.env.JWT_KEY, {
            expiresIn: `6h`,
        });
        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 6000, // 1 hour
            sameSite: "Strict",
        });
        return res.status(200).json({ data: authToken });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(400).json(error);
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        const query = `SELECT * FROM users`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID (admin or self)
export const getUserById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user info found in request" });
        }

        const userIdToUpdate = parseInt(req.params.id, 10);
        const { id: requesterId, role } = req.user;

        if (userIdToUpdate !== requesterId && role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this user" });
        }

        const result = await pool.query("SELECT * FROM users WHERE id = $1", [userIdToUpdate]);
        const user = result.rows[0];
        user
            ? res.status(200).json(user)
            : res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user (admin or self)
export const updateUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user info found in request" });
        }

        const userIdToUpdate = parseInt(req.params.id, 10);
        const { id: requesterId, role } = req.user;

        if (userIdToUpdate !== requesterId && role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this user" });
        }

        const query = `UPDATE users SET ${Object.keys(req.body)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(", ")} WHERE id = $${Object.keys(req.body).length + 1} RETURNING *`;
        const updatedUser = await pool.query(query, [
            ...Object.values(req.body),
            userIdToUpdate,
        ]);
        const data = updatedUser.rows[0];
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user (admin only) 
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        if(req.user.role !== "admin"){
            return res.status(403).json({ message: "Access denied" });
        }
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
