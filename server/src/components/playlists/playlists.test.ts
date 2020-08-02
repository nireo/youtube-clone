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

describe("Playlist routes", () => {
  let playlistId: string | null = null;
  test("User can create playlist", async () => {
    if (testUser === null) {
      expect(false).toBeTruthy();
      return;
    } else {
      const data = {
        title: "Test playlist"
      };

      const response = await api
        .post(`/playlist`)
        .set("Authorization", `bearer ${testUser.token}`)
        .send(data)
        .expect(200);

      expect(response.body.title).toBe("Test playlist");
      playlistId = response.body.id;
    }
  });

  test("User can update playlist", async () => {
    if (testUser === null) {
      expect(false).toBeTruthy();
      return;
    } else {
      const data = {
        title: "New title",
        description: "New description"
      };

      const response = await api
        .post(`/playlist/${playlistId}`)
        .set("Authorization", `bearer ${testUser.token}`)
        .send(data)
        .expect(200);

      expect(response.body.description).toBe("New description");
      expect(response.body.title).toBe("New title");
    }
  });

  test("You can get user's playlists", async () => {
    if (testUser === null) {
      expect(false).toBeTruthy();
      return;
    } else {
      const response = await api
        .get(`/playlist/user/${testUser.user.id}`)
        .expect(200);

      expect(response.body[0].title).toBe("New title");
      expect(response.body[0].description).toBe("New description");
    }
  });

  test("You can delete a playlist", async () => {
    if (testUser === null) {
      expect(false).toBeTruthy();
    } else {
      await api
        .delete(`/playlist/${playlistId}`)
        .set("Authorization", `bearer ${testUser.token}`)
        .expect(204);
    }
  });
});
