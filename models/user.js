const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
  // authenticates user with username, password
  // {username, password} => { username, first_name, last_name, email }
  // Throws UnauthorizedError is user not found or wrong password

  static async authenticate(username, password) {
    // first, try to find user
    const result = await db.query(
      `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if (user) {
      // compare hashed password in db to new hash of password input
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password combination.");
  }
}

module.exports = User;
