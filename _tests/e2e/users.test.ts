import { testClient } from "hono/testing";
import app from "../../src/index";
import { hc } from "hono/client";
const fetch = require("node-fetch");

describe("Users API E2E", () => {
  const baseUrl = "http://localhost:3000/api";
  type AppType = typeof app;
  let client: any;
  let accessToken: string;
  let adminUserId: number;
  let testUserId: number;

  beforeAll(async () => {
    console.log("======Before All======");
    const newUser = {
      fullname: "CanCC",
      email: "cancc@test.com",
      password: "password123",
      role: "ADMIN",
    };

    const userRes = await fetch(`${baseUrl}/users`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: { "Content-Type": "application/json" },
    });

    const userData = await userRes.json();
    console.log("User created:", userData);

    const loginResponse = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        email: newUser.email,
        password: newUser.password,
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
    adminUserId = loginData.data.id;
  });

  afterAll(async () => {
    await fetch(`${baseUrl}/users/${adminUserId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  });

  test("POST /users - should create a new user", async () => {
    const newUser = {
      fullname: "Test User",
      email: "testuser@test.com",
      password: "password123",
      role: "USER",
    };

    const res = await client.users.$post({
      json: newUser,
    });

    const jsonResponse = await res.json();
    testUserId = jsonResponse.data.id;
    expect(res.status).toBe(201);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.data).toBeDefined();
    expect(jsonResponse.data.fullname).toBe(newUser.fullname);
  });

  test("POST /users - should not create a user with invalid email format", async () => {
    const invalidUser = {
      fullname: "Invalid Email User",
      email: "invalid-email-format",
      password: "password123",
      role: "USER",
    };

    const res = await client.users.$post({
      json: invalidUser,
    });

    const jsonResponse = await res.json();
    expect(res.status).toBe(400);
    expect(jsonResponse.success).toBe(false);
  });

  test("GET /users - should return list of users", async () => {
    const res = await client.users.$get({
      query: { page: "1", limit: "10" },
    });

    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.pagging).toBeDefined();
    expect(jsonResponse.data).toBeInstanceOf(Array);
  });

  test("DELETE /users/:id - should delete the user", async () => {
    const res = await client.users[":id"].$delete({
      param: {
        id: testUserId,
      },
    });

    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(true);
  });
});
