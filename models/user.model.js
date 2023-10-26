const { db } = require('../config/db.js');

const _register = async (firstname, lastname, email, role, info, username, password) => { 
    console.log("register in user.model");
    try {
        const userInsert = await db("users")
            .insert({ firstname, lastname, email, role, info })
            .returning(["id"]);
        return db("authentication")
            .insert({ user_id: userInsert[0].id, username, password })
            .returning(["username"]);        
    } catch (err){
        if (err.message.includes('invalid input value for enum enum_role')) {
            console.error(`Invalid input: ${role}`);
        } else {
            console.error(err);
        };
    };
};

const _login = (username) => {
    return db("authentication")
        .select("user_id", "username", "password")
        .where({ username });
};

module.exports = { _register, _login };