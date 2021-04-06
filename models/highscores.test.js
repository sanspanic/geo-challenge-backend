const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

const db = require("../db.js");
const Highscores = require("./highscores.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("get highscores", function () {
  test("works", async function () {
    let res = await Highscores.getHighscores();
    expect(res).toEqual([
      { username: "u2", highscore: 200 },
      { username: "u1", highscore: 100 },
    ]);
  });
});
