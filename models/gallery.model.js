const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');


const _allWorks = (username) => {
    const id = userId(username);
    return db("gallery")
        .select("url", "name", "date", "price", "description")
        .where({ id })
        .returning(["url"]);
}


