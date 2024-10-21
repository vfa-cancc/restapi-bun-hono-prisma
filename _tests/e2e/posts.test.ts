import app from "../../src/index";
import { hc } from "hono/client";
const fetch = require("node-fetch");

describe("Posts API E2E", () => {
  const baseUrl = "http://localhost:3000/api";
  type AppType = typeof app;
  let client: any;
  let accessToken: string;
  let userId: number;
  let postId: number;

  beforeAll(async () => {
    console.log("======Before All======");
    const adminUser = {
      fullname: "CanCC",
      email: "cancc@test.com",
      password: "password123",
      role: "ADMIN",
    };

    const userRes = await fetch(`${baseUrl}/users`, {
      method: "POST",
      body: JSON.stringify(adminUser),
      headers: { "Content-Type": "application/json" },
    });

    const loginResponse = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        email: adminUser.email,
        password: adminUser.password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const loginData = await loginResponse.json();
    accessToken = loginData.token;
    client = hc<AppType>(`${baseUrl}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Access Token:", accessToken);
    userId = loginData.data.id;
  });

  // After all tests are done, delete the user
  afterAll(async () => {
    await fetch(`${baseUrl}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  });

  test("POST /posts - should create a new post", async () => {
    const newPost = {
      title: "New Post Title",
      content: "Test Post Content",
    };

    const res = await client.posts.$post({
      json: newPost,
    });

    const jsonResponse = await res.json();
    postId = jsonResponse.data[0].id;
    console.log(`Post ID: ${postId}`);

    expect(res.status).toBe(201);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.data).toBeDefined();
    expect(jsonResponse.data[0].title).toBe(newPost.title);
  });

  test("GET /posts - should return list of posts", async () => {
    const res = await client.posts.$get({
      method: "GET",
      query: { page: "1", limit: "10" },
    });

    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.pagging).toBeDefined();
    expect(jsonResponse.data).toBeInstanceOf(Array);
  });

  test("GET /posts/:id - should return post by id", async () => {
    const res = await client.posts[":id"].$get({
      param: {
        id: postId,
      },
    });
    const jsonResponse = await res.json();
    expect(res.status).toBe(200);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.data).toBeDefined();
  });

  test("PUT /posts/:id - should update a post", async () => {
    const updatedPost = {
      title: "Updated Title",
      content: "Updated Content",
    };

    const res = await client.posts[":id"].$patch({
      json: updatedPost,
      param: {
        id: postId,
      },
    });
    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(true);
  });

  test("DELETE /posts/:id - should delete a post", async () => {
    const res = await client.posts[":id"].$delete({
      param: {
        id: postId,
      },
    });

    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(true);
  });
});
