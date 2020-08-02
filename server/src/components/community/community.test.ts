import supertest from "supertest";
import app from "../../app";
import { sequelize, Community } from "../../sequelize";
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

describe("Community post creation", () => {
  test("User can create a post", async () => {
    if (testUser === null) {
      // test user cannot be created so return that the test failed
      expect(false).toBeTruthy();
      return;
    } else {
    }
    const data = {
      content: "This is a post"
    };

    const response = await api
      .post("/community")
      .set("Authorization", `bearer ${testUser.token}`)
      .send(data)
      .expect(200);

    expect(response.body.content).toBe("This is a post");
  });
});

afterAll(async () => {
  await removeTestUser();
});
