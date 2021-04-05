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
const User = require("./user.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// authenticate user ***********************************
describe("authenticate", () => {
  test("works", async () => {
    const us = await db.query("SELECT * FROM users");
    console.log("all users: ", us);
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nosuchuser", "password1");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrongpw");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});
