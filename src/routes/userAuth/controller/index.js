import { pool } from '../../../config/database.js';
import EctDct  from '../../../config/managePassword.js';
import jsonwebtoken from 'jsonwebtoken';

export const createUser = async (req, res) => {
    try {
        req.body.password = EctDct.encrypt(req.body.password, process.env.KEY);
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

export const login = async (req, res) => {
    try{
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

export const logout = async (req, res) => {
    try{
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