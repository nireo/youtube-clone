import supertest from "supertest";
import app from "../../app";
import { sequelize, User } from "../../sequelize";

const api = supertest(app);

export let token: string = "";

describe("Register route tests", () => {
  test("A user can register", async () => {
    const user = await User.findOne({ where: { username: "user" } });
    await user?.destroy();

    const credentials = {
      username: "user",
      password: "password"
    };

    await api
      .post("/auth/register")
      .send(credentials)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("A bad request body returns a 400 Bad Request error", async () => {
    const credentials = {
      uname: "hello",
      pword: "secret"
    };

    await api
      .post("/auth/register")
      .send(credentials)
      .expect(400);
  });
});

describe("Login route tests", () => {
  test("User can login", async () => {
    const credentials = {
      username: "user",
      password: "password"
    };

    const response = await api
      .post("/auth/login")
      .send(credentials)
      .expect("Content-type", /application\/json/)
      .expect(200);

    expect(response.body.token).not.toBeUndefined();
    token = response.body.token;
  });

  test("A bad request body returns a 400 Bad Request error", async () => {
    const credentials = {
      uname: "hello",
      pword: "secret"
    };

    await api
      .post("/auth/login")
      .send(credentials)
      .expect(400);
  });
});

test("Me route works", async () => {
  const response = await api
    .get("/auth/me")
    .set("Authorization", `bearer ${token}`)
    .expect(200)
    .expect("Content-type", /application\/json/);

  expect(response.body.username).toBe("user");
});

afterAll(async () => {
  await sequelize.close();
});
