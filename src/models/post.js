import { pool } from '../config/database.js';

const postTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            userId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log("Post table is ready");
    } catch (error) {
        console.error("Error creating post table:", error.message);
    }
}

export default postTable;
