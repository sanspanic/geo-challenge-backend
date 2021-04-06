const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Highscores {
  // get top 10 highscores
  // returns top ten [{ username, score }, {username, score}, ...] in desc order
  static async getHighscores() {
    const result = await db.query(
      `SELECT username, highscore
            FROM users
            ORDER BY highscore 
            DESC
            LIMIT 10`
    );
    const scores = result.rows;
    return scores;
  }
}

module.exports = Highscores;
