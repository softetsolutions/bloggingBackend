import { pool } from '../config/database.js';

const commentTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            postId INT NOT NULL,
            comment TEXT NOT NULL,
            FOREIGN KEY (postId) REFERENCES posts(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log("Comment table is ready");
    } catch (error) {
        console.error("Error creating comment table:", error.message);
    }
}

export default commentTable;