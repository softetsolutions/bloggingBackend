import userTable from "./user.js";
import postTable from "./post.js";
import commentTable from "./comment.js";

class entityManager {
    constructor() {
        userTable();
        postTable();
        commentTable();
    }
}

export default entityManager;