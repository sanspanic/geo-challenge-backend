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
  // {username, password} => { username, first_name, last_name, email, highscore }
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

  //registers new user
  // {username, password, firstName, lastName, email } => {username, password, firstName, lastName, email}
  // throws BadRequestError on duplicate username
  static async register({ username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Username already exists: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
      [username, hashedPassword, firstName, lastName, email]
    );

    const user = result.rows[0];
    return user;
  }

  //given a username, return data about user
  // {username} => {username, password, firstName, lastName, email, highscore}
  //throws NotFoundError if user not found
  static async get(username) {
    const res = await db.query(
      `SELECT username,
      first_name AS "firstName",
      last_name AS "lastName",
        email,
        highscore
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = res.rows[0];
    if (!user) throw new NotFoundError(`No such user: ${username}`);
    return user;
  }
}

module.exports = User;
