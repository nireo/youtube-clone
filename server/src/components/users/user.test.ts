import supertest from "supertest";
import app from "../../app";
import {
  TestUser,
  generateTestUserAndToken,
  removeTestUser
} from "../../utils/generateTestUserAndToken";

const api = supertest(app);

let testUser: TestUser | null = null;

beforeAll(async () => {
  const newTestUser = await generateTestUserAndToken();
  testUser = newTestUser;
});

describe("User route tests", () => {
  it("You can get all users", async () => {
    const response = await api
      .get("/users/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body[0].username).toBe("test");
  });

  it("You can update user information", async () => {
    if (testUser === null) {
      expect(false).toBeTruthy();
    } else {
      const data = {
        username: "test1"
      };

      const response = await api
        .post("/users/update")
        .set("Authorization", `bearer ${testUser.token}`)
        .send(data)
        .expect(200);

      expect(response.body.username).toBe("testl");
    }
  });
});

afterAll(async () => {
  await removeTestUser();
});
