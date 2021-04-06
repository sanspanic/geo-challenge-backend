const app = require("../app");
const request = require("supertest");
const db = require("../db");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// [GET] / ********************************************
describe("GET /highscores", function () {
  test("works", async function () {
    await db.query("UPDATE users SET highscore='300' WHERE username = 'u3'");
    const resp = await request(app)
      .get("/highscores")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      scores: [
        { username: "u3", highscore: 300 },
        { username: "u1", highscore: 0 },
        { username: "u2", highscore: 0 },
      ],
    });
  });

  test("unath if not logged in", async function () {
    const resp = await request(app).get("/highscores");
    expect(resp.statusCode).toEqual(401);
  });
});
