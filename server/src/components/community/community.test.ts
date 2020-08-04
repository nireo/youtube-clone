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

describe("Community routes", () => {
  let postId: string | null = null;
  test("User can create a post", async () => {
    if (testUser === null) {
      // test user cannot be created so return that the test failed
      expect(false).toBeTruthy();
      return;
    } else {
      const data = {
        content: "This is a post"
      };

      const response = await api
        .post("/community")
        .set("Authorization", `bearer ${testUser.token}`)
        .send(data)
        .expect(200);

      expect(response.body.content).toBe("This is a post");
      postId = response.body.content;
    }
  });

  test("A post can be updated", async () => {
    if (testUser === null || postId === null) {
      expect(false).toBeTruthy();
      return;
    } else {
      const data = {
        content: "Updated post"
      };

      const response = await api
        .patch(`/community/${postId}`)
        .set("Authorization", `bearer ${testUser.token}`)
        .send(data)
        .expect(200);

      expect(response.body.content).toBe("Updated post");
    }
  });

  let commentId: string | null = null;
  test("A comment can be added to a post", async () => {
    if (testUser === null || postId === null) {
      expect(false).toBeTruthy();
      return;
    } else {
      const data = {
        content: "This is a comment"
      };

      const response = await api
        .post(`/community/comment/${postId}`)
        .set("Authorization", `bearer ${testUser.token}`)
        .send(data)
        .expect(200);

      expect(response.body.content).toBe("This is a comment");
      commentId = response.body.id;
    }
  });

  test("A comment can be deleted", async () => {
    if (testUser === null || commentId === null) {
      expect(false).toBeTruthy();
      return;
    } else {
      await api
        .delete(`/community/comment/${commentId}`)
        .set("Authorization", `bearer ${testUser.token}`)
        .expect(204);
    }
  });

  test("A community post can be deleted", async () => {
    if (testUser === null || postId) {
      expect(false).toBeTruthy();
      return;
    } else {
      await api
        .delete(`/community/${postId}`)
        .set("Authorization", `bearer ${testUser.token}`)
        .expect(204);
    }
  });
});

afterAll(async () => {
  await removeTestUser();
});
