import userTable from "./user.js";
import postTable from "./post.js";

class entityManager {
    constructor() {
        userTable();
        postTable();
    }
}

export default entityManager;